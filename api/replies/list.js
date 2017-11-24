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
          Key: 
          TableName: process.env.DYNAMODB_REPLY_TABLE,
          KeyConditionExpression: "Id = :searchstring",
          ExpressionAttributeValues: {
               ":searchstring" : event.pathParameters.id
          }
     }
}


/**
 * If there are any pagination parameters set them here by updating the value of
 * parameters object property
 * 
 * @return this
 */
Reply.prototype.setPagination = function( event ) {

     if ( event.queryStringParameters ) {

          // Pagination
          if ( event.queryStringParameters.hasOwnProperty('id') && event.queryStringParameters.hasOwnProperty('replydatetime') ) {

               this.parameters['ExclusiveStartKey'] = {
                    Id: event.queryStringParameters.id,
                    ReplyDateTime: event.queryStringParameters.replydatetime                    
               }
          }
     }

     return this;
}

/**
 * Override the default value of "Limit" with any value passed by the query string.
 *
 * @return void
 */
Reply.prototype.setLimit = function( event ) {

     if ( event.queryStringParameters ) {

          if ( event.queryStringParameters.hasOwnProperty('limit') ) {

               params['Limit'] = event.queryStringParameters.limit;
          }
     }

     return this;
}

/**
 * Code starts to execute here using previously defined functions chained together.
 * 
 * @param  Object        event          AWS Lambda uses this parameter to pass in event data to the handler.
 * @param  Object        context        AWS Lambda uses this parameter to provide your handler the runtime information of the Lambda function that is executing. 
 * @param  Function      callback       Optional parameter used to pass a callback
 * 
 * @return JSON    JSON encoded response.
 */
module.exports.list = (event, context, callback) => {

     var Query = new Reply()
     .setPagination()
     .setLimit();

     dynamoDb.query(Query.parameters, function(error, data) {

          // Handle potential errors
          if (error) {

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