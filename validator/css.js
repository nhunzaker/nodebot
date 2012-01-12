// NodeBot Javascript Validator

var fs = require("fs");

module.exports.validate = function(file) {
    
    var data      = fs.readFileSync(file, 'utf-8')
    ,   options   = require("./jshint_config")
    ,   validator = require("csslint").CSSLint
    ,   nodebot   = this;

    // Validate it
    var validation = validator.verify(data, options);
    
    if (validation.messages.length > 0) {

        var errors  = "";
        
        // Report errors
        validator.messages.forEach(function(message){
            if (message.type === error) {
                errors += "\n" + (error.line.toString() + ":" + error.col.toString() + " - " +  error.message).red.bold;
            } else {
                errors += "\n" + (error.line.toString() + ":" + error.col.toString() + " - " +  error.message).yellow.bold;
            }
        });
        
        nodebot.say(errors);
        nodebot.growl("Sorry. I found " + validation.messages.length + " errors in " + file + " (See terminal)", "error");
        
    } else {
        nodebot.say(file.green.bold + " is valid".green.bold);
    }

};
