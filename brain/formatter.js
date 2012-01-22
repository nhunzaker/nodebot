
// Formatter.js
//
// Provides some helper functions

module.exports.textAlign = function textAlign(string, width, orientation) {

    var spacer = ""
    ,   count  = 0
    ;

    // We need to make sure the width is long enough
    width = (width > string.length) ? width : string.length;

    switch(orientation) {

    case "left":
        count = Math.round(width - string.length + 1);
        spacer = Array(count).join(" ");
        return string + spacer;
        
    case "right":
        count = Math.round((width - string.length) + 1);
        spacer = Array(count).join(" ");
        return spacer + string;
        
    case "center": default:
        count = Math.round(((width / 2) - (string.length / 2)) + 1);
        spacer = Array(count).join(" ");
        return spacer + string + spacer;
        
    }

};