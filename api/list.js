'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

/*
var params = {
     TableName: process.env.DYNAMODB_TABLE,
     Limit: 10
};

var params = {

     TableName: process.env.DYNAMODB_TABLE,
     IndexName: "UpdatedAtIndex",
     ScanIndexForward: true
};
*/

const params = {
     TableName: process.env.DYNAMODB_TABLE,
     Limit: 5,
     IndexName: 'UpdatedAtIndex',
     KeyConditionExpression: 'dummyHashKey = :x',
     ExpressionAttributeValues: {
          ':x': 'OK'
     },
     ProjectionExpression: "id, userId, parentId, correctAnswer, title, body, createdAt, updatedAt"
}


module.exports.list = (event, context, callback) => {

     // Do we have any parameters?
     /*
     if( event.queryStringParameters !== null && typeof event.queryStringParameters === 'object' ) {

          // Do we have a limit clause?
          if( event.queryStringParameters.hasOwnProperty('limit') ) params.Limit = event.queryStringParameters.limit;

          // Do we have a page number?
     }
     */
     dynamoDb.query(params, function(error, data) {

          // Handle potential errors
          if (error) {

               console.error(error);
               callback(null, {
                    statusCode: error.statusCode || 501,
                    headers: { 'Content-Type': 'text/plain' },
                    body: 'Couldn\'t fetch the posts.',
               });

               return;
          }

          // Create a response
          const response = {
               statusCode: 200,
               body: JSON.stringify(data),
          };

          callback(null, response);

     });

     // Fetch all posts from the database
     /*
     dynamoDb.scan(params, (error, result) => {

          // Handle potential errors
          if (error) {

               console.error(error);
               callback(null, {
                    statusCode: error.statusCode || 501,
                    headers: { 'Content-Type': 'text/plain' },
                    body: 'Couldn\'t fetch the posts.',
               });

               return;
          }

          // Create a response
          const response = {
               statusCode: 200,
               body: JSON.stringify(result.Items),
          };

          callback(null, response);
     });
     */
};