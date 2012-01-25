// Nodebot HTML validator
//
// Validates HTML using validator.nu
// -------------------------------------------------- //

var request = require("request")
,   $ = require('jquery')
,   fs = require('fs')
,   report = require(__dirname + "/reporter");

var validate = module.exports.validate = function(file, callback) {
    
    var Nodebot = this
    ,   content = fs.readFileSync(file, "utf-8");

    scan(content);

};

var scan = module.exports.scan = function scan (string, callback) {

    callback = callback || Nodebot.request;

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
            Nodebot.say(("I got a " + response.statusCode + " :(").red.bold);
        } else {
            Nodebot.say("Something went horribly wrong :(".red.bold);
            console.log(error);
        }
        
        callback();

    });
};
