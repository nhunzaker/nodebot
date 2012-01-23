
// Formatter.js
//
// Provides some helper functions

module.exports.align = function align (string, width, orientation) {

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



// Draws a horizontal line, given a length
// -------------------------------------------------- //

module.exports.drawLine = function drawLine (length) {
    console.log(Array(length || 80).join("-"));
}



// Keeps lines at a specific word count
// and keeps them in proper left alignment
// -------------------------------------------------- //

module.exports.clump = function clump (words, limit, lineOffset) {
    
    limit      = limit || 80;
    lineOffset = lineOffset || 0;
    
    var clump   = []
    ,   offset  = ""
    ,   line    = []
    ;
    
    // Run through a loop of all words
    words.split(" ").forEach(function(word) {
        
        // Get the length of the current line, which is:
        // the line offset + the current line + the new word
        var length = lineOffset + line.join(" ").length + word.length

        // Is the length of the new line greater than the limit?
        if (length <= limit) {

            // no : push the new word into the current line
            line.push(word.trim());

        } else {

            // yes : push the line in to the clump and reset 
            // the line
            clump.push(line.join(" "));
            line = [word];
        }

    });

    // This process skips the last line, so let's add it now:
    clump.push(line.join(" "));

    
    // Now, create the left margin by compressing an array
    // into a string
    offset = Array(lineOffset).join(" ");

    // Filter whitespace and pull everthing together
    clump = clump.map(function(c) { 
        return c.trim()
    }).join("\n" + offset).slice(0, -1);
    
    return clump;

};



// A whitespace generator
// Creates a blank Array and stitches it together
// -------------------------------------------------- //

module.exports.whitespace = function whitespace (length, max) {

    max = max || 12;

    var num   = Math.abs(12 - (length || 0))
    ,   space = Array(num);

    return space.join(" ");

}
