// The Analysis Module
// -------------------------------------------------- //

var growl = require('growl');

module.exports = function add_interaction_module(context) {

    var nodebot = Nodebot;

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

    nodebot.say = function() {
        arguments[0] = "\n" + nodebot.lexicon.nodebot.name.magenta.bold + ": " + arguments[0];
        console.log.apply(nodebot, arguments);
    };

    nodebot.growl = function (message, type) {
        growl(message, { title: 'NodeBot:' });
    };

};