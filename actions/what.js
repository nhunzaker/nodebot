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

    var app_id = "GVH84U-9YQ66P7PU3";

    var qs = require('querystring')
    ,   sax    = require("../sax-js")
    ,   strict = true
    ,   parser = sax.parser(strict)
    ,   request = require("request")
    ,   data = qs.stringify({ input: a.tokens.join(" ") })
    ;

    
    nodebot.say("Hmm, I don't know off the top of my head. Give me a minute...");

    request.get("http://api.wolframalpha.com/v2/query?" + data + "&appid=" + app_id, function(err, data) {

        var result = []

        parser.ontext = function(t) {
            var proc = t.trim();
            if (proc !== "" && proc !== "\n") result.push(proc)
        };

        parser.onend = function () {

            nodebot.say("Here's what %s has to say:\n", "WolframAlpha".red.bold);

            var tidbit = [];
            
            var width = 80;
            var space = Array(~~((width/2) - (result[0].length / 2))).join(" ");

            console.log(Array(width).join("-"));
            console.log(space + result[0].bold.red);
            console.log(Array(width).join("-"));

            result = result.filter(function(i) { return i.trim() !== ""; });

            result.slice(1, 3).forEach(function(i) {

                tidbit = i.split("|");

                var term = tidbit[0];

                console.log(term.bold.trim() + "\n" + tidbit.slice(1).join(":"));

            });

        };
        
        parser.write(data.body).close();
        

    });

    return;
};
