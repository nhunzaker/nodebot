// Nodebot.js
//
// Description: A helper robot that lives to serve
// Author: Nate Hunzaker
// -------------------------------------------------- //
// Licence: MIT
// -------------------------------------------------- //

require('colors');
// Get the initial action
var command = process.argv.slice(2).join(" ").trim();

// -------------------------------------------------- //

Nodebot = new(require("events").EventEmitter)();

// short term memory
Nodebot.memory  = {
    tasks   : [],
    context : "nodebot"
};

// long term memory
Nodebot.lexicon = require("./brain/lexicon");

// The linguistics module
Nodebot.language = require("./brain/language");

// All actions the nodebot can take
Nodebot.actions = require("./actions");

// Adds the decision making module
Nodebot.analyze = require("./brain/analyze");

// Adds common interactions, such as say, growl, ask and request
require("./brain/interaction")(Nodebot);

// -------------------------------------------------- //

Nodebot.boot = function() {
    (command !== "") ? Nodebot.analyze(command) : Nodebot.request();
};

// Take the proper initial action

if (!module.parent) {
    
    process.on("exit", function() {
        console.log("");
    });

    Nodebot.boot();

}



