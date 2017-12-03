'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const validator = require('validator');

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

    let e = event;

    /**
     * QueryBuilder object used to build this.parameters.
     * 
     * @param  {Object} event - AWS Lambda uses this parameter to pass in event data to the handler.
     * 
     * @constructor
     */
    function QueryBuilder() {

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
         * Used to hold any validation errors.
         * 
         * @type {Array}
         */
        this.errors = [];
    };

    /**
     * Validates the parameters passed
     * 
     * @return {boolean} 
     */
    QueryBuilder.prototype.validates = function() {

        this.errors = [];
        
        if ( e.hasOwnProperty('queryStringParameters') ) {

            if ( validator.isAlphanumeric(e.queryStringParameters.threadid) == false ) {
                this.errors.push( new Error('threadid must be an alphanumeric string') );    
            }
            
            if ( validator.isNumeric(e.queryStringParameters.userid) == false ) {
                this.errors.push( new Error('userid must be numeric') );
            }
            
        } else {

            this.errors.push( new Error('No query string parameters passed, threadid or userid required') );
        }

        return this.errors.length ? 0 : 1;
    }

    /**
     * If "threadid" has been passed as parameter this method will build the query.
     *
     * @return this
     */
    QueryBuilder.prototype.setThreadIndex = function() {

        if( e.queryStringParameters.hasOwnProperty('threadid') ) {

            this.parameters['IndexName'] = "ThreadIndex";
            this.parameters['KeyConditionExpression'] = "ThreadId = :searchstring";
            this.parameters['ExpressionAttributeValues'] = {
                ":searchstring" : e.queryStringParameters.threadid
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

        if ( e.queryStringParameters.hasOwnProperty('userid') ) {

            this.parameters['IndexName'] = "UserIndex";
            this.parameters['KeyConditionExpression'] = "UserId = :searchstring";
            this.parameters['ExpressionAttributeValues'] = {
                ":searchstring" : e.queryStringParameters.userid
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

        // Pagination
        if ( e.queryStringParameters.hasOwnProperty('threadid') && e.queryStringParameters.hasOwnProperty('createddatetime') ) {

            this.parameters['ExclusiveStartKey'] = {
                ThreadId: e.queryStringParameters.threadid,
                DateTime: e.queryStringParameters.createddatetime
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

        if ( e.queryStringParameters.hasOwnProperty('limit') ) {

            this.parameters['Limit'] = e.queryStringParameters.limit;
        }

        return this;
    }

    /**
     * Instantiate an instance of QueryBuilder
     * 
     * @type {QueryBuilder}
     */
    let Query = new QueryBuilder();

    if ( Query.validates() ) {

        Query
        .setThreadIndex()
        .setUserIndex()
        .setPagination()
        .setLimit();

        dynamoDb.query( Query.parameters, function( error, data ) {

            // Handle potential errors
            if (error) {

                console.log('=== dynamodb validation error ===', JSON.stringify( error ));
                callback(null, JSON.stringify( error ) );

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
        })
    }
    else {

        // Handle validation errors
        callback(null, {
            statusCode: 422,
            body: JSON.stringify(Query.errors)
        });
    }
};