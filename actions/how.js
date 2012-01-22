// How
// -------------------------------------------------- //

module.exports = function how (a) {

    this.say("I don't know how to %s", a.subject);
    
    return this.request();

};