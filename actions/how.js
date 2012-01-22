// How
// Basically an alias for "what"
// -------------------------------------------------- //

module.exports = function how (a) {

    // Do we have success?    
    if (a.owner && a.subject) {
        return this.actions.what.apply(this, [a]);
    } 
    
    this.say("I don't know how to %s", a.subject);        
    return this.request();

};