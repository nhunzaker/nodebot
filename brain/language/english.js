
// English.js
// Basic English Classifications
// -------------------------------------------------- //

var natural = require("natural");

module.exports = function english() {

    var self = english;

    self.pronouns = [ 
        "I", "i", "me", "my", "mine",
        "you", "your", 
        "he", "she","him","her", "his", "hers", 
        "we", "us", "our", 
        "it", "its", "they", "their", "them",
        "\'s", "\'"
    ];
    
    self.keyverbs = [
        "to", "be", "been", "being", 
        "is", "are", "am", "was", "were", "have",
        "does", "do"
    ];


    self.keywords = function() {
        var keywords = natural.stopwords.filter(function(i) {
            return i.length > 1 || i === "a" || i === "i";
        });

        keywords.push("?");
        keywords.push("when");
        return keywords;
    }();

    self.actions = [ 
        "who", "what", "repeat", "validate", "watch", "how"
    ];

    return self;

}
