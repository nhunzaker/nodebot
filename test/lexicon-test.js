require("../nodebot");

var vows   = require('vows')
,   assert = require('assert')
,   tagger = require("../brain/language")
;

// -------------------------------------------------- //


vows.describe("Lexicon").addBatch({

    'It should be able to interpret lexical actions' : {

        topic: tagger.classify("Set wolframalpha to ABC-123"),

        "the action should be Set": function(topic) {
            assert.equal(topic.action, "set");
        },

        "the subject should be ACB-123": function(topic) {
            assert.equal(topic.subject, "ABC-123");
        }

    }

}).export(module);
