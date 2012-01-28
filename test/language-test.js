require("../nodebot");

var vows   = require('vows'),
    assert = require('assert'),
    lang   = require("../brain/language")
;

// -------------------------------------------------- //


vows.describe("Language").addBatch({

    'It should be able to capitalize words' : {

        "The capitalized form of foobar should be Foobar": function() {
            assert.equal(lang.capitalize("foobar"), "Foobar");
        }

    },

    'It should be able to possesify words' : {

        "The possessive form of Foobar should be \"Foobar's\"": function() {
            assert.equal(lang.possessify("Foobar"), "Foobar's");
        },

        "The possessive form of Foobars should be \"Foobars'\"": function() {
            assert.equal(lang.possessify("Foobars"), "Foobars'");
        },

        "The possessive form of Foobar's should be \"Foobar's\"": function() {
            assert.equal(lang.possessify("Foobar's"), "Foobar's");
        }
    },

    'It should be able to deposessify a word' : {

        "The depossessed form of Foobar's should be \"Foobar\"": function() {
            assert.equal(lang.depossessify("Foobar's"), "Foobar");
        },

        "The depossessed form of Foobars' should be \"Foobars\"": function() {
            assert.equal(lang.depossessify("Foobars'"), "Foobars");
        },

        "The depossessed form of Foobar should be \"Foobar\"": function() {
            assert.equal(lang.depossessify("Foobar"), "Foobar");
        }
    }

}).export(module);
