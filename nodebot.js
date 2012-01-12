// General requirements

require('colors');

var natural = require('natural')
,   command = process.argv.slice(2).join(" ").trim()
,   home    = process.cwd();

console.log(command);

// -------------------------------------------------- //

var NodeBot = function () {

  var self = this;

  // short term memory
  this.memory  = {
    tasks         : [],
    current_topic : ""
  };
  
  // long term memory
  this.lexicon = {

    nodebot: {
      definition: "a robot, it lives to serve.",
      name: "Nodebot",
      'favorite color': "green".green.bold,
      birthday: Date.now()
    },

    user: {
      name: "Master",
      definition: "my master.",

      'ip address': function() {

        var os        = require('os')
        ,   ifaces    = os.networkInterfaces()
        ,   addresses = ""
        ;

        for (var dev in ifaces) {

          ifaces[dev].forEach(function(details){
            if (details.family === 'IPv4') {
              addresses += "\n" + ((details.internal) ? "   local - " : "external - ") + details.address;
            }
          });
        }

        return "\n" + addresses;

      },

      'ip addresses' : function() {
        return self.lexicon.user['ip address']();
      }
    },

    // Files
    // ---------- //

    "current directory" : {
      definition: function() {
        return process.cwd();
      }
    },
    
    "the current directory" : {
      definition: function() {
        return process.cwd();
      }
    }
    
  };

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
