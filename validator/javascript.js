// NodeBot Javascript Validator

var fs   = require("fs")
,   lang = require("../brain/language");

module.exports.validate = function(file) {
    
    var data      = fs.readFileSync(file, 'utf-8')
    ,   options   = require("./jshint_config")
    ,   validator = require("jshint").JSHINT
    ,   nodebot   = this
    ,   errors = [];

    // Validate it
    validator(data, options);
    
    errors = validator.errors;

    if (errors.length > 0) {
        
        var report = "Oh snap!" + " I found " + lang.pluralize(errors, "error").red.bold + " in " + file.bold + ": "
            +        "\n----------------------------------";

        // Report errors
        validator.errors.forEach(function(error){
            report += "\n" + (error.line + ":" + error.character + " - " +  error.reason).red.bold;
        });
        
        nodebot.say(report);
        nodebot.growl("Sorry. I found " + validator.errors.length + " errors in " + file + " (See terminal)", "error");
    } else {
        nodebot.say(file.green.bold + " is valid".green.bold);
    }

};
