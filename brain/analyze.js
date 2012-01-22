// The A Module
// -------------------------------------------------- //

var language = require("./language")
,   tagger = require("./language/tagger")
,   n = Nodebot;

module.exports = function (data) {

    var a = tagger.classify.apply(n, [data]);

    if (!a.action || (!a.owner && a.subject === "")) {
        n.say("I'm not sure what you are asking me to do, please clarify");
        return n.request();
    }
    
    // Now, let's also figure out the best action to take based upon
    // what the nodebot can actually do
    var action = tagger.closest(a.action, Object.keys(this.actions));
    
    // Unless we are repeating the action, store it for later recollection
    if (a.action !== "repeat") {
        n.memory.tasks.push(data);
        n.memory.context = a.ownership;
    } 
    
    return n.actions[action].apply(n, [a]);        

};