'use strict';

const uuid = require('uuid');

var schema = require('validate');
var Dynamic = require('./../../_services/Dynamic');

/**
 * Reply class. Each instance maps to one document in permanent storage and extends the
 * Dynamic wrapper class.
 * 
 * @type {class}
 */
module.exports = class Reply extends Dynamic {


	constructor( parameters = {} ) {		

        /** Grab all the parameters and assign as class properties */
        Object.assign(this, parameters );

        /** @type {Object} Create the validation rules */
		this.validation_rules = {
	        Id: {
                type: 'string',
                required: false,
                message: 'id must be a string'
            },
	        ThreadId: {
                type: 'string',
                required: true,
                message: 'threadid is required'
            },
            UserId: {
                type: 'number',
                required: true,
                message: 'userid is required'
            },
            Message: {
                type: 'string',
                required: true,
                message: 'message is required'
            },
            UserName: {
                type: 'string',
                required: true,
                message: 'username is required'
            }
        }
	}
}