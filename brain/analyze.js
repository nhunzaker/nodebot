// The Analysis Module
// -------------------------------------------------- //

function add_analysis_module(context) {

    var nodebot = context;

    nodebot.analyze = function(data) {
        
        var a = nodebot.language.process.apply(nodebot, [data]);
        
        if (a.action !== "repeat") {
            nodebot.memory.tasks.push(data);
            nodebot.memory.context = a.ownership;
        } else {
            a.isQuestion = true;
        }
        
        // We wrap all requests with a try/catch to gracefully recover from errors
        try {

            // Is it a question?
            if (a.isQuestion) {
                // yes : take the appropriate action
                return nodebot.actions[a.action].apply(nodebot, [a]);
            } else {
                // no : we're dealing with a command.
                return nodebot.actions.relabel.apply(nodebot, [a]);
            }
            
        } catch(error) {

            nodebot.say("I don't know " + a.action + " " + a.subject + " " + a.keyverb);

            if (error) {
                nodebot.say("This is probably because of " + "the following error: \n".bold.red);
                console.log(error);
            }
        }
            
        return nodebot.request();

    };

}

module.exports = add_analysis_module;
