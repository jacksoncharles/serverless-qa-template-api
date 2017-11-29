'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {

    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    console.log( '=== data ===', data );
    console.log( '=== event ===', event );

    // validation
    if (typeof data.title !== 'string' || typeof data.body !== 'string') {

        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t update the post item.',
        });

        return;
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
        ExpressionAttributeValues: {
            ':title': data.title,
            ':body': data.body,
            ':updated_at': timestamp,
        },
        UpdateExpression: 'SET title = :title, body = :body, updated_at = :updated_at',
        ReturnValues: 'ALL_NEW',
    };

    // update the post in the database
    dynamoDb.update(params, (error, result) => {
    
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
            body: JSON.stringify(result.Attributes),
        };
        callback(null, response);
    });
};