// What.js
// "What is your name?", 
// "What is the capital of Spain?"
// -------------------------------------------------- //

var lang    = require("../brain/language")
,   fileEx  = Nodebot.lexicon.file["regular expression"]
;

module.exports = function what (a) {
    
    var nodebot   = this
    ,   owner     = a.owner
    ,   subject   = a.subject || "definition"

    ,   base      = (owner) ? nodebot.lexicon[owner] : nodebot.lexicon
    ,   term      = (subject && base) ? base[subject] : undefined
    ;
    
    // Just some more bullet proofing for the subject
    if (owner === subject) subject === "definition"

    // If the term is a function, call it to determin the value
    if (typeof term === "function") term = term().toString();
    
    // If it is a file, simply return that it is a file
    if (fileEx.test(subject)) {
        return nodebot.say(owner.cyan + " is a file.").request(); 
    }


    // Do we have a definition for ths subject?
    // -------------------------------------------------- //
    if (term) {
        
        switch (subject) {
            
        case "definition":
            nodebot.say(lang.capitalize(owner) + " is " + term.green.bold);
            break;
        default:
            nodebot.say(lang.possessify(lang.capitalize(owner)) + " " + subject + " is " + term.toString().green.bold);
        }
        
        return nodebot.request();

    }

    // no : learn it

    nodebot.ask("Hmm... I can't remember. Care to tell me what " + lang.possessify(owner) + " " + subject + " is?", function(text) {

        if (text[0].toLowerCase() === "no") {
            nodebot.say("Okay, I'll forget you ever asked.");
            return nodebot.request();
        }
        
        nodebot.lexico[nowner] = nodebot.lexicon[owner] || {};
        nodebot.lexicon[owner][subject] = text;
        nodebot.say("Great, now I know!");
        
        return nodebot.request();
    });

    return;
};
