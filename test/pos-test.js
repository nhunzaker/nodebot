require("../nodebot");
var tagger = require("../brain/language/tagger");
var vows = require('vows'),
assert = require('assert');


// -------------------------------------------------- //


vows.describe("Tagger Helper Functions").addBatch({

    'It should calculate the best fit for a word within a group' : {
        
        topic: tagger.closest("valid", ["who", "what", "when", "validate"]),

        "the best fit should be 'validate'": function(closest) {
            assert.equal(closest, "validate");
        }

    },

    'It should determine if a word is a file' : {
        
        topic: tagger.isFile("/public/application.js"),

        "it should be a file": function(isFile) {
            assert.equal(isFile, true);
        }

    },

    'It should be able to tag a word' : {
        
        topic: tagger.getType("kittens"),

        "it should be within the noun tag namespace": function(word) {
            assert.equal(word.slice(0,2), "NN");
        }

    },

    'It should be able to sift between words of particular types' : {
        
        topic: tagger.getBetween(["I", "like", "to", "eat", "cheese"], "VB", "NN").join(" "),

        "it should find 'cheese'": function(between) {
            assert.equal(between, "cheese");
        }

    }

}).export(module);




vows.describe('Decipher speech').addBatch({

    'When asked, "What is your name?"': {
        
        topic: tagger.classify("What is your name?"),

        "it should correctly determine the owner": function(topic) {
            assert.equal(topic.owner, "nodebot");
        },

        'it should correctly determine the subject': function (topic) {
            assert.equal(topic.subject, "name");
        }
        
    },

    'When asked, "What is the regular expression for email"': {
        
        topic: tagger.classify("What is the regular expression for email?"),

        'it should correctly determine the owner': function (topic) {
            assert.equal(topic.owner, "email");
        },
        'it should correctly determine the subject': function (topic) {
            assert.equal(topic.subject, "regular expression");
        },
        'it should correctly determine the action': function (topic) {
            assert.equal(topic.action, "what");
        }
        
    },

    'When asked, "What is the current directory?"': {
        
        topic: tagger.classify("What is the current directory?"),

        'it should correctly determine the subject': function (topic) {
            assert.equal(topic.subject, "current directory");
        }
        
    },


    'When asked, "Who is the king of France?"': {
        
        topic: tagger.classify("Who is the king of France?"),

        'it should correctly identify the action': function (topic) {
            assert.equal(topic.action, "who");
        },

        'it should correctly determine ownership': function (topic) {
            assert.equal(topic.owner, "France");
        },

        'it should correctly determine the subject': function (topic) {
            assert.equal(topic.subject, "king");
        }
        
    },


    'When asked, "Validate application.js"': {

        topic: tagger.classify("validate application.js"),

        'the subject should be "application.js"': function (topic) {
            assert.equal(topic.subject, "application.js");
        },

        'the action should be "validate"': function (topic) {
            assert.equal(topic.action, "validate");
        }

    },

    'When asked, "Is application.js valid?"': {

        topic: tagger.classify("Is application.js valid?"),

        'the subject should be "application.js"': function (topic) {
            assert.equal(topic.subject, "application.js");
        },

        'the action should be "valid"': function (topic) {
            assert.equal(topic.action, "valid");
        }

    },

    'When asked, "Is there anything wrong with application.js?"': {

        topic: tagger.classify("Is there anything wrong with application.js?"),

        'the action should be "wrong"': function (topic) {
            assert.equal(topic.action, "wrong");
        },

        'the subject should be "application.js"': function (topic) {
            assert.equal(topic.subject, "application.js");
        }

    },

    'When asked, "Is there anything wrong with http://www.google.com?"': {

        topic: tagger.classify("Is there anything wrong with  http://www.google.com?"),

        'the action should be "wrong"': function (topic) {
            assert.equal(topic.action, "wrong");
        },

        'the subject should be " http://www.google.com"': function (topic) {
            assert.equal(topic.subject, "http://www.google.com");
        }

    },


    'When asked, "Validate http://www.google.com"': {

        topic: tagger.classify("Validate http://www.google.com"),

        'the action should be "validate"': function (topic) {
            assert.equal(topic.action, "validate");
        },

        'the subject should be " http://www.google.com"': function (topic) {
            assert.equal(topic.subject, "http://www.google.com");
        }

    },

    'When asked, "Is there anything wrong with http://localhost:4000?"': {

        topic: tagger.classify("Is there anything wrong with http://localhost.dev:4000?"),

        'the action should be "wrong"': function (topic) {
            assert.equal(topic.action, "wrong");
        },

        'the subject should be "http://localhost.dev:4000?': function (topic) {
            assert.equal(topic.subject, "http://localhost.dev:4000");
        }

    },


    'When asked, "Validate http://localhost.dev:4000?"': {

        topic: tagger.classify("Validate http://localhost.dev:4000?"),

        'the action should be "validate"': function (topic) {
            assert.equal(topic.action, "validate");
        },

        'the subject should be "http://localhost.dev:4000?"': function (topic) {
            assert.equal(topic.subject, "http://localhost.dev:4000");
        }

    },


    'When asked, "Who am I?"': {

        topic: tagger.classify("Who am I?"),

        'the action should be "who"': function (topic) {
            assert.equal(topic.action, "who");
        },

        'the ownership should belong to "user"': function (topic) {
            assert.equal(topic.owner, "user");
        },

        'the subject should be "I"': function (topic) {
            assert.equal(topic.subject, "I");
        }

    },


    'When asked, "Do you know what the current directory is?"': {

        topic: tagger.classify("Do you know what the current directory is?", true),
        
        'the action should be "what"': function (topic) {
            assert.equal(topic.action, "what");
        },

        'the owner should be "current directory"': function (topic) {
            assert.equal(topic.owner, "current directory");
        },

        'the subject should be "current directory"': function (topic) {
            assert.equal(topic.subject, "current directory");
        }

    },

    'When asked, "What is it?"': {

        topic: tagger.classify("What is it?", true),
        
        'the action should be "what"': function (topic) {
            assert.equal(topic.action, "what");
        },

        'the owner should be the last context': function (topic) {
            assert.equal(topic.owner, Nodebot.memory.context);
        }

    }


}).export(module); // Run it
