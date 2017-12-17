'use strict';

var Reply = require("./_models/Reply");

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
module.exports.replyGet = ( event, context, callback ) => {

    Reply.find( event.pathParameters.id )
    .then( ( reply ) => {

        let statusCode = 200;
        if( Object.keys( reply ).length === 0 ) statusCode = 404; // Catch a 404

        let response = {
            statusCode: statusCode, // Will be used by the API gateway in the response
            body: reply
        }

        console.log( 'response', response );

        callback( null, response );
    })
    .catch( function( error ) {

        console.log('<<<Error>>>', error );

        callback(null, {
            statusCode: 500,
            body: error
        });

    });
};