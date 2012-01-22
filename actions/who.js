// Who
// -------------------------------------------------- //


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

    nodebot.ask("Hmm... I haven't met " + lang.capitalize(owner) + ". Who are they?", function(text) {

        if (text[0].toLowerCase() === "no") {
            nodebot.say("Okay, I'll forget about them");
            return nodebot.request();
        }

        nodebot.lexicon[owner] = nodebot.lexicon[owner] || {};
        nodebot.lexicon[owner][key] = text;
        nodebot.say("Great, now I know who " + lang.capitalize(owner) + " is!");

        return nodebot.request();

    });

};