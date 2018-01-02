'use strict';

const AWS = require('aws-sdk');

/** Set the promise library to the default global */
AWS.config.setPromisesDependency(null); 

const dynamodb = new AWS.DynamoDB.DocumentClient();

var Errors = require("./Errors");
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

	    /** @type {Object} Holds the parameters for the get request */
	    const parameters = {

	        TableName : self.constructor.table(),
	        Item : self.properties()
	    }

        // Save to permanent storage
		return dynamodb.put( parameters ).promise().then(

			function(data) {

	            /** @type {Object} Create a new instance of self and populate with the data */
	            return self.constructor.model( parameters.Item );
			},
			function(error) {

				console.log('<<<DynamodbError : SAVE >>>', error);
			}
		);
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
	    
        /** Run a dynamodb get request passing-in our parameters  */
        return dynamodb.get( parameters ).promise().then(

			// Successful response will be automatically resolve
			//  the promise using the 'complete' event
        	function(data) {

	            /** @type {Object} Create a new instance of self and populate with the data */
	            return self.model( data.Item );
        	},
        	function(error) {

        		console.log('<<<DynamodbError : FIND>>>', error);
        	}
        );
   	}

	/**
	 * Retrieve an array of replies according to the parameters passed
	 * 
	 * @return {array} Array of replies 
	 */
	static list( parameters ) {

		var self = this;

        /** Run a dynamodb query passing-in Query.parameters  */
        return dynamodb.query( parameters ).promise().then(

			// Successful response will be automatically resolve
			//  the promise using the 'complete' event
        	function(data) {

	            let items = [];

	            for ( let item of data.Items ) {

	                items.push( self.model( item ) );
	            }

	            data['Items'] = items;

	            /** All successful. Create a valid response */
	            return data;
        	},
        	function(error) {

        		console.log('<<<DynamodbError : LIST>>>', error);
        	}
        );
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

        /** Run a dynamodb get request passing-in our parameters  */
        return dynamodb.delete( parameters ).promise().then(

			// Successful response will be automatically resolve
			//  the promise using the 'complete' event
        	function(data) {

        		return JSON.stringify( data );
        	},
        	function(error) {

        		console.log('<<<DynamodbError : DESTROY>>>', error);
        	}
    	);
	}	
}