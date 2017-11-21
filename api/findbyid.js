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

module.exports.findbyid = (event, context, callback) => {

     let params = {
          TableName: process.env.DYNAMODB_REPLY_TABLE,
          KeyConditionExpression: "Id = :searchstring",
          ExpressionAttributeValues: {
               ":searchstring" : event.pathParameters.id
          }
     }



     if ( event.queryStringParameters ) {

          if ( event.queryStringParameters.hasOwnProperty('limit') ) {

               params['Limit'] = event.queryStringParameters.limit;
          }

          // Pagination
          if ( event.queryStringParameters.hasOwnProperty('id') && event.queryStringParameters.hasOwnProperty('replydatetime') ) {

               params['ExclusiveStartKey'] = {
                    Id: event.queryStringParameters.id,
                    ReplyDateTime: event.queryStringParameters.replydatetime                    
               }
          }
     }
     
     // Do we have any parameters?
     /*
     if( event.queryStringParameters !== null && typeof event.queryStringParameters === 'object' ) {

          // Do we have a limit clause?
          if( event.queryStringParameters.hasOwnProperty('limit') ) params.Limit = event.queryStringParameters.limit;

          // Do we have a page number?
     }
     */
    

     dynamoDb.query(params, function(error, data) {

          console.log( '=== data ===', data );

          // Handle potential errors
          if (error) {

               console.log('=== the error is ===');
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
};