// The Reporter
// Prints the validation report
// --------------------------------------------------- //

var hr = "----------------------------------------------------------------------------------------------"
,   colors = ['blue', 'yellow', 'red'];


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
            ,   message = (whitespace(spot.length) + clump(e.reason, 13, spot.length + 7));
            console.log(" " + spot[color].bold +  message[color]);
        });
        
        if (a.length > 0) {
            console.log(hr);
        }

    });

};


// A whitespace generator
// Creates a blank Array and stitches it together
// -------------------------------------------------- //

function whitespace (length) {

    var num   = Math.abs(12 - (length || 0))
    ,   space = Array(num);

    return space.join(" ");
}


// Keeps lines at a specific word count
// and keeps them in proper left alignment
// -------------------------------------------------- //

function clump (string, limit, lineOffset) {
    
    limit      = limit || 12;
    lineOffset = lineOffset || 20;
    
    var clump  = []
    ,   len    = string.length / limit
    ,   offset = "";
    
    // For eachline
    for (var i = 0; i < len; i++) {
        clump.push( string.split(" ").slice(i * limit, (i + 1) * limit).join(" ") );
    }
    
    // Now, create the left margin by compressing an array
    // into a string
    offset = new Array(lineOffset).join(" ");

    // Filter whitespace and pull everthing together
    clump = clump.filter(function(c) { 
        return c !== "\n" && c !== "";
    }).join("\n" + offset).slice(0, -1);
    
    return clump;

}
