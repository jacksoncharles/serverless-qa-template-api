'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

var DynamodbError = require('./../_errors/DynamodbError');

/**
 * CRUD service for DynamoDb.
 * 
 * @type {class}
 */
module.exports = class DynamodbService {

	/**
	 * Retrieve an array of replies according to the parameters passed
	 * 
	 * @return {Array} Array of replies.
	 */
	static destroy( parameters ) {

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

	            /** All successful. Create a valid response */
	            return resolve( JSON.stringify( data ) );
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

		return new Promise( function( resolve, reject ) {

	        /** Run a dynamoDb query passing-in Query.parameters  */
	        return dynamoDb.query( parameters, function( error, data ) {

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
}