// What.js
// "What is your name?", 
// "What is the capital of Spain?"
// -------------------------------------------------- //

var lang       = require("../brain/language")
,   fileEx     = Nodebot.lexicon.file["regular expression"]
,   request    = require("request")
,   format     = require("../brain/formatter")
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
    subject = (owner === subject) ? "definition" : subject;

    // If the term is a function, call it to determin the value
    if (typeof term === "function") term = term().toString();
    
    // If it is a file, simply return that it is a file
    if (fileEx.test(subject)) {
        return nodebot.say(owner.cyan + " is a file.").request(); 
    }


    // Do we have a definition for this subject?
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
    // 
    // For more information visit:
    // http://www.wolframalpha.com/termsofuse.html#attributionandlicensing
    // -------------------------------------------------- //

    var app_id = "GVH84U-9YQ66P7PU3";

    var qs = require('querystring')
    ,   sax    = require("../sax-js")
    ,   strict = true
    ,   parser = sax.parser(strict)
    ,   request = require("request")
    ,   data = qs.stringify({ input: a.tokens.join(" ") })
    ;

    nodebot.say("Hmm, I don't know off the top of my head. Let me ask around...");

    request.get("http://api.wolframalpha.com/v2/query?" + data + "&appid=" + app_id, function(err, data) {

        var result = [];

        parser.ontext = function(t) {
            var proc = t.trim();
            if (proc !== "" && proc !== "\n") result.push(proc);
        };

        parser.onend = function () {

            // If nothing was found, then we have an issue
            // -------------------------------------------------- //

            if (result.length === 0) {
                nodebot.say("I couldn't find anything, sorry :(");
                return nodebot.request();
            }

            nodebot.say("Here's what I found:\n");

            var tidbit = [];

            format.drawLine();
            console.log(format.align(result[0], 80).bold.red);
            format.drawLine();

            console.log("");

            var message = "";

            result = result.filter(function(i) { return i.trim() !== ""; });

            result.slice(1, 4).forEach(function(i) {
                
                if (i.split("|").length > 1) {
                    message += "\n" + format.clump(i.split("|").join(": "));
                    
                } else {
                    var tmp = i.split("\n").join(". ").trim();
                    message += "\n\n" + format.clump(tmp, 76);
                }

            });

            var credit = "Courtesy of " + "WolframAlpha" + " (http://www.wolframalpha.com)";

            nodebot.io && nodebot.io.sockets.emit('output', message);
            nodebot.io && nodebot.io.sockets.emit('output', credit);
            
            console.log("");
            
            format.drawLine();           
            console.log(format.align(credit, 80));
            format.drawLine();

            return nodebot.request();
            
        };
        
        parser.write(data.body).close();
        

    });

};
