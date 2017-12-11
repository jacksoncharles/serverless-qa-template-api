'use strict';

var DynamodbError = require("./../_errors/DynamodbError");

var Reply = require("./_models/Reply");

var Dynamodb = require("./../_services/DynamodbService");

/**
 * Handler for the lambda function.
 * 
 * @param  {Object}        event -          AWS Lambda uses this parameter to pass in event data to the handler.
 * @param  {Object}        context -        AWS Lambda uses this parameter to provide your handler the runtime information of the Lambda function that is executing. 
 * @param  {Function}      callback -      Optional parameter used to pass a callback
 * 
 * @return JSON    JSON encoded response.
 */
module.exports.replyDelete = (event, context, callback) => {

    /** @type {Object} Holds the parameters for the get request */
    const parameters = {

        TableName : process.env.DYNAMODB_REPLY_TABLE,
        Key : {
            Id : event.pathParameters.id
        }
    }

    Dynamodb.destroy( parameters )
    .then( ( reply ) => {

        const response = {
            statusCode: 204,
            body: reply
        }

        return callback( null, response );
    })
    .catch( function( error ) {

        console.log('<<<Error>>>', error );

        callback(null, {
            statusCode: 500,
            body: JSON.stringify( { message: error.message } )
        });

    });
};