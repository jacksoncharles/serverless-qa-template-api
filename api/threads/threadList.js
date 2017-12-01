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
module.exports.threadList = (event, context, callback) => {

    /**
     * Query object used to build this.parameters.
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
            TableName: 'Thread'
        }

        /**
         * Holds the schema for validating the parameters passed with the request. Anything failing
         * validation will be stored inside this.errors
         * 
         * @type {Object}
         */
        this.validator = schema({

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
    Query.prototype.validates = function() {

        this.errors = [];

        this.errors = this.validator.validate( this.event.queryStringParameters );    

        return this.errors.length ? 0 : 1;
    }

     /**
      * If "userid" has been passed as parameter this method will build the query.
      * 
      * @return this
      */
    Query.prototype.setUserIndex = function() {

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
    Query.prototype.setPagination = function() {

        if ( this.event.queryStringParameters ) {

            // Pagination
            if ( this.event.queryStringParameters.hasOwnProperty('id') && this.event.queryStringParameters.hasOwnProperty('threaddatetime') ) {

                this.parameters['ExclusiveStartKey'] = {
                    Id: this.event.queryStringParameters.id,
                    ThreadDateTime: this.event.queryStringParameters.threaddatetime
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
    Query.prototype.setLimit = function() {

        if ( this.event.queryStringParameters ) {

            if ( this.event.queryStringParameters.hasOwnProperty('limit') ) {

                this.parameters['Limit'] = this.event.queryStringParameters.limit;
            }
        }

        return this;
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

        Query
        .setThreadIndex()
        .setUserIndex()
        .setPagination()
        .setLimit();

        // Run the DynamoDb query.
        dynamoDb.query( Query.parameters, function( error, data ) {

            // Handle any potential DynamoDb errors
            if (error) {

                console.log('=== error ===', error );
                callback(null, {
                    statusCode: error.statusCode || 501,
                    body: error.ValidationException || 'Couldn\'t fetch the threads.'
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