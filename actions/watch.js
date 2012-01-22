// Watch
// -------------------------------------------------- //

var fs = require('fs')
,   os = require('os');

// Scanners
var urlEx  = Nodebot.lexicon.url['regular expression']
,   fileEx = Nodebot.lexicon.file['regular expression']
,   jsEx   = Nodebot.lexicon.javascript['regular expression']
,   cssEx  = Nodebot.lexicon.css['regular expression']
,   htmlEx = Nodebot.lexicon.html['regular expression']
;

module.exports = function watch (a) {

    var file    = a.subject || "./"
    ,   nodebot = this
    ,   stat;

    // Bullet proof websites
    if (file.match(urlEx)) {
        this.say("This is a website. I don't know how to watch these yet, so I'll pass it through the web validator");
        return nodebot.actions.validate.apply(this, [a]);
    }  

    try {
        stat = fs.statSync(file);
    } catch (err) {
        console.log(err);
        nodebot.say("I couldn't find that file, does it exist?");
        return nodebot.request();
    }

    // Watch files
    // -------------------------------------------------- //

    stat.isFile() && fs.watchFile(file, { persistent: true, interval: 1000 }, function (curr, prev) {

        var content = fs.readFileSync(file, "utf-8");
        
        if (content !== nodebot.memory.watched_content) {
            nodebot.say("Looks like something has changed on " + file.blue.bold);
            actions.validate.apply(nodebot, [a, true]);

            // Update with new content
            nodebot.memory.watched_content = content;
        }
    });

    
    // Watch directories
    // -------------------------------------------------- //

    if (stat.isDirectory()) {

        // Are we dealing with OSX?
        switch(os.type()) {
            
        case "Darwin":
            nodebot.say("I can't watch for directory changes on OSX, I'm sorry :(");
            break;

        default:
            fs.watch(file, { persistent: true, interval: 1000 }, function (event, filename) {

                if (!filename) return false;

                var content = fs.readFileSync(filename, "utf-8");
                
                if (content !== nodebot.memory.watched_content) {
                    nodebot.say("Looks like something has changed on " + file.blue.bold);
                    actions.validate.apply(nodebot, [a, true]);

                    // Update with new content
                    nodebot.memory.watched_content = content;
                }
            });
        }

    }

    
    // Closeout
    // -------------------------------------------------- //

    nodebot.say("I am now watching " + file.blue.bold);

    // Make it so that when the user exits watching, it loads
    // up another prompt
    process.once('SIGINT', function () {
        nodebot.say("I am no longer watching " + file.blue.bold);
        nodebot.request();
    });
    
};
