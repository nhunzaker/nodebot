// The A Module
// -------------------------------------------------- //

var lang = require("./language"),
    n = Nodebot;

module.exports = function (data) {

    var a = lang.classify(data);

    // let's filter the ownership
    switch(a.owner) {
        
        // Reverse user possession
    case "speaker":
        a.owner = "user";
        break;
        
        // Reverse nodebot possession
    case "listener":
        a.owner = "nodebot";
        break;
        
        // Tweak other non-specific possession cases to the last
        // recorded context
    case "it": case "its": case "they": case "their":
    case "he": case "she": case "his": case "hers":
        a.owner = Nodebot.memory.context;
        break;
    }


    // If there is no action, but the owner is the user or the robot, it
    // is a relabeling
    
    if (!a.action || (!a.owner && a.subject === "")) {
        n.say("I'm not sure what you are asking me to do, please clarify");
        return n.request();
    }
    
    // Now, let's also figure out the best action to take based upon
    // what the nodebot can actually do
    var action = lang.closest(a.action, Object.keys(this.actions));
    
    // Unless we are repeating the action, store it for later recollection
    if (action !== "repeat") {
        n.memory.tasks.push(data);
        n.memory.context = a.ownership;
    } 
    
    return n.actions[action].apply(n, [a]);        

};