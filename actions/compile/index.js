// Compile
// -------------------------------------------------- //

// Uglify reqs
var fs = require('fs');

// Filters
var lex    = Nodebot.lexicon,
    fileEx = lex.file['regular expression'],
    urlEx  = lex.url['regular expression'],
    jsEx   = lex.javascript['regular expression'],

    supported = ['javascript'];


// Compresses files
// -------------------------------------------------- //

function compressor (directory, filetype, filename) {

    var filter     = Nodebot.lexicon[filetype]["regular expression"],
        newFile    = filename || filetype + ".min" + lex[filetype].mime,
        compress   = require("./" + filetype);

    fs.readdir(directory, function(err, files) {
        
        if (err) return false;

        files = files.map(function(f) {
            if (filename && f === filename) {
            } else {
                return directory + "/" + f;
            }
        });

        var compressed = compress.all(directory, files, filename);
        
        return fs.writeFile(directory + "/" + newFile.trim(), compressed);

    });

}


// The Compiler
// 
// Watches a directory for changes and compiles files
// of a specific type
// -------------------------------------------------- //

module.exports = function compile (a) {

    var target = a.owner || "./"
    ,   filetype  = a.subject
    ,   nodebot   = this
    ,   stat;

    // We shouldn't compress files we don't support
    if (supported.indexOf(filetype) < 0) return nodebot.request("Sorry, I can't compile %s", filetype);
    
    try {
        stat = fs.statSync(target);
    } catch (err) {
        
    }

    // Watch directories
    // -------------------------------------------------- //

    // Is the target a directory?
    if (stat && stat.isDirectory()) {
        
        // Yes, watch the target
        fs.watch(target, { persistent: true, interval: 1000 }, function () {
            nodebot.say("Files have changed. Compiling all %s in %s.", filetype.blue.bold, target.blue);
            compressor(target, filetype);
        });
        compressor(target, filetype);
        nodebot.say("I am now compiling all %s in %s", filetype.blue.bold, target.blue);

    } else {
        
        // No, use the current directory
        fs.watch(process.cwd(), { persistent: true, interval: 1000 }, function () {
            nodebot.say("Files have changed. Compiling all %s into %s.", filetype.blue.bold, target.blue);
            compressor(process.cwd(), filetype, target);
        });

        nodebot.say("I am now compiling all %s into %s", filetype.blue.bold, target.blue);
        compressor(process.cwd(), filetype, target);
    }
    
    // Closeout
    // -------------------------------------------------- //

    compressor(target, filetype);

    // Make it so that when the user exits watching, it loads
    // up another prompt
    process.once('SIGINT', function () {
        nodebot.request("Okay, I am no longer compiling %s files.", filetype.bold.blue, target.blue);
    });
    
};
