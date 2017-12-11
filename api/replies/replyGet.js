'use strict';

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
module.exports.replyGet = (event, context, callback) => {

    Reply.find( event.pathParameters.id )
    .then( ( reply ) => {

        const response = {
            statusCode: 200,
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