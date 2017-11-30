'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 
AWS.config.setPromisesDependency(require('bluebird'));
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
module.exports.replyCreate = (event, context, callback) => {

    var Reply = function( event ) {

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
            TableName: 'Reply'
            Item: {}
        }

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
    Reply.prototype.hydrate = function() {

        const timestamp = new Date().getTime();

        this.parameters.Item = {
            Id: uuid.v1(),
            ThreadId: this.event.queryStringParameters.threadid,
            UserId: this.event.queryStringParameters.userid,
            Message: this.event.queryStringParameters.message,
            UserName: this.event.queryStringParameters.username,
            DateTime: timestamp
        };

        return this;
    }

    /**
     * Validates the data passed in the event object
     * 
     * @return {this}
     */
    Reply.prototype.validates = function() {

        this.errors = [];

        if ( this.event.queryStringParameters.hasOwnProperty('threadid') == false && typeof this.event.queryStringParameters.threadid !== 'string' ) this.errors.push('threadid missing or invalid');
        if ( this.event.queryStringParameters.hasOwnProperty('userid') == false && typeof this.event.queryStringParameters.userid !== 'string' ) this.errors.push('userid missing or invalid');
        if ( this.event.queryStringParameters.hasOwnProperty('message') == false && typeof this.event.queryStringParameters.message !== 'string' ) this.errors.push('message missing or invalid');
        if ( this.event.queryStringParameters.hasOwnProperty('username') == false && typeof this.event.queryStringParameters.username !== 'string' ) this.errors.push('username missing or invalid');

        return this.errors.length ? 0 : 1;
    }

    // Instantiate an instance of Reply and build the Item.
    var Item = new Reply( event );

    if ( Item.validates() == false ) {

        callback(null, {
            statusCode: 422,
            body: JSON.stringify({
                message: Item.errors
            })
        })
    }
    else {

        // Save to permanent storage
        return dynamoDb.put( Item.parameters ).promise()
        .then( res => reply )
        .then( res => {

            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    message: `Sucessfully submitted post`,
                    Id: res.id
                })
            });
        })
        .catch(err => {

            console.log('=== we have an error saving to permanent storage', err );
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({
                    message: `Unable to submit post`
                })
            })
        });
    }
};