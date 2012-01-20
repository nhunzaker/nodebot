require('colors');

var brain   = require('brain')
,   ntwitter = require("ntwitter");


// The Twitter API
// -------------------------------------------------- //

var twitter = new ntwitter({
    consumer_key: 'rPkzBTS2tnvUaxV8h5pMVA',
    consumer_secret: '5B16t4voJKZ0WcU1dS1fr8fT6cRnzWoxHMnWDZp6cc',
    access_token_key: '48188274-PsxLGhh7SJVzz3catdgmfNGLGa6qHYsq7464koFrJ',
    access_token_secret: 'pR7CpeEtC3yBIof1c8lmVCoGDKMjLy1bTboIOIXVCKM'
})
,   tweets;


// Machine Learning
// -------------------------------------------------- //

var bayes = new brain.BayesianClassifier({ 
    backend : {
        type: 'Redis',
        options: {
            hostname: 'localhost', // this is the default
            port: 6379,
            name: 'sentiment' // namespace so you can persist training
        }
    }
});

bayes.train("", "neutral");

// Let's roll
// -------------------------------------------------- //

say("Scanning Twitter...");

twitter.search("obama", {
    rpp              :  "100",
    include_entities :  "true",
    result_type      :  "mixed",
    lang             :  "en"
}, function(err, data) {
    tweets = data.results;
    say("\nI found " + tweets.length + " search results\n");
    classify();
});


function ask(question, callback) {

    var stdin  = process.stdin
    ,   stdout = process.stdout;
    
    stdout.write("\nNodebot: ".magenta.bold + question + "\n" + "Response: ".blue);
    stdin.resume();
    
    stdin.once('data', function(data) {
        data = data.toString().trim();
        callback(data);
    });

}


function say (string) {
    console.log("Nodebot:".magenta.bold, string);
}

function classify() {

    // Keep track of placement
    this.slot = this.slot || 0;

    // The tweet under consideration
    var tweet = tweets[slot].text;

    // Okay, now let's increment it for next time
    this.slot++;

    // Classify this sucker
    bayes.classify(tweet, function(classification) {

        color = (classification === "for") ? "green" : (classification === "against") ? "red" : "black";

        // Log a reference point to the tweet
        console.log("\nTweet: "[color].bold + tweet);

        // Generate the question
        var statement = "Is the classifier " + classification.cyan + "?";

        ask(statement + " (y/n)? \n ", function(decision) {

            // Handle accidently enter presses without a value

            if (decision === null || decision === undefined) {
                say("Great!");
                bayes.train(tweet, classification, classify);
            }

            // Is the classification correct?
            if (decision[0].toLowerCase() === "y") {

                // yes : positively reinforce it and move on
                
                say("Great!");
                bayes.train(tweet, classification, classify);

            } else {

                // no : make sure it is correctly classified
                
                ask("Okay, then how should I have classified this?", function(classifier) {
                    var cleaned = classifier.toLowerCase();
                    bayes.train(tweet, cleaned, classify); 
                });
            }
            
            
        });

    });
}
