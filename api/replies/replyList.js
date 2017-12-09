'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

var ReplyQueryBuilder = require("./_classes/ReplyQueryBuilder");
var ValidationError = require("./../_classes/ValidationError");
var DynamodbError = require("./../_classes/DynamodbError");

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
        .buildPagination()
        .buildLimit();

        /** Run a dynamoDb query passing-in Query.parameters  */
        dynamoDb.query( Query.parameters, function( error, data ) {

            /** Handle potential dynamoDb errors */
            if (error) {

                console.log('***error***', error );

                throw new DynamodbError(error);
            }
            else {

                /** All successful. Create a valid response */

                /** @type {number} return the correct http status code */
                let statusCode = data.length > 0 ? 204 : 200
                
                const response = {
                    statusCode: statusCode,
                    body: JSON.stringify( data ),
                };

                callback( null, response );
            }
        });
    }
    catch( e ) {

        if( e instanceof ValidationError ) {

            callback(null, {
                statusCode: 422,
                body: JSON.stringify( Query.errors )
            });

        } else if ( e instanceof DynamodbError ) {

            console.log('<<<Dynamodb Error>>>', e );

            callback(null, {
                statusCode: 500,
                body: JSON.stringify( e )
            });

        } else {

            console.log('<<<Unknown Error>>>', e );

            callback(null, {
                statusCode: 500,
                body: JSON.stringify( e )
            });

        }
    }
};