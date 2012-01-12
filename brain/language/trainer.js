// The Language Module
// -------------------------------------------------- //

var natural = require('natural')
,   fs = require('fs')
,   dummy = {}
;

require('colors');

function ask(question, callback) {

    var stdin  = process.stdin
    ,   stdout = process.stdout;
    
    stdout.write("\nNodebot: ".magenta.bold + question);
    stdin.resume();
    
    stdin.once('data', function(data) {
        data = data.toString().trim();
        callback(data);
    });

}

function say (string) {
    console.log("Nodebot: ".magenta.bold + string);
}

function saveSession(context) {
    context.save('classifier.json', function(err, classifier) {
        if (err) { console.log("Error:".red.bold + err); }
    });
}

// Start a training session
function browbeat() {

    ask("Please give me a statement to classify: \n " + "Question: ".blue.bold, function(data) {

        var question       = data
        ,   classification = dummy.classify(data);
        
        var statement = "Is the keyword " + classification + "?";

        ask(statement + " (y/n)? \n " + "Response: ".blue.bold, function(data) {
            
            if (data[0].toLowerCase() === "y") {
                say("Great!");
                dummy.addDocument(question, classification);
                dummy.train();
                saveSession(dummy);
                browbeat();
            } else {
                ask("What should it have been? ", function(data) {
                    dummy.addDocument(question, data.toLowerCase());
                    dummy.train();
                    saveSession(dummy);
                    browbeat();
                });
            }
        });

    });
}

// Load in the data
say("Loading " + "gray matter...".cyan.bold);

var file = "";
try {
    file = fs.readFileSync("./classifier.json", "utf-8");
} catch (error) {
    fs.writeFileSync("", "./classifier.json");
}

if (file === "") {
    say("It looks like a classification file doesn't exist, so we'll start from scratch...")
    
    dummy = new natural.BayesClassifier();
    
    // Set a baseline
    dummy.addDocument("What are you?", "what");
    dummy.train();
    
    browbeat();

} else {

    natural.BayesClassifier.load('classifier.json', null, function(err, classifier) {
        dummy = classifier;
        browbeat();              
    });

}
