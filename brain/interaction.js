// The Analysis Module
// -------------------------------------------------- //

var growl = require('growl'),
    util  = require("util");

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

        if (arguments) nodebot.say.apply(nodebot, arguments);

        var statement = "What can I help you with?";        
        nodebot.ask(statement, function(command) {
            nodebot.analyze(command);
        });
    };

    nodebot.say = function() {

        var message = util.format.apply(null, arguments);
        console.log(nodebot.lexicon.nodebot.name.magenta.bold + ": " + message);
        nodebot.io && nodebot.io.sockets.emit('output', message);

        return this;
    };

    nodebot.growl = function (message, type) {
        growl(message, { title: 'NodeBot:' });

        return this;
    };

};