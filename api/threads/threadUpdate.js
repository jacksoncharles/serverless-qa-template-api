'use strict';

var Thread = require("./_classes/Thread");
var Errors = require("./../_classes/Errors");
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
module.exports.threadUpdate = (event, context, callback) => {

    try {

        let parameters = JSON.parse( event.body );

        let thread = new Thread( parameters );

        thread
        .validate()
        .save()
        .then( ( data ) => {

            const response = {
                statusCode: 200,
                body: JSON.stringify( data )
            }

            return callback( null, response );
        })
        .catch( function( error ) {

            callback(null, {
                statusCode: 500,
                body: JSON.stringify( { message: error.message } )
            });

        });

    } catch( error ) {

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
    }
};