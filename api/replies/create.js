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
module.exports.create = (event, context, callback) => {

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
    }

    /**
     * Populates the "item" object prior to saving
     * 
     * @return {this}
     */
    Reply.prototype.hydrate = function() {

        const requestBody = JSON.parse( this.event.body ); // User submitted data
        const timestamp = new Date().getTime();

        this.parameters.Item = {
            Id: uuid.v1(),
            ThreadId: data.threadid,
            UserId: data.userid,
            Message: data.message,
            UserName: data.username,
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

        if (
            typeof title !== 'string' || 
            typeof body !== 'string' || 
            typeof userId !== 'number'
        ) {
            console.error('Validation Failed');
            callback(new Error('Couldn\'t submit post because of validation errors.'));
            return;
        }
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