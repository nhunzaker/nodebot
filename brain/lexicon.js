
// The Nodebot Lexicon
// -------------------------------------------------- //

var lexicon = {}
,   os     = require("os")
,   home   = process.cwd()
,   system = os.type().replace("Darwin", "OSX") + os.release() + "(" + os.arch() + ")"
;


module.exports = lexicon = {

    nodebot: {

        definition: "a robot, it lives to serve.",

        name: "Nodebot",

        'favorite color': "green".green.bold,

        birthday: new Date().toString(),

        time : function() {
            return new Date().toString();
        }
    },

    user: {

        name                : "Master",

        definition          : "my master.",
        
        "current directory" : home,
        
        "operating system"  : system,
        
        "host name"         : os.hostname(),

        "free memory"       : (os.freemem() / 1000000) + "MB",
        
        'ip address'        : function() {

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


    // OS Lex
    // ---------- //

    "current directory" : {
        definition: home        
    },

    "operating system" : {
        definition: system
    },

    "time": {
        definition: function() {
            return new Date().toString();
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
        "regular expression" : /\.js$/,
        mime                 : ".js"
    },

    "css": {
        definition           : "The great beautifier of the internet",
        "regular expression" : /\.css$/,
        mime                 : ".css"     
    },

    "sass": {
        definition           : "Syntaxually awesome stylesheets",
        "regular expression" : /\.sass$/,
        mime                 : ".sass"     
    },

    "scss": {
        definition           : "Syntaxually awesome stylesheets",
        "regular expression" : /\.scss$/,
        mime                 : ".scss"     
    },

    "html": {
        definition           : "The great information organizer of the internet",
        "regular expression" : /\.html$/,
        mime                 : ".html"     
    }
    
};

