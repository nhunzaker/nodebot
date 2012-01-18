// The Nodebot Website Validator
//
// Validates the HTML from a website
// -------------------------------------------------- //

var request  = require("request")
,   scan     = require(__dirname + "/html").scan;

module.exports.validate = function(address, callback) {
    
    var nodebot = this;
    
    // Bind the approriate protocol if it wasn't included
    if (!address.match(/http(\S|):/i)) {
        address = "http://" + address;   
    }

    nodebot.say("Searching for " + address.magenta.bold + "..." );

    request(address, function (error, response, body) {

        // Bulletproof sites that don't exist
        if (response === undefined){
            nodebot.say("I couldn't find anything, period. Does this site exist?");
            return callback();
        }

        if (!error && response.statusCode == 200) {
            nodebot.say("I found " + address.magenta.bold + ". I am now requesting the validator...");

            return scan(body, callback);

        } else if (response.statusCode !== 200) {
            nodebot.say(("I got a " + response.statusCode + " :(").red.bold);
        } else {
            nodebot.say("I couldn't find this address, are you sure it exists?".red.bold);
        }
        
        return callback();
    });

};
