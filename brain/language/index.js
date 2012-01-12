// The Language Module
// A brute force classifier of the english language
// -------------------------------------------------- //

var natural       = require('natural')
,   parser        = {}
,   tokenizer     = new natural.TreebankWordTokenizer()
,   _             = require("underscore")
,   nounInflector = new natural.NounInflector()
,   verbInflector = new natural.NounInflector()
;

natural.BayesClassifier.load(__dirname + '/classifier.json', null, function(err, classifier) {
    parser = classifier;
});

// Basic English Classifications
var pronoun_list  = [ 
    "I", "i", "me", "my", "mine",
    "you", "your", 
    "he", "she","him","her", "his", "hers", 
    "we", "us", "our", 
    "it", "its", "they", "their", "them",
    "\'s", "\'"
];

var keyverb_list = [
    "to", "be", "been", "being", 
    "is", "are", "am", "was", "were", "have"
];

var actions = [ 
    "who", "what", "repeat", "validate"
];

var keyword_list = natural.stopwords.filter(function(i) {
    return i.length > 1 || i === "a" || i === "i";
});

keyword_list.push("?");
keyword_list.push("when");


// -------------------------------------------------- //


var language = {

    // Processes a part of speach and returns an object of values
    process: function (string) {
        
        var tokens      = tokenizer.tokenize(string.toLowerCase()).filter(function(a) { return a !== "?"; })
        
        ,   action      = tokens.indexOf(_.intersection(tokens, actions).join("").trim() || parser.classify(string))
        ,   ownership   = tokens.indexOf(_.intersection(tokens, pronoun_list).slice(-1).toString())
        ,   keyverb     = tokens.indexOf(_.intersection(tokens, keyverb_list).slice(-1).toString())

        ,   description = tokens
        
        ,   isQuestion  = (action !== -1 || keyverb === undefined || keyverb === 0)
        
        ,   subject     = "definition"
        ;

        // Deal with possessive nouns accordingly
        if (tokens[ownership] && tokens[ownership][0] === "\'") {
            
            tokens.splice(ownership, 1);

            ownership--;
            keyverb -= (keyverb > ownership) ? 1 : 0;
            
        }

        // Find the appropriate subject        
        subject = ( (keyverb > ownership) ? tokens.slice(ownership + 1, keyverb) : tokens.slice(ownership + 1) ).join(" ").trim();
        
        if (action === -1) {
            action = "relabel";
        }
        
        description = tokens.join(" ").replace(subject, "").replace(tokens[ownership], "").replace(tokens[keyverb], "").trim();

        // Deal with special instances of ownership
        switch(tokens[ownership]) {

        case "me": case "my": case "i": case "I":
            ownership = "user";
            break;
        case "your": case "you":
            ownership = "nodebot";
            break;
        case "it": case "its": case "their": case "he": case "she": case "his": case "hers":
            ownership = this.memory.context;
        case "":
            ownership = subject;
            break;
        case undefined:
            ownership = description;
            subject = "definition";
            break;
        default:
            ownership = tokens[ownership];
        }
        
        // Bulletproof subject
        subject = (subject === "") ? "definition" : subject;
        // Bulletproof ownership
        if (ownership === "" && keyverb === -1) {
            ownership = tokens[1];
            subject   = tokens[1];
        } 
        
        // Addresses "Is nodebot.js valid?"
        if (keyverb === 0 && isQuestion) {
            subject = tokens.slice(1, -1).join(" ").trim();
        }
        
        if (description === ownership){
            ownership = tokens.slice(0, keyverb).join(" ").trim();
        } 

        if (ownership === tokens[action]) {
            ownership = description;
        }
        
        // Bulletproof keyverbs
        // Addresses "Validate file.js"
        if (keyverb === -1) {
            subject = tokens.slice(action + 1).join(" ").trim();
        } 

        return {
            action      : tokens[action] || parser.classify(string),
            description : description || "",            
            keyverb     : tokens[keyverb] || "is",
            ownership   : ownership || "",
            subject     : subject || "",
            tokens      : tokens || [],

            isQuestion  : isQuestion || false
        };

    },

    pluralize: function (count, string, type) {

        count  = (typeof count === "number") ? count : count.length;        

        var plural = count.toString()
        ,   method = (count === 1) ? "singularize" : "pluralize";
        
        switch(type) {
        case "verb":
            plural += " " + verbInflector[method](string).toString();
            break;
        default:
            plural += " " + nounInflector[method](string).toString();
        }

        return plural;
        
    },

    possessify: function (string) {

        var str = string;

        if (!language.isPossessive(string) && string !== "") {
            str = str + (str.split("").slice(-1).toString().toLowerCase() === "s" ? "'" : "'s");
        }

        return str;

    },

    depossessify: function (string) {

        var str = string;

        if (language.isPosessive(str)) {
            
            if (!str.search("'s")) {
                str = str.split("").slice(0, -2).join("");
            } else {
                str = str.split("").slice(0, -1).join("");
            }
            
        }
        
        return str;
    },
    
    isPossessive: function (string) {
        var str = string;
        str = str.split("").splice(-2).join("");
        
        return (str === "'s" || str === "s'");
    },

    capitalize: function (string) {
        return string[0].toUpperCase() + string.split("").slice(1).join("");
    }
    
};

module.exports = language;
