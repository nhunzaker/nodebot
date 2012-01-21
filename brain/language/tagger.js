// Tagger.js
//
// Breaks up speech into components and assists with
// classifying things such as the subject, ownership,
// and action for a statement
//
// Note: I am not a linguist, this is the result of
// blood, sweat, and tears!
//
// Please help me make this better:
// https://github.com/nhunzaker/nodebot
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
    string = string || "";
    return (string.replace(/\s/g, "").match(fileEx) !== null);
};


// Returns the part of speech for a particular word
var getType = module.exports.getType = function (string) {
    
    if (string) {
        return tagger.tag(lexer.lex(string))[0][1];
    } else {
        return undefined;
    }
    
};


// Finds all words between the last of the first and last
// of two types
var getBetween = module.exports.getBetween = function(lex, type1, type2, form) {

    var tagged = tagger.tag(lex)
    , filter1 = filter2 = start = end = [];

    form = form || "outside"

    type1 = (typeof type1 === 'string') ? [type1] : type1;
    type2 = (typeof type2 === 'string') ? [type2] : type2;

    filter1 =  tagged.filter(function(i) { return type1.indexOf(i[1]) !== -1 }) || [];
    filter2 =  tagged.filter(function(i) { return type2.indexOf(i[1]) !== -1  }) || [];
    
    if (form === "outside") {
        start = (filter1[0]) ? filter1[0][0] : undefined
    } else {
        start = (filter1.slice(-1)[0]) ? filter1.slice(-1)[0][0] : undefined
    }

    end = (filter2.slice(-1)[0]) ? filter2.slice(-1)[0][0] : undefined;
    
    
    return (start || end) ? lex.slice(lex.indexOf(start) + 1, lex.indexOf(end) + 1) : [];

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


var classify = module.exports.classify = function(speech, debug) {

    var text   = speech || process.argv.slice(2).join(" ")
    ,   words  = lexer.lex(text)
    ,   tagged = tagger.tag(words)
    ,   action, subject, owner;


    if (debug) {
        console.log(tagged);
    }
    
    // Classify!
    // -------------------------------------------------- //

    var verbs       = getTypes(tagged, "VB")
    ,   nouns       = getTypes(tagged, "NN")
    ,   pronouns    = getTypes(tagged, "PRP") // finds all posessive pronouns
    ,   actions     = getTypes(tagged, "W")
    ,   adverbs     = getTypes(tagged, "R")
    ,   adjectives  = getTypes(tagged, "JJ")
    ,   websites    = getTypes(tagged, "URL")
    ,   preps       = getTypes(tagged, "IN")
    ,   determiners = getTypes(tagged, "DT")
    ,   to          = getTypes(tagged, "TO")
    ;


    // ACTION
    // Answers : "What should the nodebot do after given a 
    // command"
    // -------------------------------------------------- //

    // Are there known action words present?
    if (actions.length > 0) {
        action = actions[0];
    } 

    // Are there base verbs present? Then it's probably
    // the first verb
    else if (getTypes(tagged, "VB", true).length > 0) {
        action = getTypes(tagged, "VB", true)[0];
    } 

    // Are there at least any adjectives that might work?
    else if (adjectives.length > 0) {
        action = adjectives[0];
    }

    // Lowercase the action if we find one
    action = (action) ? action.toLowerCase() : action;



    // OWNERSHIP
    // Answers : "Who is associated with the target of the
    // action?"
    // -------------------------------------------------- //
    
    // If there is posessive pronouns and we have an action, then
    // the owner is the last posessive word

    if (pronouns.length > 0 && action) {

        owner = pronouns.slice(-1)[0];

        // More bulletproofing, if the owner word is not self-
        // posessive and is found further  in the sentence than 
        // the action, then we need to igore all of the 
        // verbs/posessives before the action
        //
        // ex: "Do you know what the current directory is?"
        if (getType(owner) !== "PRP$" && words.indexOf(owner) < words.indexOf(action)) {
            owner = getBetween(words, ["DT"], "NN").join(" ");
        }

    }

    // No ? Let's try between a preposition and 
    // determiners/nouns
    else if (determiners.length > 0 && preps.length > 0) {

        owner = getBetween(words, ["IN"], ["DT", "NN", "."]);

        // Strip accidental determinates
        if (getType(owner[0]) === "DT") owner = owner.slice(1);

        // Strip accidental punctuation
        if (getType(owner.slice(-1)[0]) === ".") owner = owner.slice(0, -1);

        owner = owner.join(" ").trim();
    }

    // Hmm, now let's try between the action and the word "to"
    else if (verbs.length > 0 && to.length > 0) {
        owner = getBetween(words, "VB", "TO", "outside").slice(0, -1).join(" ");
    }

    // At this point, we can really only guess that
    // the owner is between the verb and the end of the
    // statement
    else if (verbs.length > 0) {

        owner = getBetween(words, ["VBZ", "VBP"], ".").slice(0, -1);

        // Strip accidental determinates
        if (getType(owner[0]) === "DT") owner = owner.slice(1);

        // Strip accidental puncuation
        if (getType(owner[0]) === ".") owner = owner.slice(1);

        owner = owner.join(" ").trim();

    }


    // SUBJECT
    // Answers : "What is this statement about?"
    // -------------------------------------------------- //

    // If there is a file within the statement, it's probably
    // the subject
    if (speech.match(fileEx) !== null) {
        
        // Mainly this is to address
        // "Convert file.x to format
        if (to.length > 0) {
            subject = getBetween(words, "TO", ["NN", "VB"]).join();
        } else {
            subject = speech.match(fileEx)[0].trim();
        }

    }

    // If there is a website within the statement, it's probably
    // the subject
    else if (websites.length > 0) {
        subject = websites[0].trim();
    }
    
    // If ownership and there are prepositions, scan for words beween
    // prepositions, determinates, and posessive words and
    // prepositions, nouns, and puncuation
    else if (owner && preps.length > 0) {

        // To account for more than one preposition, we need to be able to filter between
        // either the inside or outside preposition

        // This is nitpicky, but is the action a verb? If so, we need
        // to run another piece of logic:
        if (getType(action) !== "VB" && preps.length === 1) {
            // yes : the subject is between the determiner/posessive
            // and the preposition
            subject = getBetween(words, ["DT", "PRP$"], ["IN"], "outside");
        }  else if (preps.length === 1) {
            // no : the subject is between to/a posessive and a preposition
            subject = getBetween(words, ["TO", "PRP$"], ["IN"], "outside");
        } else {
            subject = getBetween(words, ["IN", "DT", "PRP$"], ["IN", "NN", "."], "inside");
        }

        // Autocorrect for trailing punctuation
        if (getType(subject.slice(-1)[0]) === ".") {
            subject = subject.slice(0, -1);
        }

        // Autocorrect for trailing ownership
        if (subject.slice(-1)[0] === owner) {
            subject = subject.slice(0, -1);
        }
        
        // Autocorrect for trailing prepositions
        if (getType(subject.slice(-1)[0]) === "IN") {
            subject = subject.slice(0, -1);
        }

        subject = subject.join(" ").trim();

    } 
 
    // If there *is* ownership, and there are no prepositions
    // then the subject is inside the owner/determinate/verb and the last noun
    // (*phew...*)
    else if (owner && preps.length === 0) {

        subject = getBetween(words, ["DT", "VBP", "PRP$"], "NN", "inside");

        // Strip accidental catches of the actions
        if (subject[0] && subject[0].toLowerCase() === action) {
            subject = subject.slice(1);
        }

        // Strip accidental present tense verbs
        if (subject[0] && getType(subject[0]) === "VBZ") {
            subject = subject.slice(1);
        }
        
        subject = subject.join(" ");
    }


    // Let's check to make sure we properly treat file names
    if (owner && fileEx.test(owner.split(" ").join("")))   owner = owner.split(" ").join("");
    if (subject && fileEx.test(subject.split(" ").join(""))) subject = subject.split(" ").join("");

    
    // Now that everything is properly classified,
    // let's filter the ownership

    switch(owner) {
        
        // Reverse user possession
    case "me": case "my": case "i": case "I":
        owner = "user";
        break;
        
        // Reverse nodebot possession
    case "your": case "you":
        owner = "nodebot";
        break;
        
        // Tweak other non-specific possession cases to the last
        // recorded context
    case "it": case "its": 
    case "they": case "their": case "he": case "she": 
    case "his": case "hers":
        owner = Nodebot.memory.context;
        break;
    }
    

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
