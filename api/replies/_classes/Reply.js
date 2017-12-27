'use strict';

const validator = require('validator');

var Errors = require("./../../_classes/Errors");
var ValidationError = Errors.ValidationError;
var Dynamic = require('./../../_classes/Dynamic');

/**
 * Reply class. Each instance maps to one document in permanent storage and extends the
 * Dynamic wrapper class.
 * 
 * @type {class}
 */
module.exports = class Reply extends Dynamic {

    constructor( parameters ) {

        super( parameters );
    }

    /**
     * Return a new instance of this
     * 
     * @param  {Object} parameters - Properties to be assigned to the newly created object
     * 
     * @return {Object} New instance of the Reply object
     */
    static model( parameters ) {

        return new Reply( parameters );
    }

    properties() {

        let now = new Date();

        return {
            'Id': this.Id,
            'Message': this.Message,
            'ThreadId': this.ThreadId,
            'CreatedDateTime': now.toJSON(),
            'UpdatedDateTime': now.toJSON(),
            'UserId': this.UserId,
            'UserName': this.UserName
        }
    }

    validate() {

        let errors = [];

        if( typeof this.Id == 'undefined' || validator.isEmpty( this.Id ) ) errors.push({'Id': 'must provide a unique string for Id'});
        if( typeof this.Message == 'undefined' ||  validator.isEmpty( this.Message ) ) errors.push({'Message': 'must provide a value for Message'});
        if( typeof this.ThreadId == 'undefined' || validator.isEmpty( this.ThreadId ) ) errors.push({'ThreadId': 'must provide a value for ThreadId'});
        if( typeof this.UserId == 'undefined' || validator.isEmpty( this.UserId ) ) errors.push({'UserId': 'must provide a value for UserId'});
        if( typeof this.UserName == 'undefined' || validator.isEmpty( this.UserName ) ) errors.push({'UserName': 'must provide a value for UserName'});
        
        if( errors.length ) throw new ValidationError( JSON.stringify( errors )  );

        return this;
    }
}