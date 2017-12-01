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
module.exports.threadUpdate = (event, context, callback) => {

    var QueryBuilder = function( event ) {

        /**
         * Capture the event object passed as a parameter;
         * 
         * @type event
         */
        this.event = event;

        /**
         * Used to build the object being saved to permanent storage. The value of "Item" will 
         * be populated with user passed parameters
         * 
         * @todo : Change TableName to value of process.env.DYNAMODB_REPLY_TABLE
         * 
         * @type Object
         */
        this.parameters = {
            TableName: 'Thread'
            Item: {}
        }

        /**
         * Holds the schema for validating the parameters passed with the request. Anything failing
         * validation will be stored inside this.errors
         * 
         * @type {Object}
         */
        this.validator = schema({

            ThreadId: {
                type: 'string',
                required: true,
                message: 'threadid is required.'                
            },
            UserId: {
                type: 'number',
                required: true,
                message: 'userid is required.'                
            },
            Title: {
                type: 'string',
                required: true,
                message: 'title is required.'                
            },            
            Message: {
                type: 'string',
                required: true,
                message: 'message is required.'                
            },
            UserName: {
                type: 'string',
                required: true,
                message: 'username is required.'                
            }
        });

        /**
         * Used to hold any validation messages.
         * 
         * @type {Array}
         */
        this.errors = [];

    }

    /**
     * Populates the "item" object prior to saving
     * 
     * @return {this}
     */
    QueryBuilder.prototype.hydrate = function() {

        const timestamp = new Date().getTime();

        this.parameters.Item = {
            Id: uuid.v1(),
            ThreadId: this.event.queryStringParameters.threadid,
            UserId: this.event.queryStringParameters.userid,
            Title: this.event.queryStringParameters.title,
            Message: this.event.queryStringParameters.message,
            UserName: this.event.queryStringParameters.username,
            UpdatedDateTime: timestamp
        };

        return this;
    }

    /**
     * Validates the data passed in the event object
     * 
     * @return {this}
     */
    QueryBuilder.prototype.validates = function() {

        this.errors = [];

        /*
        if ( this.event.queryStringParameters.hasOwnProperty('threadid') == false && typeof this.event.queryStringParameters.threadid !== 'string' ) this.errors.push('threadid missing or invalid');
        if ( this.event.queryStringParameters.hasOwnProperty('userid') == false && typeof this.event.queryStringParameters.userid !== 'string' ) this.errors.push('userid missing or invalid');
        if ( this.event.queryStringParameters.hasOwnProperty('message') == false && typeof this.event.queryStringParameters.message !== 'string' ) this.errors.push('message missing or invalid');
        if ( this.event.queryStringParameters.hasOwnProperty('username') == false && typeof this.event.queryStringParameters.username !== 'string' ) this.errors.push('username missing or invalid');
        */
        // Validate the query parameters
        this.errors = this.validator.validate( this.event.queryStringParameters );

        return this.errors.length ? 0 : 1;
    }

    /**
     * Instantiate an instance of Query
     * 
     * @type {QueryBuilder}
     */
    var Query = new QueryBuilder( event );

    // Check to see if the parameters passed in the request validate.
    if ( Query.validates() == false ) {

        // Handle validation errors
        callback(null, {
            statusCode: 422,
            body: JSON.stringify({
                message: Query.errors
            })
        })
    }
    else {

        // Update the post in the database
        dynamoDb.update( Query.hydrate().parameters, (error, result) => {
        
            // Handle any potential DynamoDb errors
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
    }
};