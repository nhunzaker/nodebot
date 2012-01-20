
var actions  = {}
,   language = require('../brain/language')
,   lang     = language
,   fs       = require("fs");
;

// Scanners
var urlEx  = Nodebot.lexicon.url['regular expression']
,   fileEx = Nodebot.lexicon.file['regular expression']
,   jsEx   = Nodebot.lexicon.javascript['regular expression']
,   cssEx  = Nodebot.lexicon.css['regular expression']
,   htmlEx = Nodebot.lexicon.html['regular expression']
;


module.exports = actions;

// Who
// -------------------------------------------------- //

actions.who = function(a) {

    var nodebot = this
    ,   owner = a.owner
    ,   key = a.subject
    ;

    // Special instances
    // -------------------------------------------------- //
    switch(owner){
        
    case "nodebot":
        
        if (this.lexicon.nodebot[key]) {
            this.say("My " + key + " is " + this.lexicon.nodebot[key]);
        } else {
            this.say(this.lexicon.nodebot.name + " is " + this.lexicon.nodebot.definition);
        }

        return this.request();

    case "user":

        if (this.lexicon.user[key]) {
            this.say("You are my master, " + this.lexicon.user.name);
        } else {
            this.say("Hmm... I can't remember, " + this.lexicon.user.name);
        }
        return this.request();
    }


    // Typical cases
    // -------------------------------------------------- //
    
    if (nodebot.lexicon[owner] !== undefined) {
        this.say(lang.capitalize(owner) + " is " + this.lexicon[owner][key].green.bold);
        return this.request();
    }

    nodebot.ask("Hmm... I haven't met " + lang.capitalize(owner) + ". Who are they?", function(text) {

        if (text[0].toLowerCase() === "no") {
            nodebot.say("Okay, I'll forget about them");
            return nodebot.request();
        }

        nodebot.lexicon[owner] = nodebot.lexicon[owner] || {};
        nodebot.lexicon[owner][key] = text;
        nodebot.say("Great, now I know who " + lang.capitalize(owner) + " is!");

        return nodebot.request();

    });

};


actions.relabel = function(a) {
    
    var nodebot     = this
    ,   ownership   = a.ownership
    ,   subject     = a.subject
    ,   description = lang.capitalize(a.description)
    ;

    if (ownership === subject) {
        subject = "definition";
    }

    // Standard bullet proofing
    nodebot.lexicon[ownership] = nodebot.lexicon[ownership] || {};

    nodebot.ask("Just to confirm," + " you said that " + lang.possessify(ownership) + " " + a.subject + " " + a.keyverb + " " + description.green.bold + "? (y/n)", function(data) {

        if (data[0].toLowerCase() === "y") {
            nodebot.say("Okay, thanks! Now I know that " + (lang.possessify(ownership) + " " + subject + " is " + description).green.bold);
            nodebot.lexicon[ownership][subject] = description;
        } else {
            nodebot.say("I must be confused, sorry.");
        }

        return nodebot.request();

    });

};


actions.what = require(__dirname + "/what");


// File Operations
// -------------------------------------------------- //

actions.validate = actions.wrong = function(a, skipRequest) {
    
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


actions.watch = actions.look = function(a) {

    var file    = a.subject
    ,   nodebot = this
    ,   watch   = false;

    // Bullet proof websites
    if (file.match(urlEx)) {
        this.say("This is a website. I'm going to pass it through the web validator");
        return actions.validate.apply(this, [string]);
    }  

    try {
        stat = fs.statSync(file);
    } catch (err) {
        nodebot.say("I couldn't find that file, does it exist?");
        return nodebot.request();
    }
    
    if (stat.isDirectory() ) {
        nodebot.say(file.magenta.bold + " is a directory. Until I know how to watch directories, please specify a file.");
        return nodebot.request();
    }

    // Watch files
    // -------------------------------------------------- //

    fs.watchFile(file, { persistent: true, interval: 1000 }, function (curr, prev) {

        var content = fs.readFileSync(file, "utf-8");
        
        if (content !== nodebot.memory.watched_content) {
            nodebot.say("Looks like something has changed on " + file.blue.bold);
            actions.validate.apply(nodebot, [a, true]);

            // Update with new content
            nodebot.memory.watched_content = content;
        }
    });

    nodebot.say("I am now watching " + file.blue.bold);

    return actions.validate.apply(nodebot, [a, true]);

};


// Repeat actions
actions.repeat = function() {
    
    var action = "";
    
    if (this.memory.tasks === []) {
        this.say("I haven't done anything yet, silly!");
        return this.request();
    } else {
        action = this.memory.tasks.slice(-1).toString();
    }
    
    // Run the old action
    return this.analyze(action);

};


// How
// -------------------------------------------------- //

actions.how = function(a) {
    
    this.say("I don't know how to %s", a.subject);
    
    return this.request();

};
