// The Analysis Module
// -------------------------------------------------- //

var growl = require('growl');

function add_interaction_module(context) {

    var nodebot = context;

    // Handle Prompts
    // -------------------------------------------------- //

    nodebot.ask = function ask(question, callback) {
        var stdin  = process.stdin
        ,   stdout = process.stdout;
        
        stdout.write("\n" + this.lexicon.nodebot.name.magenta.bold + ": " + question + "\n Response: ".blue.bold);
        stdin.resume();
        
        stdin.once('data', function(data) {
            callback(data.toString());
        });
        
    };

    nodebot.request = function() {
        var statement = "What can I help you with?";        
        nodebot.ask(statement, function(command) {
            nodebot.analyze(command);
        });
    };

    nodebot.say = function(message) {
        console.log("\n" + nodebot.lexicon.nodebot.name.magenta.bold + ": " + message);
    };

    nodebot.growl = function (message, type) {

        var faces = {
            base  : "../images/robot.png",
            error : "../images/robot_error.png"
        };

        growl(message, { title: 'NodeBot:', image: faces[type] || faces.base });
    };

}

module.exports = add_interaction_module;
