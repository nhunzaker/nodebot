// General requirements

require('colors');

var natural = require('natural')
,   command = process.argv.slice(2).join(" ").trim()
,   home    = process.cwd();

// -------------------------------------------------- //

var NodeBot = function () {

  var self = this;

  // short term memory
  this.memory  = {
    tasks         : [],
    current_topic : ""
  };
  
  // long term memory
  this.lexicon = require("./brain/lexicon");

  // All actions the nodebot can take
  this.actions = require("./actions");
  
  // The linguistics module
  this.language = require("./brain/language");
  
  // Adds the decision making module
  require("./brain/analyze")(this);
  
  // Adds common interactions, such as say, growl, ask and request
  require("./brain/interaction")(this);

};

// Initalize
var nodebot = new NodeBot();

// Initial action
if (command !== "") {
  nodebot.analyze(command);
} else {
  nodebot.request();
}
