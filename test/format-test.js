require("../nodebot");

var vows   = require('vows')
,   assert = require('assert');

var textAlign = require("../brain/formatter").textAlign;

// -------------------------------------------------- //


vows.describe("Text Formatting").addBatch({

    'It should calculate the best fit for a word within a group' : {

        "left orientation should work": function() {
            
            var orientation = textAlign("foobar", 10, "left");
            
            assert.equal(orientation, "foobar    ");
            assert.equal(orientation.length, 10);
        },

        "center orientation should work": function() {

            var orientation = textAlign("foobar", 10, "center");

            assert.equal(orientation, "  foobar  ");
            assert.equal(orientation.length, 10);
        },

        "right orientation should work": function() {

            var orientation = textAlign("foobar", 10, "right");

            assert.equal(orientation, "    foobar");
            assert.equal(orientation.length, 10);
        },

    }

}).export(module);
