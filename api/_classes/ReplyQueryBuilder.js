'use strict';

const validator = require('validator');

/**
 * Responsible for turning parameters passeed are turned in DynamoDb parameters by building 
 * this.parameters object using data passed inside this.events.queryStringParameters
 * 
 * @type {class}
 */
module.exports = class ReplyQueryBuilder {

	constructor( criterion ) {

		/**
		 * Key/value pairs used to build our DynamoDb parameters.
		 *
		 * @type {object}
		 */
		this._criterion = criterion;

		/**
         * Used to hold the dynamodb query parameters built using values
         * within property this.event
         * 
         * @todo : Change TableName to value of process.env.DYNAMODB_REPLY_TABLE
         * 
         * @type {object}
         */
        this._parameters = {
            TableName: 'Reply'
        }

        /**
         * Used to hold any validation errors.
         * 
         * @type {array}
         */
        this._errors = [];
	}

	/**
	 * Getter
	 * 
	 * @return {object} parameters
	 */
	get parameters() {

		return this._parameters;
	}

	/**
	 * Setter
	 * 
	 * @return {object} parameters
	 */
	set parameters( parameters ) {

		this._parameters = parameters;
	}

	/**
	 * Getter
	 * 
	 * @return {array} errors
	 */
	get errors() {

		return this._errors;
	}

	/**
	 * Setter
	 * 
	 * @return {array} errors
	 */
	set errors( errors ) {

		this._errors = errors;
	}

    /**
     * Validates the parameters passed inside this.events object
     * 
     * @return {boolean} 
     */
	validates() {

		this._errors = []; // Reset the errors array before running thr logic

    	if( this._criterion.hasOwnProperty( 'threadid' ) == false &&
    		this._criterion.hasOwnProperty( 'userid' ) == false
    	) {

			this._errors.push( new Error( 'You must provide a threadid or userid parameter' ) );
    	}

        if( this_criterion.hasOwnProperty( 'threadid' ) ) {

            if ( validator.isAlphanumeric( this._criterion.threadid ) == false ) {

                this._errors.push( new Error( 'Your threadid parameter must be an alphanumeric string' ) );
            }
        }
        
        if( this._criterion.hasOwnProperty('userid') ) {

            if ( validator.isNumeric( this._criterion.userid ) == false ) {

                this._errors.push( new Error( 'Your userid parameter must be numeric' ) );
            }
        }
            
        return this._errors.length > 0 ? 0 : 1;		
	}

    /**
     * If "threadid" has been passed inside this.event this method will build upon this.parameters object
     *
     * @return this
     */
    buildThreadIndex() {

        if( this._criterion.hasOwnProperty('threadid') ) {

            this._parameters['IndexName'] = "ThreadIndex";
            this._parameters['KeyConditionExpression'] = "ThreadId = :searchstring";
            this._parameters['ExpressionAttributeValues'] = {
                ":searchstring" : this._criterion.threadid
            };
        }

        return this;
    }

     /**
      * If "userid" has been passed inside this.event this method will build upon this.parameters object
      * 
      * @return this
      */
    buildUserIndex() {

        if ( this._criterion.hasOwnProperty('userid') ) {

            this._parameters['IndexName'] = "UserIndex";
            this._parameters['KeyConditionExpression'] = "UserId = :searchstring";
            this._parameters['ExpressionAttributeValues'] = {
                ":searchstring" : this._criterion.userid
            };
        }

        return this;
    }

    /**
	 * If pagination parameters have been passed inside this.event this method will build upon this.parameters object
     * 
     * @return this
     */
    buildPagination() {

        if ( this._criterion.hasOwnProperty('threadid') && 
        	this._criterion.hasOwnProperty('createddatetime') ) 
        {

            this._parameters['ExclusiveStartKey'] = {
                ThreadId: this._criterion.threadid,
                DateTime: this._criterion.createddatetime
            }
        }

        return this;
    }

    /**
     * Set a value for "Limit" with any value passed by the query string.
     *
     * @return void
     */
    buildLimit() {

        if ( this._criterion.hasOwnProperty('limit') ) {

            this._parameters['Limit'] = this._criterion.limit;
        }

        return this;
    }	
}