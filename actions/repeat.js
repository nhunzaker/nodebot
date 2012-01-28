// Repeat actions
// -------------------------------------------------- //

module.exports = function repeat () {
    
    var action = "";
    
    if (this.memory.tasks === []) {
        this.say("I haven't done anything yet.");
        return this.request();
    } else {
        action = this.memory.tasks.slice(-1).toString();
    }
    
    // Run the old action
    return this.analyze(action);

};