require('colors');

var brain = require('brain')
var options = { 
  backend : {
    type: 'Redis',
    options: {
      hostname: 'localhost', // this is the default
      port: 6379,
      name: 'nodebot' // namespace so you can persist training
    }
  }
}

var bayes = new brain.BayesianClassifier(options);

bayes.train("who are you?", "who", browbeat);

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
  console.log("Nodebot:".magenta.bold, string);
}

// Start a training session
function browbeat() {

  ask("Please give me a statement to classify: \n " + "Question: ".blue.bold, function(data) {

    var question = data;

    bayes.classify(question, function(classification) {

      var statement = "Is the classifier " + classification.bold.green + "?";

      ask(statement + " (y/n)? \n " + "Response: ".blue.bold, function(decision) {
        
        if (decision[0].toLowerCase() === "y") {
          say("Great!");
          bayes.train(question, classification, browbeat);
        } else {
          ask("Okay, then how should I have classified this?\n" + "Response: ".blue.bold, function(classifier) {
            bayes.train(question, classifier, browbeat);
          });
        }

      });

    });

  });
}
