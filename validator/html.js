// Nodebot HTML validator

var request = require("request")
,   $ = require('jquery')
,   fs = require('fs')
;

module.exports.validate = function(file, callback) {
    
    var nodebot = this
    ,   content = fs.readFileSync(file, "utf-8")
    ;

    scan(content);
        
    function scan(string) {

        request({
            method: "POST",
            uri  :'http://html5.validator.nu',
            body : string.trim(),
            headers: { 'content-type' : 'text/html'}
        }, function (error, response, body) {
                        
            if (!error && response.statusCode === 200) {

                var report    = $(body).find("ol").children("li")
                ,   statement = ""
                ;
                
                nodebot.say("Oh snap!".red.bold + " I was able to find " + report.length.toString().bold.red + " issues:");
                report.each(function(i) {
                    
                    var $this = $(this);

                    statement = (i+1).toString() + ": " + $(this).text();

                    if ($this.hasClass("error")) {
                        statement = statement.red.bold;
                    } else if ($this.hasClass("warning")) {
                        statement = statement.yellow.bold;
                    } else if ($this.hasClass("info")) {
                        statement = statement.blue.bold;
                    }
                    
                    console.log(statement);
                    
                });
                
            } else if (response.statusCode !== 200) {
                nodebot.say(("I got a " + response.statusCode + " :(").red.bold);
            } else {
                nodebot.say("Something went horribly wrong :(".red.bold);
                console.log(error);
            }
            
            callback();
        });
    }

};
