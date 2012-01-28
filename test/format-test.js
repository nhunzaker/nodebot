require("../nodebot");

var vows   = require('vows'),
    assert = require('assert'),
    align  = require("../brain/formatter").align
;

// -------------------------------------------------- //


vows.describe("Text Formatting").addBatch({

    'It should calculate the best fit for a word within a group' : {

        "left orientation should work": function() {
            
            var orientation = align("foobar", 10, "left");
            
            assert.equal(orientation, "foobar    ");
            assert.equal(orientation.length, 10);
        },

        "center orientation should work": function() {

            var orientation = align("foobar", 10, "center");

            assert.equal(orientation, "  foobar  ");
            assert.equal(orientation.length, 10);
        },

        "right orientation should work": function() {

            var orientation = align("foobar", 10, "right");

            assert.equal(orientation, "    foobar");
            assert.equal(orientation.length, 10);
        },

    }

}).export(module);
