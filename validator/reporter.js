// The Reporter
// Prints the validation report
// --------------------------------------------------- //

var colors = ['blue', 'yellow', 'red', 'white']
,   width  = 80
,   hr     = Array(width).join("-")
,   clump  = require("../brain/formatter").clump
,   space  = require("../brain/formatter").whitespace
;


module.exports = function(report) {

    var info = report.filter(function(i) { return (i.type === "info"); })
    ,   warn = report.filter(function(i) { return (i.type === "warning"); })
    ,   err  = report.filter(function(i) { return (i.type === "error"); });

    
    Nodebot.say("I was able to find " + report.length.toString().bold.red + " issues:");
    
    console.log("%s \n Line:   |  Problem:\n%s", hr, hr);     

    [info, warn, err].forEach(function(a, i) {

        var color = colors[i];

        a.forEach(function(e) {

            // Protect ourselves from undefined values
            if (!e.line || !e.character) return false;

            var spot = (e.line + ":" + e.character)
            ,   message = (space(spot.length) + clump(e.reason, 75, spot.length + 7));
            
            return console.log(" " + spot[color].bold +  message[color]);

        });
        
        if (a.length > 0) {
            console.log(hr);
        }

    });

};
