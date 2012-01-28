// Javascript Compressor
// A simple module for uglifying javascripts
// -------------------------------------------------- //

var jsp = require("uglify-js").parser,
    pro = require("uglify-js").uglify,
    fs  = require('fs');


// Given an array, move the "from" to "to"
// -------------------------------------------------- //

function move (array, from, to) {
    array.splice(to, 0, array.splice(from, 1)[0]);
};


// Get all requirements from files and sort accordingly
// -------------------------------------------------- //

function sortRequirements (files, directory) {

    var output = [];

    files.forEach(function (item) {

        var doc = item[1].split("\n\n")[0];

        if (!doc) return false;
        
        var match = doc.match(/\/\/- require\s\S+(\s+|)/ig),
            matches = [];

        match && match.forEach(function(m) {
            var req = m.replace(/\/\/- require\s/ig, "").trim();
            
            matches.push(directory + "/" + req);
        });
        
        output.push({
            filename     : item[0],
            content      : item[1],
            requirements : matches
        });

    });

    // For each file we output
    output.forEach(function(a, indexParent) {
        
        // Check each file for possible requirements
        output.forEach(function(b, indexChild) {
            
            // Yes? move the required child before the parent
            if (a.requirements.indexOf(b.filename) > -1) {
                move(output, indexChild, indexParent);
            }

        });

    });

    return output.reverse();
}



// A simple uglifier script
function compress (filename, content) {

    var ret = "";

    content = jsp.parse(content.toString());
    content = pro.ast_mangle(content);
    content = pro.ast_squeeze(content);

    // Add the records
    ret += "\/\/ " + filename;
    ret += "\n" + pro.gen_code(content) + "\n\n";

    return ret;

};


// A simple uglifier script
function compressAll (directory, files, filename) {

    var stack   = [],
        newFile = directory + "/" + (filename || "javascript.min.js"),
        filter  = Nodebot.lexicon.javascript["regular expression"];

    // Filter down to only the non-hidden files of the type
    // And not the filtered file we'll create

    files.filter(function(filename) {
        return filter.test(filename) && filename !== newFile;
    }).forEach(function(filename) {
        try {
            stack.push([filename, fs.readFileSync(filename).toString()]);
        } catch (x) {
            console.log("Could not read file %s", filename);
        }
    });

    files = sortRequirements(stack, directory);

    var output = "// Uglified by Nodebot \n//\n// " + new Date().toString()
            + "\n\/\/" + Array(80).join("-")
            + "\n\n"
    ;

    files.forEach(function(f) {
        output += compress(f.filename, f.content);
    });

    return output;

};



// Exports
// -------------------------------------------------- //

module.exports.all    = compressAll;
module.exports.single = compress;