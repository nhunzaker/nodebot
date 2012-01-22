// How
// -------------------------------------------------- //

module.exports = function how (a) {

    if (a.owner && a.subject) {
        this.actions.what.apply(this, [a]);
    }

    this.say("I don't know how to %s", a.subject);
    
    return this.request();

};