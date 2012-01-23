// Actions
// 
// Tells the nodebot how to do a command
// -------------------------------------------------- //

var actions = {};


// Who
actions.who = require("./who");

// Relabel
actions.relabel = actions.set === require("./relabel");

// What
actions.what = require(__dirname + "/what");

// Validate, Wrong
actions.validate = actions.wrong = require("./validate");

// Watch, Look
actions.watch = actions.look = require("./watch");

// How
actions.how = require("./how");



// Export it all out
// -------------------------------------------------- //

module.exports = actions;