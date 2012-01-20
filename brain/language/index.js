// The Language Module
// A brute force classifier of the english language
// -------------------------------------------------- //

var natural       = require('natural')
,   nounInflector = new natural.NounInflector()
,   verbInflector = new natural.NounInflector();


// -------------------------------------------------- //


var language = {

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

    singularize: function (string, type) {

        switch(type) {
        case "verb":
            return verbInflector.singularize(string).toString();
        default:
            return nounInflector.singularize(string).toString();
        }
        
    },

    possessify: function (str) {

        if (!language.isPossessive(str) && str !== "") {
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
    
    isPossessive: function (str) {
        str = str.split("").splice(-2).join("");
        
        return (str === "'s" || str === "s'");
    },

    capitalize: function (string) {
        if (typeof string !== 'string') return string;
        return string[0].toUpperCase() + string.split("").slice(1).join("");
    }
    
};

module.exports = language;
