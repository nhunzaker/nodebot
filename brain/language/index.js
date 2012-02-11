// The Language Module
// -------------------------------------------------- //

var speak = require("speakeasy-nlp");
var lang = {};

lang.classify = speak.classify;
lang.closest  = speak.closest;

lang.possessify = function (str) {

    if (!lang.isPossessive(str) && str !== "") {
        str = str + (str.slice(-1).toLowerCase() === "s" ? "'" : "'s");
    }

    return str;

};

lang.depossessify = function (string) {

    var str = string;

    if (lang.isPossessive(str)) {
        
        if (str.match("'s")) {
            str = str.slice(0, -2);
        } else {
            str = str.slice(0, -1);
        }
        
    }
    
    return str;
};

lang.isPossessive = function (str) {
    str = str.slice(-2);
    
    return (str === "'s" || str === "s'");
};

lang.capitalize = function (string) {
    if (typeof string !== 'string') return string;
    return string[0].toUpperCase() + string.slice(1);
};

module.exports = lang;