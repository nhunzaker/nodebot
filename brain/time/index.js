
// The Time Module
// -------------------------------------------------- //

var moment = require("moment");

module.exports = function time () {

    this.tomorrow = moment().add("days", 1);

};