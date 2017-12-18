'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

var CustomErrors = require("./CustomErrors");
var DynamodbError = CustomErrors.DynamodbError;
var ValidationError = CustomErrors.ValidationError;
var NotFoundError = CustomErrors.NotFoundError;

/**
 * Wrapper for DynamoDb with basic CRUD functionality and a validation method
 * 
 * @type {class}
 */
module.exports = class Dynamic {

	constructor( parameters ) {

		/** Grab all the parameters and assign as class properties */
		Object.assign(this, parameters );
	}
	
	/**
	 * Save the current instance to permanent storage creating a new record or updating an existing record
	 * 
	 * @return {Promise}
	 */
	save() {

		return new Promise( function( resolve, reject ) {

	        // Save to permanent storage
			return dynamoDb.delete( this.properties(), function( error, data ) {

	            // create a response
	            const response = {

	                statusCode: 200,
	                body: JSON.stringify( data )
	            };

	            callback (null, response );
	        });
		})
        .catch( function( error ) {

        	console.log('<<<DynamodbError>>>', error );
        	
        	throw new DynamodbError( error );
        });
	}

	/**
	 * Validates the rules defined in this.validation_rules and throws an error
	 * else returns {this}
	 * 
	 * @return {this}
	 */
	validate() {

		let errors = this.validator.validate( Object.keys( this ) );

		throw new ValidationError( errors );

		return this;
	}

	/**
	 * Retrieve an array of replies according to the parameters passed
	 * 
	 * @return {Array} Array of replies.
	 */
	static destroy( id ) {

	    /** @type {Object} Holds the parameters for the get request */
	    const parameters = {

	        TableName : process.env.DYNAMODB_REPLY_TABLE,
	        Key : {
	            Id : id
	        }
	    }

		return new Promise( function( resolve, reject ) {

	        /** Run a dynamoDb get request passing-in our parameters  */
	        return dynamoDb.delete( parameters, function( error, data ) {

	            /** Handle potential dynamoDb errors */
	            if ( error ) return reject( error );

	            /** All successful. Create a valid response */
	            return resolve( JSON.stringify( data ) );
	        });	    

	    })
        .catch( function( error ) {

        	console.log('<<<DynamodbError>>>', error );
        	
        	throw new DynamodbError( error );
        });	    		
	}

	/**
	 * Retrieve an array of replies according to the parameters passed
	 * 
	 * @return {array} Array of replies 
	 */
	static find( id ) {

		var self = this;

	    /** @type {Object} Holds the parameters for the get request */
	    const parameters = {

	        TableName : process.env.DYNAMODB_REPLY_TABLE,
	        Key : {
	            Id : id
	        }
	    }

		return new Promise( function( resolve, reject ) {

	        /** Run a dynamoDb get request passing-in our parameters  */
	        return dynamoDb.get( parameters, function( error, data ) {

	            /** Handle potential dynamoDb errors */
	            if ( error ) return reject( error );

	            /** @type {Object} Create a new instance of self and populate with the data */
	            let modelInstance = self.model( data.Item );

	            /** All successful. Create a valid response */
	            return resolve( modelInstance );
	        });	    

	    })
        .catch( function( error ) { // Capture a dynamoDb rejection

        	console.log('<<<DynamodbError>>>', error );
        	
        	throw new DynamodbError( error );
        });	    
	}

	/**
	 * Retrieve an array of replies according to the parameters passed
	 * 
	 * @return {array} Array of replies 
	 */
	static list( parameters ) {

		var self = this;

		return new Promise( function( resolve, reject ) {

	        /** Run a dynamoDb query passing-in Query.parameters  */
	        return dynamoDb.query( parameters, function( error, data ) {

	            /** Handle potential dynamoDb errors */
	            if ( error ) return reject( error );

	            let items = [];

	            for ( let item of data.Items ) {

	                items.push( self.model( item ) );
	            }

	            data['Items'] = items;

	            /** All successful. Create a valid response */
	            return resolve( data );
	        });	    

	    })
        .catch( function( error ) {

        	console.log('<<<DynamodbError>>>', error );

        	throw new DynamodbError( error );
        });	    
	}
}