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
module.exports.list = (event, context, callback) => {

    /**
     * Reply object used to build a query captured in the property "parameters".
     * 
     * @param  {Object} event - AWS Lambda uses this parameter to pass in event data to the handler.
     * 
     * @constructor
     */
    var Reply = function( event ) {

        /**
         * Capture the event object passed as a parameter;
         * 
         * @type event
         */
        this.event = event;

        /**
         * Used to hold the dynamodb query parameters built using values
         * within property this.event
         * 
         * @todo : Change TableName to value of process.env.DYNAMODB_REPLY_TABLE
         * 
         * @type Object
         */
        this.parameters = {
            TableName: 'Reply'
        }
    }

     /**
      * The primary key must be set as a query parameter.
      *
      * @return this
      */
    Reply.prototype.setPrimaryKey = function() {

        this.parameters['KeyConditionExpression'] = "ThreadId = :searchstring";
        this.parameters['ExpressionAttributeValues'] = {
            ":searchstring" : this.event.queryStringParameters.threadid
        };

        return this;
    }

    /**
     * If there are any pagination parameters set them here by updating the value of
     * parameters object property
     * 
     * @return this
     */
    Reply.prototype.setPagination = function() {

        if ( this.event.queryStringParameters ) {

            // Pagination
            if ( this.event.queryStringParameters.hasOwnProperty('threadid') && this.event.queryStringParameters.hasOwnProperty('datetime') ) {

                this.parameters['ExclusiveStartKey'] = {
                    ThreadId: this.event.queryStringParameters.threadid,
                    DateTime: this.event.queryStringParameters.datetime
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
    Reply.prototype.setLimit = function() {

        if ( this.event.queryStringParameters ) {

            if ( this.event.queryStringParameters.hasOwnProperty('limit') ) {

                this.parameters['Limit'] = this.event.queryStringParameters.limit;
            }
        }

        return this;
    }

    /**
     * Instantiate an instance of Reply and build the parameters for the query.
     * 
     * @type {Reply}
     */
    var Query = new Reply( event )
        .setPrimaryKey()
        .setPagination()
        .setLimit();

    dynamoDb.query( Query.parameters, function( error, data ) {

        // Handle potential errors
        if (error) {

            console.log('=== error ===', error );
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