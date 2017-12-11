'use strict';

var ReplyQueryBuilder = require("./_classes/ReplyQueryBuilder");
var ValidationError = require("./../_classes/ValidationError");
var DynamodbError = require("./../_classes/DynamodbError");

var Reply = require("./_models/Reply");

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

            return callback( null, response );            
        })
        .catch( ( error ) => {

            console.log('<<<Dynamodb Error>>>', error );

            callback(null, {
                statusCode: 500,
                body: JSON.stringify( error )
            });

        });        
    }
    catch( error ) {

        if( error instanceof ValidationError ) {

            console.log('=== the error is ===', error );

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