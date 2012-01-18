// The Language Module
// A brute force classifier of the english language
// -------------------------------------------------- //

var natural       = require('natural')
,   parser        = {}
,   tokenizer     = new natural.TreebankWordTokenizer()
,   _             = require("underscore")

,   nounInflector = new natural.NounInflector()
,   verbInflector = new natural.NounInflector()

,   english       = require("./english")()
,   keyverb_list  = english.keyverbs
,   pronoun_list  = english.pronouns
,   keyword_list  = english.keywords
,   actions       = english.actions
;

natural.BayesClassifier.load(__dirname + '/classifier.json', null, function(err, classifier) {
    parser = classifier;
    
    if (typeof Nodebot !== 'undefined') {
        Nodebot.emit("ready");
    }

});

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


        // -------------------------------------------------- //
        // The Subject
        // -------------------------------------------------- //

        subject = (subject === "") ? "definition" : subject;


        // -------------------------------------------------- //
        // The Ownership
        // -------------------------------------------------- //

        switch(tokens[ownership]) {

        case "me": case "my": case "i": case "I":
            ownership = "user";
            break;

        case "your": case "you":
            ownership = "nodebot";
            break;

        case "it": case "its": case "they": case "their": case "he": case "she": case "his": case "hers":
            ownership = this.memory.context;
            break;

        case "":
            
            if (keyverb === -1) {
                ownership = tokens[1];
                subject   = tokens[1];
            } else {
                ownership = subject;
            }

            break;

        case undefined:
            ownership = description;
            subject = "definition";
            break;

        default:
            ownership = tokens[ownership];
        }
        
        // Addresses "Is nodebot.js valid?"
        if (keyverb === 0 && isQuestion) {
            subject = ownership;
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
            ownership = subject = tokens.slice(action + 1).join(" ").trim();
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
        if (typeof string !== 'string') return string;
        return string[0].toUpperCase() + string.split("").slice(1).join("");
    }
    
};

module.exports = language;
