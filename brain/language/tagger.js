// Tagger.js
// -------------------------------------------------- //

var lev = require("levenshtein")
,   pos = require('pos')
,   lexer  = new pos.Lexer()
,   tagger = new pos.Tagger()
,   fileEx = Nodebot.lexicon.file["regular expression"]
;


// Finds the closest match between a statement
// and a body of words
var closest = module.exports.closest = function(string, words) {

    var shortest = words.toString().length
    ,   bestFit  = "";
    
    if (typeof words === 'string') {
        words = lexer.lex(words);
    }

    words.forEach(function(word) {
    
        var distance = lev(string, word);
        
        if (distance < shortest) {
            bestFit  = word;
            shortest = distance;
        }

    });
    
    return bestFit;
}

// Checks if a string is fileish
var isFile = module.exports.isFile = function(string) {
    return (string.replace(/\s/g, "").match(fileEx) !== null);
};


// Returns the part of speech for a particular word
var getType = module.exports.getType = function (string) {
    return tagger.tag(lexer.lex(string))[0][1];
};


// Finds all words between the last of the first and last
// of two types
var getBetween = module.exports.getBetween = function(lex, type1, type2) {

    var tagged = tagger.tag(lex)
    , filter1 = filter2 = [];

    type1 = (typeof type1 === 'string') ? [type1] : type1;
    type2 = (typeof type2 === 'string') ? [type2] : type2;

    filter1 =  tagged.filter(function(i) { return type1.indexOf(i[1]) !== -1 }) || [];
    filter2 =  tagged.filter(function(i) { return type2.indexOf(i[1]) !== -1  }) || [];

    var start  = (filter1[0]) ? filter1[0][0] : undefined
    ,   end    = (filter2.slice(-1)[0]) ? filter2.slice(-1)[0][0] : undefined;

    
    if (start || end) {
        return lex.slice(lex.indexOf(start) + 1, lex.indexOf(end) + 1);
    } else {
        return [];
    }


};

// Classifies all words in an array
var getTypes = module.exports.getTypes = function (array, string, strict) {

    var type = array.filter(function(word) {

        if (strict) {
            return (word[1] === string);
        } else {
            return (word[1].slice(0,string.length) === string);
        }

    }).map(function(w) { return w[0] });

    
    return type;
};


var classify = module.exports.classify = function(speech) {

    var text   = speech || process.argv.slice(2).join(" ")
    ,   words  = lexer.lex(text)
    ,   tagged = tagger.tag(words)
    ,   action = subject = owner = false;

    // Classify!
    // -------------------------------------------------- //

    var verbs       = getTypes(tagged, "VB")
    ,   nouns       = getTypes(tagged, "NN")
    ,   pronouns    = getTypes(tagged, "P")
    ,   actions     = getTypes(tagged, "W")
    ,   adverbs     = getTypes(tagged, "R")
    ,   adjectives  = getTypes(tagged, "JJ")
    ,   websites    = getTypes(tagged, "URL")
    ,   preps       = getTypes(tagged, "IN")
    ,   determiners = getTypes(tagged, "DT")
    ;



    // ACTION
    // Answers : "What should the nodebot do after given a 
    // command"
    // -------------------------------------------------- //

    // Are there actions present?
    if (actions.length > 0) {
        action = actions[0];

    } else if (getTypes(tagged, "VB", true).length > 0) {

        // Are there base verbs present?
        action = getTypes(tagged, "VB", true).slice(-1)[0];

        // Are there at least any adjectives that might work?
    } else {
        action = adjectives[0];
    }


    // OWNERSHIP
    // Answers : "Who is associated with the target of the
    // action?"
    // -------------------------------------------------- //
    

    var posession = tagged.filter(function(i) { return i[1] === "PRP$" || i[1] === "PRP"; });

    // If there is posession, then use it
    if (posession.length > 0) { 
        owner = posession[0][0];
    }

    // No ? Let's try between a preposition and 
    // determiners/nouns
    else if (determiners.length > 0 && preps.length > 0) {

        owner = getBetween(words, "IN", ["DT", "NN"]);

        // Strip accidental determinates
        if (getType(owner[0]) === "DT") owner = owner.slice(1);
        
        owner = owner.join(" ");
    }

    else if (verbs.length > 0) {

        owner = getBetween(words, ["VBZ", "VBP"], ".").slice(0, -1)

        // Strip accidental determinates
        if (getType(owner[0]) === "DT") owner = owner.slice(1);
        
        owner = owner.join(" ");
    }


    // SUBJECT
    // Answers : "What should the nodebot's action target?"
    // -------------------------------------------------- //

    // If ownership, then the and the next word is a noun then
    // the subject is the noun
    if (owner) {
        subject = getBetween(words, ["DT", "PRP$"], ["IN", "."]).slice(0, -1).join(" ");
    } 
    // If there are no nouns and there is an owner, the subject is the owner
    else if (nouns.length === 0 && owner) {
        subject = owner;
    }

    // Okay, if that isn't true and we have prepositions
    // then the subject will be the words following
    
    // Start with the word after the preposition
    // end with the next adjective or prep we see

    else if (preps.length > 0) {
        subject = getBetween("IN", ["IN", "VBZ", "."]);
    } 

    // Cute, at this point we check for determiners 
    // (the, some...)

    else if (determiners.length > 0) {
        var det = determiners.slice(-1)[0];
        subject = words[words.indexOf(det) + 1];
    } 
    
    // Now let's check if the first verb is
    // present-tense, then it's probably between
    // the first verb and the action
    
    else if (getType(verbs[0]) === "VBZ") {

        var start = words.indexOf(verbs[0]) + 1
        ,   end   = words.indexOf(action);
        
        subject = words.slice(start, end).join(" ");
        
    } 


    // Autocorrect for files
    // we didn't accidently add whitespace
    subject = (isFile(subject)) ? subject.replace(/\s/g, "").match(fileEx)[0] : subject
    owner = (isFile(owner)) ? owner.replace(/\s/g, "").match(fileEx)[0] : owner

    // Now that everything is properly classified,
    // let's filter the ownership

    switch(owner) {

    case "me": case "my": case "i": case "I":
        owner = "user";
        break;

    case "your": case "you":
        owner = "nodebot";
        break;
        
    case undefined: case "it": case "its": 
    case "they": case "their": case "he": case "she": 
    case "his": case "hers":
        owner = this.memory.context;
        break;
    }
    

    // If the subject is the same as the owner, make a last
    // minute correction

    if (subject === owner) subject = "definition";
    
    // Return what we find
    // -------------------------------------------------- //

    var ret = {
        action  : action,
        owner   : owner,
        subject : subject,
        tokens  : words
    };

    return ret;
}
