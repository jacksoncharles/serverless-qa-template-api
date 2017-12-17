'use strict';

var Reply = require("./_classes/Reply");

var ReplyQueryBuilder = require("./_classes/ReplyQueryBuilder");

var CustomErrors = require("./../_errors/CustomErrors");
var DynamodbError = CustomErrors.DynamodbError;

var DynamodbService = require("./../_services/DynamodbService");

/**
 * Handler for the lambda function.
 * 
 * @param  {Object}        event -          AWS Lambda uses this parameter to pass in event data to the handler.
 * @param  {Object}        context -        AWS Lambda uses this parameter to provide your handler the runtime information of the Lambda function that is executing. 
 * @param  {Function}      callback -      Optional parameter used to pass a callback
 * 
 * @return JSON    JSON encoded response.
 */
module.exports.replyList = (event, context, callback) => {

    /**
     * Instantiate an instance of QueryBuilder
     * 
     * @type {QueryBuilder}
     */
    let Query = new ReplyQueryBuilder( event.queryStringParameters );

    try {

        Query
        .validates()
        .buildThreadIndex()
        .buildUserIndex()
        .buildPagination();

        /** @type {model} Contains a list of items and optional pagination data  */
        Reply.list( Query.parameters )
        .then( ( replies ) => {

            const response = {
                statusCode: ( replies.length > 0 ? 200 : 204 ),
                body: replies
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
    catch( error ) { // Catch any errors thrown by the ReplyQueryBuilder class
        
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