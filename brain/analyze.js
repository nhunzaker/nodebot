// The A Module
// -------------------------------------------------- //

var language = require("./language")
,   n = Nodebot;

module.exports = function (data) {

    var a = language.process(data);    

    if (a.action !== "repeat") {
        n.memory.tasks.push(data);
        n.memory.context = a.ownership;
    } else {
        a.isQuestion = true;
    }

    // Is it a question?
    if (a.isQuestion) {
        // yes : take the appropriate action
        return n.actions[a.action].apply(n, [a]);
    } else {
        // no : we're dealing with a command.
        return n.actions.relabel.apply(n, [a]);
    }
    
    return n.request();

};