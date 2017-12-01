'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

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

    /**
     * The parameters needed by DynamoDb
     * 
     * @type {Object}
     */
    const parameters = {

        TableName: 'Reply',
        Key: {
            Id: event.pathParameters.id
        }
    }

    // Run the query to retrieve the Item from permanent storage
    dynamoDb.get(Query.parameters, (error, result) => {
        
        // Handle any potential DynamoDb errors
        if (error) {

            console.error('=== error ===', error);

            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t fetch the post item.',
            });

        }
        else {

            // create a response
            const response = {

                statusCode: 200,
                body: JSON.stringify(result.Item),
            };

            callback(null, response);
        }
    });
};