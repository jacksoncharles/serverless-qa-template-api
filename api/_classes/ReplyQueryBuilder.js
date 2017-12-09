'use strict';

const validator = require('validator');

/**
 * Responsible for turning parameters passeed are turned in DynamoDb parameters by building 
 * this.parameters object using data passed inside this.events.queryStringParameters
 * 
 * @type {class}
 */
module.exports = class ReplyQueryBuilder {

	constructor( event ) {

		this._event = event;

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

        if ( this._event.hasOwnProperty( 'queryStringParameters' ) ) { 

        	if( this._event.queryStringParameters.hasOwnProperty( 'threadid' ) == false &&
        		this._event.queryStringParameters.hasOwnProperty( 'userid' ) == false
        	) {

				this._errors.push( new Error( 'You must provide a threadid or userid parameter' ) );
        	}

            if( this._event.queryStringParameters.hasOwnProperty( 'threadid' ) ) {

                if ( validator.isAlphanumeric( this._event.queryStringParameters.threadid ) == false ) {

                    this._errors.push( new Error( 'Your threadid parameter must be an alphanumeric string' ) );
                }
            }
            
            if( this._event.queryStringParameters.hasOwnProperty('userid') ) {

                if ( validator.isNumeric( this._event.queryStringParameters.userid ) == false ) {

                    this._errors.push( new Error( 'Your userid parameter must be numeric' ) );
                }
            }
            
        } else {

            this._errors.push( new Error('You must provide a threadid or userid parameter') );
        }

        return this._errors.length > 0 ? 0 : 1;		
	}

    /**
     * If "threadid" has been passed inside this.event this method will build upon this.parameters object
     *
     * @return this
     */
    buildThreadIndex() {

        if( this._event.queryStringParameters.hasOwnProperty('threadid') ) {

            this._parameters['IndexName'] = "ThreadIndex";
            this._parameters['KeyConditionExpression'] = "ThreadId = :searchstring";
            this._parameters['ExpressionAttributeValues'] = {
                ":searchstring" : this._event.queryStringParameters.threadid
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

        if ( this._event.queryStringParameters.hasOwnProperty('userid') ) {

            this._parameters['IndexName'] = "UserIndex";
            this._parameters['KeyConditionExpression'] = "UserId = :searchstring";
            this._parameters['ExpressionAttributeValues'] = {
                ":searchstring" : this._event.queryStringParameters.userid
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

        if ( this._event.queryStringParameters.hasOwnProperty('threadid') && 
        	this._event.queryStringParameters.hasOwnProperty('createddatetime') ) 
        {

            this._parameters['ExclusiveStartKey'] = {
                ThreadId: this._event.queryStringParameters.threadid,
                DateTime: this._event.queryStringParameters.createddatetime
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

        if ( this._event.queryStringParameters.hasOwnProperty('limit') ) {

            this._parameters['Limit'] = this._event.queryStringParameters.limit;
        }

        return this;
    }	
}