'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

var DynamodbError = require("./../../_classes/DynamodbError");

/**
 * 
 * 
 * @type {class}
 */
module.exports = class Reply {

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
	    });
	}
}