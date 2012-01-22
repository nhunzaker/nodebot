// Validate
// -------------------------------------------------- //

var fs = require('fs');

// Scanners
var urlEx  = Nodebot.lexicon.url['regular expression']
,   fileEx = Nodebot.lexicon.file['regular expression']
,   jsEx   = Nodebot.lexicon.javascript['regular expression']
,   cssEx  = Nodebot.lexicon.css['regular expression']
,   htmlEx = Nodebot.lexicon.html['regular expression']
;


module.exports = function validate (a, skipRequest) {
    
    var target  = a.subject.split(" ").join("")
    ,   nodebot = this;

    if (!target.match(urlEx)) {
        
        try { 
            fs.statSync(target); 
        } catch (err) {
            nodebot.say("I had trouble finding " + target + ". Does it exist?".cyan);

            return nodebot.request();
        }
    }

    function dispatch(fileType) {
        require("../validator/" + fileType).validate.apply(nodebot, [target,  function cb() {
            return (!skipRequest) ? false : nodebot.request();
        }]);
    }

    // VALIDATORS
    // -------------------------------------------------- //
    
    // Javascript
    if (target.match(jsEx)) dispatch("javascript");

    // CSS
    else if (target.match(cssEx)) dispatch("css");

    // Websites
    else if (target.match(urlEx)) dispatch("website");

    // HTML
    else if (target.match(htmlEx)) dispatch("html");

    // Elsecase
    else {
        this.say("I'm sorry, I don't recognize that file format yet");
        if (!skipRequest) return nodebot.request();
    }

};
