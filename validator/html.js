// Nodebot HTML validator
//
// Validates HTML using validator.nu
// -------------------------------------------------- //

var request = require("request")
,   $ = require('jquery')
,   fs = require('fs')
,   report = require(__dirname + "/reporter");

module.exports.validate = function(file, callback) {
    
    var nodebot = this
    ,   content = fs.readFileSync(file, "utf-8");

    scan(content);

};

module.exports.scan = function scan (string, callback) {

    request({

        method: "POST",
        uri  :'http://html5.validator.nu',
        body : string.trim(),
        headers: { 'content-type' : 'text/html'}

    }, function (error, response, body) {
        
        if (!error && response.statusCode === 200) {

            var errors = [];
            
            $(body).find("ol").children("li").each(function(i) {

                errors.push({
                    type      : $(this).attr("class"),
                    line      : $(this).find(".last-line").text(),
                    character : $(this).find(".last-col").text(),
                    reason    : $(this).children("p").first().text()
                });
                
            });

            report(errors);
            
        } else if (response.statusCode !== 200) {
            nodebot.say(("I got a " + response.statusCode + " :(").red.bold);
        } else {
            nodebot.say("Something went horribly wrong :(".red.bold);
            console.log(error);
        }
        
        callback();

    });
};
