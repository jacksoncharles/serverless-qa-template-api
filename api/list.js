'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();
var params = {
  TableName: process.env.POST_TABLE,
  Limit: 10
};

module.exports.list = (event, context, callback) => {

     if( event.queryStringParameters !== null && typeof event.queryStringParameters === 'object' ) {

          if( event.queryStringParameters.hasOwnProperty('limit') ) {

               params.Limit = event.queryStringParameters.limit;
          }
     }

     // fetch all posts from the database
     dynamoDb.scan(params, (error, result) => {

          // handle potential errors
          if (error) {

               console.error(error);
               callback(null, {
                    statusCode: error.statusCode || 501,
                    headers: { 'Content-Type': 'text/plain' },
                    body: 'Couldn\'t fetch the posts.',
               });

               return;
          }

          // create a response
          const response = {
               statusCode: 200,
               body: JSON.stringify(result.Items),
          };

          callback(null, response);
     });
};