require("../nodebot");

var tagger = require("../brain/language/tagger"),
    vows   = require('vows'),
    assert = require('assert');


// -------------------------------------------------- //


vows.describe("Time").addBatch({

    'When asked, "What time is it?"': {
        
        topic: tagger.classify("What time is it?"),

        "it should correctly determine the owner": function(topic) {
            assert.equal(topic.owner, "nodebot");
        },

        'it should correctly determine the subject': function (topic) {
            assert.equal(topic.subject, "time");
        }
        
    }

}).export(module);
