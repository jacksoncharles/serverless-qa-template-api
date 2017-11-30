'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

var Reply = function() {

    /**
      * Mandatory parameters for the query.
      * 
      * @type Object
      */
    var parameters = {

        TableName: process.env.DYNAMODB_REPLY_TABLE,
        Key: {
            Id: event.pathParameters.id,
            ReplyDateTime: event.pathParameters.replydatetime,
        }
    }
}

module.exports.replyGet = (event, context, callback) => {

    var Query = new Reply();

    // fetch post from the database
    dynamoDb.get(Query.parameters, (error, result) => {
        
        // handle potential errors
        if (error) {

            console.error('=== error ===', error);

            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t fetch the post item.',
            });
            return;
        }

        // create a response
        const response = {

            statusCode: 200,
            body: JSON.stringify(result.Item),
        };

        callback(null, response);
    });
};