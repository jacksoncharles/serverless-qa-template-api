'use strict';

/**
 * 
 * 
 * @type {class}
 */
module.exports = class Reply {

	constructor() {		

        this.validation = {

	            ThreadId: {
	                type: 'string',
	                required: true,
	                message: 'threadid is required.'                
	            },
	            UserId: {
	                type: 'number',
	                required: true,
	                message: 'userid is required.'                
	            },
	            Message: {
	                type: 'string',
	                required: true,
	                message: 'message is required.'                
	            },
	            UserName: {
	                type: 'string',
	                required: true,
	                message: 'username is required.'                
	            }
        }
	}
}