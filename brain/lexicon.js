
// The Nodebot Lexicon
// -------------------------------------------------- //

var lexicon = module.exports = {

    nodebot: {
        definition: "a robot, it lives to serve.",
        name: "Nodebot",
        'favorite color': "green".green.bold,
        birthday: new Date().toString()
    },

    user: {
        name: "Master",

        definition: "my master.",
        
        "current directory": function() {
            return process.cwd();
        },
        
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

    'up' : {
        definition: "What's up? I'm not really sure, it's so hard to explain to "
                    + "4 dimensional beings"
    },


    // Files
    // ---------- //

    "current directory" : {
        definition: function() {
            return process.cwd();
        }
    },


    // Regular expression related items
    // -------------------------------------------------- //

    "email": {
        definition           : "Messages sent across the internet",
        "regular expression" : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\.+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },

    "url": {
        definition           : "The address for a website or location on the internet",
        "regular expression" : /\b(?:(?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:\'".,<>?«»“”‘’]))/
    },

    "file": {
        definition           : "A place where information is stored on a computer",
        "regular expression" : /\S+\.\S+[^\/\?]/
    },

    "javascript": {
        definition           : "The language of the internet",
        "regular expression" : /\.js/
    },

    "css": {
        definition           : "The great beautifier of the internet",
        "regular expression" : /\.css/
    },

    "html": {
        definition           : "The great information organizer of the internet",
        "regular expression" : /\.html/
    }
    
};

