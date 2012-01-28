// The Language Module
// -------------------------------------------------- //

function language () {

    this.classify = require("./tagger").classify;

    this.possessify = function (str) {

        if (!this.isPossessive(str) && str !== "") {
            str = str + (str.slice(-1).toLowerCase() === "s" ? "'" : "'s");
        }

        return str;

    };

    this.depossessify = function (string) {

        var str = string;

        if (this.isPossessive(str)) {
            
            if (str.match("'s")) {
                str = str.slice(0, -2);
            } else {
                str = str.slice(0, -1);
            }
            
        }
        
        return str;
    };
    
    this.isPossessive = function (str) {
        str = str.slice(-2);
        
        return (str === "'s" || str === "s'");
    },

    this.capitalize = function (string) {
        if (typeof string !== 'string') return string;
        return string[0].toUpperCase() + string.slice(1);
    }
    
    
};

module.exports = new language;
