// Nodebot HTML validator

var request = require("request")
,   $ = require('jquery');

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
            scan(body);
        }  else if (response.statusCode !== 200) {
            nodebot.say(("I got a " + response.statusCode + " :(").red.bold);
            callback();
        } else {
            nodebot.say("I couldn't find this address, are you sure it exists?".red.bold);
            callback();
        }

    });
    
    function scan(string) {

        request({
            method: "POST",
            uri  :'http://html5.validator.nu',
            body : string.trim(),
            headers: { 'content-type' : 'text/html'}
        }, function (error, response, body) {
                        
            if (!error && response.statusCode === 200) {

                var report    = $(body).find("ol").children("li")
                ,   warnings  = []
                ,   errors    = []
                ,   info      = []
                ;
                
                nodebot.say("Oh snap!".red.bold + " I was able to find " + report.length.toString().bold.red + " issues:");

                console.log("------------------------------------------------------------------------------------------\n"
                            + "Line:     |  Problem:\n"
                            + "------------------------------------------------------------------------------------------"
                           ); 

                function clump(string, limit, lineOffset) {
                    
                    limit      = limit || 12;
                    lineOffset = lineOffset || 20;
                    
                    var clump  = []
                    ,   len    = string.length / limit
                    ,   offset = ""
                    
                    for (var i = 0; i < len; i++) {
                        clump.push( string.split(" ").slice(i * limit, (i + 1) * limit).join(" ") );
                    }
                    
                    offset = new Array(lineOffset).join(" ") + "|  ";

                    clump = clump.filter(function(c) { return c !== "\n" && c !== "";}).join("\n" + offset).slice(0, -1)
                    
                    return clump;
                }

                report.each(function(i) {
                    
                    var $this = $(this)
                    ,   issue = $this.children("p").first().text()
                    ,   line  = $this.find(".last-line").first().text()
                    ,   col   = $this.find(".last-col").first().text()
                    ,   count = ( line + ":" + col);

                    count += new Array(10 - count.length).join(" ") + " |  ";
                    
                    issue = (count.bold + clump(issue, 12, count.length -2));
                    
                    if ($this.hasClass("error")) {
                        errors.push(issue.red);
                    } else if ($this.hasClass("warning")) {
                        warnings.push(issue.yellow);
                    } else if ($this.hasClass("info")) {
                        info.push(issue.blue);
                    }

                });

                [info, warnings, errors].forEach(function(a) {

                    a.forEach(function(e) {
                        console.log(e);
                    });
                    
                    if (a.length > 0) {
                        console.log("------------------------------------------------------------------------------------------");
                    }

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
