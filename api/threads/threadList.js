'use strict';

var Thread = require("./_classes/Thread");
var ThreadQueryBuilder = require("./_classes/ThreadQueryBuilder");
var Errors = require("./../_classes/Errors");
var DynamodbError = Errors.DynamodbError;
var ValidationError = Errors.ValidationError;

/**
 * Handler for the lambda function.
 * 
 * @param  {Object}        event -          AWS Lambda uses this parameter to pass in event data to the handler.
 * @param  {Object}        context -        AWS Lambda uses this parameter to provide your handler the runtime information of the Lambda function that is executing. 
 * @param  {Function}      callback -      Optional parameter used to pass a callback
 * 
 * @return JSON    JSON encoded response.
 */
module.exports.threadList = (event, context, callback) => {

    /**
     * Instantiate an instance of QueryBuilder
     * 
     * @type {QueryBuilder}
     */
    let Query = new ThreadQueryBuilder( event.queryStringParameters );

    try {

        Query
        .validate()
        .buildForumIndex()
        .buildUserIndex()
        .buildPagination();

        /** @type {model} Contains a list of items and optional pagination data  */
        Thread.list( Query.parameters )
        .then( ( threads ) => {

            const response = {
                statusCode: threads.Items.length > 0 ? 200 : 204,
                body: JSON.stringify( threads )
            };

            callback( null, response );
        })
        .catch( function( error ) {

            callback(null, {
                statusCode: 500,
                body: JSON.stringify( { message: error.message } )
            });

        });
    }
    catch( error ) { // Catch any errors thrown by the ThreadQueryBuilder class
        
        if( error instanceof ValidationError ) {

            callback(null, {
                statusCode: 422,
                body: error.message
            });

        } else {

            console.log('<<<Unknown Error>>>', error );

            callback(null, {
                statusCode: 500,
                body: JSON.stringify( error )
            });
        }
    }
};