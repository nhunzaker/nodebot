// Uglify
// -------------------------------------------------- //

var fs = require('fs');

// Scanners
var urlEx  = Nodebot.lexicon.url['regular expression']
,   fileEx = Nodebot.lexicon.file['regular expression']
;

var supported = ['javascript'];

module.exports = function uglify (a) {

    var directory = a.owner || "./"
    ,   filetype  = a.subject
    ,   nodebot   = this
    ,   stat;

    console.log(a);    
    
    // Bullet proof websites
    if (directory.match(urlEx)) return nodebot.request("Sorry, I can't compile websites");

    try {
        stat = fs.statSync(directory);
    } catch (err) {
        nodebot.say("Hmm, I couldn't find %s. Does it exist?", directory);
        return nodebot.request();
    }

    // Watch directories
    // -------------------------------------------------- //

    if (stat.isDirectory()) {
        
        fs.watch(directory, { persistent: true, interval: 1000 }, function (event, filename) {
            nodebot.say("Looks like something has changed in " + directory.blue.bold);
        });

    }

    // Closeout
    // -------------------------------------------------- //

    nodebot.say("I am now compiling all %s in %s", filetype.blue.bold, directory.blue);

    // Make it so that when the user exits watching, it loads
    // up another prompt
    process.once('SIGINT', function () {
        nodebot.request("Okay, I am no longer watching", directory.blue.bold);
    });
    
};
