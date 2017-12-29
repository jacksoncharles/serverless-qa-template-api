'use strict';

var Thread = require("./_classes/Thread");

/**
 * Handler for the lambda function.
 * 
 * @param  {Object}        event -          AWS Lambda uses this parameter to pass in event data to the handler.
 * @param  {Object}        context -        AWS Lambda uses this parameter to provide your handler the runtime information of the Lambda function that is executing. 
 * @param  {Function}      callback -      Optional parameter used to pass a callback
 * 
 * @return JSON    JSON encoded response.
 */
module.exports.threadGet = ( event, context, callback ) => {

    Thread.find( event.pathParameters.id )
    .then( ( thread ) => {

        let response = {
            statusCode: Object.keys( thread ).length === 0 ? 404 : 200, 
            body: JSON.stringify( thread )
        }

        callback( null, response );
    })
    .catch( function( error ) {

        console.log('<<<Unknown Error>>>', error );

        callback(null, {
            statusCode: 500,
            body: error
        });

    });
};