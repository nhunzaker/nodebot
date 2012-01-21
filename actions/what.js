// What.js
// "What is your name?", 
// "What is the capital of Spain?"
// -------------------------------------------------- //

var lang    = require("../brain/language")
,   fileEx  = Nodebot.lexicon.file["regular expression"]
,   request = require("request")
;

module.exports = function what (a) {

    if (a.owner === a.subject) a.subject = "definition";

    var nodebot   = this
    ,   owner     = a.owner
    ,   subject   = a.subject || "definition"

    ,   base      = (owner) ? nodebot.lexicon[owner] : nodebot.lexicon
    ,   term      = (subject && base) ? base[subject] : undefined
    ;
    
    // Just some more bullet proofing for the subject
    if (owner === subject) subject === "definition";

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


    // No, search WolframAlpha
    // -------------------------------------------------- //

    var qs = require('querystring');

    var sax = require("../sax-js"),
    strict = true, // set to false for html-mode
    parser = sax.parser(strict);

    var request = require("request");

    var app_id = "GVH84U-9YQ66P7PU3"
    ,   repl   = require('repl');
    
    nodebot.say("Hmm, I don't know off the top of my head. Give me a minute...");

    var result = [];
    
    var data = qs.stringify({ input: a.tokens.join(" ") });

    request.get("http://api.wolframalpha.com/v2/query?" + data + "&appid=" + app_id, function(err, data) {

        nodebot.say("Here's what %s has to say:", "WolframAlpha".red.bold);

        parser.onopentag = function(tag){
            console.log(tag);
            parser.onattribute = function(att) {
//                console.log(att);
            };

        }

        parser.ontext = function(t) {
            var proc = t.trim();
            if (proc !== "" && proc !== "\n") result.push(proc)
        };

        parser.onend = function () {
            info = result;
            repl.start("> ");
        };
        
        parser.write(data.body).close();
        

    });

    
    /*
      nodebot.ask("Hmm... I can't remember. Care to tell me what " + lang.possessify(owner) + " " + subject + " is?", function(text) {

      if (text[0].toLowerCase() === "no") {
      nodebot.say("Okay, I'll forget you ever asked.");
      return nodebot.request();
      }
      
      nodebot.lexicon[owner] = nodebot.lexicon[owner] || {};
      nodebot.lexicon[owner][subject] = text;

      nodebot.say("Great, now I know!");
      
      return nodebot.request();
      });
    */
    return;
};
