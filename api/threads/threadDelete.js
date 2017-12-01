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
module.exports.threadDelete = (event, context, callback) => {
  
    /**
     * The parameters used by DynamoDb
     * 
     * @type {Object}
     */
    const parameters = {
        TableName: 'Thread',
        Key: {
            id: event.pathParameters.id,
        }
    };

    // Run the query to remove the item from permenent storage
    dynamoDb.delete(parameters, (error) => {

        // Handle any potential DynamoDb errors
        if (error) {

            console.error('=== error ===', error);

            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t remove the post item.',
            });

        }
        else {

            // Create a successful response
            const response = {
              statusCode: 204,
              body: JSON.stringify({}),
            };

            callback(null, response);
        }
    });
};