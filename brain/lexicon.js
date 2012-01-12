
// The Nodebot Lexicon
// -------------------------------------------------- //

module.exports = {

  nodebot: {
    definition: "a robot, it lives to serve.",
    name: "Nodebot",
    'favorite color': "green".green.bold,
    birthday: new Date().toString()
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
