// Who
// -------------------------------------------------- //

var lang = require("../brain/language");

module.exports = function who(a) {

    var nodebot = this
    ,   owner = a.owner
    ,   key = a.subject
    ;

    // Special instances
    // -------------------------------------------------- //
    switch(owner){
        
    case "nodebot":
        
        if (this.lexicon.nodebot[key]) {
            this.say("My " + key + " is " + this.lexicon.nodebot[key]);
        } else {
            this.say(this.lexicon.nodebot.name + " is " + this.lexicon.nodebot.definition);
        }

        return this.request();

    case "user":

        if (this.lexicon.user[key]) {
            this.say("You are my master, " + this.lexicon.user.name);
        } else {
            this.say("Hmm... I can't remember, " + this.lexicon.user.name);
        }
        return this.request();
    }


    // Typical cases
    // -------------------------------------------------- //
    
    if (nodebot.lexicon[owner] !== undefined) {
        this.say(lang.capitalize(owner) + " is " + this.lexicon[owner][key].green.bold);
        return this.request();
    }

    
    return nodebot.actions.what.apply(nodebot, [a]);
    

};
