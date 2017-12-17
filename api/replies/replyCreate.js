'use strict';

var Reply = require("./_classes/Reply");

var CustomErrors = require("./../_errors/CustomErrors");
var ValidationError = CustomErrors.ValidationError;

/**
 * Handler for the lambda function.
 * 
 * @param  {Object}        event -          AWS Lambda uses this parameter to pass in event data to the handler.
 * @param  {Object}        context -        AWS Lambda uses this parameter to provide your handler the runtime information of the Lambda function that is executing. 
 * @param  {Function}      callback -      Optional parameter used to pass a callback
 * 
 * @return JSON    JSON encoded response.
 */
module.exports.replyCreate = (event, context, callback) => {

    let reply = new Reply( this.event.queryStringParameters );

    reply
    .validate()
    .save()
    .then( ( data ) => {

        const response = {
            statusCode: 200,
            body: data
        }

        return callback( null, response );
    })
    .catch( function( error ) {

        if( error instanceof ValidationError ) {

            callback(null, {
                statusCode: 422,
                body: error.message
            });
        }
        else if( error instanceof DynamodbError ) {

            console.log('<<<Dynamodb Error>>>', error );

            callback(null, {
                statusCode: 500,
                body: JSON.stringify( error )
            });

        } 
        else {

            console.log('<<<Unknown Error>>>', error );

            callback(null, {
                statusCode: 500,
                body: JSON.stringify( error )
            });
        }
    });    
};