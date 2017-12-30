'use strict';

const validator = require('validator');

var Errors = require("./../../_classes/Errors");
var ValidationError = Errors.ValidationError;

/**
 * Responsible for turning parameters passeed are turned in DynamoDb parameters by building 
 * this.parameters object using data passed inside this.events.queryStringParameters
 * 
 * @type {class}
 */
module.exports = class ThreadQueryBuilder {

	constructor( criterion ) {
        
        /** @type {Object} Key/value pairs used to build our DynamoDb parameters. */
		this._criterion = criterion;

		/**
         * Used to hold the dynamodb query parameters built using values
         * within property this.event
         * 
         * @todo : Change TableName to value of process.env.DYNAMODB_THREAD_TABLE
         * 
         * @type {object}
         */
        this._parameters = {
            TableName: 'Thread'
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
	 * Validates the parameters passed inside this._criterion object
	 * 
	 * @return {boolean} 
	 */
	validate() {

		this._errors = []; // Empty the errors array before running the validation logic

        if( this._criterion !== null && typeof this._criterion === 'object' ) {

            if( this._criterion.hasOwnProperty( 'forumid' ) == false &&
                this._criterion.hasOwnProperty( 'userid' ) == false
            ) {

                this._errors.push( { "message": "You must provide a forumid or userid parameter" } );
            }

            if( this._criterion.hasOwnProperty( 'forumid' ) ) {

                if ( validator.isAlphanumeric( this._criterion.forumid ) == false ) {

                    this._errors.push( { "message": "Your forumid parameter must be an alphanumeric string" } );
                }
            }

            if( this._criterion.hasOwnProperty('userid') ) {

                if ( validator.isNumeric( this._criterion.userid ) == false ) {

                    this._errors.push( { "message": "Your userid parameter must be numeric" } );
                }
            }
        }
        else {

            this._errors.push( { "message" : "You must supply a forumid or userid" } );
        }

		if( this._errors.length ) {

            throw new ValidationError( JSON.stringify( this._errors ) );
        }

        return this;
	}

    /**
     * If "forumid" has been passed inside this.event this method will build upon this.parameters object
     *
     * @return this
     */
    buildForumIndex() {

        if( this._criterion.hasOwnProperty('forumid') ) {

            this._parameters['IndexName'] = "ForumIndex";
            this._parameters['KeyConditionExpression'] = "ForumId = :searchstring";
            this._parameters['ExpressionAttributeValues'] = {
                ":searchstring" : this._criterion.forumid
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

        if ( this._criterion.hasOwnProperty('forumid') && 
            this._criterion.hasOwnProperty('createddatetime') ) 
        {
            this._parameters['ExclusiveStartKey'] = {
                ForumId: this._criterion.forumid,
                DateTime: this._criterion.createddatetime
            }
        }

        if ( this._criterion.hasOwnProperty('limit') ) {

            this._parameters['Limit'] = this._criterion.limit;
        }

        return this;
    }
}