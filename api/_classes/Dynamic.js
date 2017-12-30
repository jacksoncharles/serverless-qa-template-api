'use strict';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

var Errors = require("./Errors");
var DynamodbError = Errors.DynamodbError;
var ValidationError = Errors.ValidationError;
var NotFoundError = Errors.NotFoundError;

/**
 * Wrapper for DynamoDb with basic CRUD functionality.
 * 
 * @type {Class}
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

		var self = this;

		return new Promise( function( resolve, reject ) {

		    /** @type {Object} Holds the parameters for the get request */
		    const parameters = {

		        TableName : self.constructor.table(),
		        Item : self.properties()
		    }

	        // Save to permanent storage
			return dynamodb.put( parameters, function( error, data ) {

				// Handle DynamoDb errors
				if( error ) return reject( error );

	            /** @type {Object} Create a new instance of self and populate with the data */
	            let modelInstance = self.constructor.model( parameters.Item );

	            /** All successful. Create a valid response */
	            return resolve( modelInstance );
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

	        TableName : self.table(),
	        Key : {
	            Id : id
	        }
	    }
	    
		return new Promise( function( resolve, reject ) {

	        /** Run a dynamodb get request passing-in our parameters  */
	        return dynamodb.get( parameters, function( error, data ) {

	            /** Handle potential dynamodb errors */
	            if ( error ) return reject( error );

	            /** @type {Object} Create a new instance of self and populate with the data */
	            let modelInstance = self.model( data.Item );

	            /** All successful. Create a valid response */
	            return resolve( modelInstance );
	        });	    

	    })
        .catch( function( error ) { // Capture a dynamodb rejection

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

	        /** Run a dynamodb query passing-in Query.parameters  */
	        return dynamodb.query( parameters, function( error, data ) {

	            /** Handle potential dynamodb errors */
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

	/**
	 * Retrieve an array of replies according to the parameters passed
	 * 
	 * @return {Array} Array of replies.
	 */
	static destroy( id ) {

		var self = this;

	    /** @type {Object} Holds the parameters for the get request */
	    const parameters = {

	        TableName : self.table(),
	        Key : {
	            Id : id
	        }
	    }

		return new Promise( function( resolve, reject ) {

	        /** Run a dynamodb get request passing-in our parameters  */
	        return dynamodb.delete( parameters, function( error, data ) {

	            /** Handle potential dynamodb errors */
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
}