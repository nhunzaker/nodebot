// Relabel
// -------------------------------------------------- //


module.exports = function relabel (a) {
    
    var nodebot     = this
    ,   ownership   = a.ownership
    ,   subject     = a.subject
    ,   description = lang.capitalize(a.description)
    ;

    if (ownership === subject) {
        subject = "definition";
    }

    // Standard bullet proofing
    nodebot.lexicon[ownership] = nodebot.lexicon[ownership] || {};

    nodebot.ask("Just to confirm," + " you said that " + lang.possessify(ownership) + " " + a.subject + " " + a.keyverb + " " + description.green.bold + "? (y/n)", function(data) {

        if (data[0].toLowerCase() === "y") {
            nodebot.say("Okay, thanks! Now I know that " + (lang.possessify(ownership) + " " + subject + " is " + description).green.bold);
            nodebot.lexicon[ownership][subject] = description;
        } else {
            nodebot.say("I must be confused, sorry.");
        }

        return nodebot.request();

    });

};
