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
module.exports.replyList = (event, context, callback) => {

    /**
     * QueryBuilder object used to build this.parameters.
     * 
     * @param  {Object} event - AWS Lambda uses this parameter to pass in event data to the handler.
     * 
     * @constructor
     */
    var QueryBuilder = function( event ) {

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

        /**
         * Holds the schema for validating the parameters passed with the request. Anything failing
         * validation will be stored inside this.errors
         * 
         * @type {Object}
         */
        this.validator = schema({

            ThreadId: {
                type: 'string',
                required: false,
                message: 'threadid is not a string.'
            },
            UserId: {
                type: 'number',
                required: false,
                message: 'userid is not a number.'
            }
        });

        /**
         * Used to hold any validation errors.
         * 
         * @type {Array}
         */
        this.errors = [];

    }

    /**
     * Validates the parameters passed
     * 
     * @return {boolean} 
     */
    QueryBuilder.prototype.validates = function() {

        if ( this.event.hasOwnProperty('queryStringParameters') == false ) {

            this.errors[] = {
                code: 422,
                message: 'No query string parameters passed, threadid or userid required'
            };
            
        } else {

            this.errors = this.validator.validate( this.event.queryStringParameters );    
        }

        

        return this.errors.length ? 0 : 1;
    }

    /**
     * If "threadid" has been passed as parameter this method will build the query.
     *
     * @return this
     */
    QueryBuilder.prototype.setThreadIndex = function() {

        if ( this.event.queryStringParameters && this.event.queryStringParameters.threadid ) {

            this.parameters['IndexName'] = "ThreadIndex";
            this.parameters['KeyConditionExpression'] = "ThreadId = :searchstring";
            this.parameters['ExpressionAttributeValues'] = {
                ":searchstring" : this.event.queryStringParameters.threadid
            };
        }

        return this;
    }

     /**
      * If "userid" has been passed as parameter this method will build the query.
      * 
      * @return this
      */
    QueryBuilder.prototype.setUserIndex = function() {

        if ( this.event.queryStringParameters && this.event.queryStringParameters.userid ) {

            this.parameters['IndexName'] = "UserIndex";
            this.parameters['KeyConditionExpression'] = "UserId = :searchstring";
            this.parameters['ProjectionExpression'] = "Id, UserId, Message, CreatedDateTime";
            this.parameters['ExpressionAttributeValues'] = {
                ":searchstring" : this.event.queryStringParameters.userid
            };
        }

        return this;
    }

    /**
     * If there are any pagination parameters set them here by updating the value of
     * parameters object property
     * 
     * @return this
     */
    QueryBuilder.prototype.setPagination = function() {

        if ( this.event.queryStringParameters ) {

            // Pagination
            if ( this.event.queryStringParameters.hasOwnProperty('threadid') && this.event.queryStringParameters.hasOwnProperty('CreatedDateTime') ) {

                this.parameters['ExclusiveStartKey'] = {
                    ThreadId: this.event.queryStringParameters.threadid,
                    DateTime: this.event.queryStringParameters.CreatedDateTime
                }
            }
        }

        return this;
    }

    /**
     * Set a value for "Limit" with any value passed by the query string.
     *
     * @return void
     */
    QueryBuilder.prototype.setLimit = function() {

        if ( this.event.queryStringParameters ) {

            if ( this.event.queryStringParameters.hasOwnProperty('limit') ) {

                this.parameters['Limit'] = this.event.queryStringParameters.limit;
            }
        }

        return this;
    }

    /**
     * Instantiate an instance of QueryBuilder
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

        Query
        .setThreadIndex()
        .setUserIndex()
        .setPagination()
        .setLimit();

        dynamoDb.query( Query.parameters, function( error, data ) {

            // Handle potential errors
            if (error) {

                console.log('=== error ===', error );
                callback(null, {
                    statusCode: error.statusCode || 501,
                    body: error.ValidationException || 'Couldn\'t fetch the replies.'
                });

                return;
            }
            else {

                // Create a response
                const response = {
                    statusCode: 200,
                    body: JSON.stringify(data),
                };

                callback(null, response);
            }
        }
    });
};