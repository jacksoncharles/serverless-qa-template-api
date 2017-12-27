'use strict';

var Errors = require("./../../_classes/Errors");
var ValidationError = Errors.ValidationError;
var Thread = require("./_models/Thread");
var Dynamodb = require("./../_classes/DynamodbService");

/**
 * Handler for the lambda function.
 * 
 * @param  {Object}        event -          AWS Lambda uses this parameter to pass in event data to the handler.
 * @param  {Object}        context -        AWS Lambda uses this parameter to provide your handler the runtime information of the Lambda function that is executing. 
 * @param  {Function}      callback -      Optional parameter used to pass a callback
 * 
 * @return JSON    JSON encoded response.
 */
module.exports.threadDelete = (event, context, callback) => {

    Thread.destroy( event.pathParameters.id )
    .then( ( thread ) => {

        const response = {
            statusCode: 204,
            body: thread
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