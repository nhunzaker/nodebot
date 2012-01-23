// The Nodebot Javascript Validator
//
// Validates Javascript using jshint
// -------------------------------------------------- //

var fs   = require("fs")
,   generate_report  = require(__dirname + "/reporter");

module.exports.validate = function(file, callback) {
    
    var data      = fs.readFileSync(file, 'utf-8')
    ,   options   = require("./jshint_config")
    ,   validator = require("jshint").JSHINT
    ,   nodebot   = this
    ,   report    = [];

    // Validate it
    validator(data, options);
    
    errors = validator.errors;

    if (errors.length > 0) {
        
        // Report errors
        validator.errors.forEach(function(error){

            if (error === null) return false;

            error.type = "error";

            return report.push(error);
        });
        
        generate_report(report);

    } else {
        nodebot.say(file.green.bold + " is valid".green.bold);
    }

    
    callback();
};
