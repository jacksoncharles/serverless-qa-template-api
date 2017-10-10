'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {

    const requestBody = JSON.parse(event.body); // User submitted data

    // Grab the individual elements of the post.
    const title = requestBody.title;
    const body = requestBody.body;
    const user_id = requestBody.user_id;
    const parent_id = requestBody.parent_id;


    /**
     * Save the post to permanent storage
     * 
     * @param  {object} post [New post]
     * @return {array}      [The newly created post]
     */
    const submitPost = post => {
      
        console.log('Submitting post');

        const postDetail = {
            TableName: process.env.POST_TABLE,
            Item: post,
        };

        return dynamoDb.put(postDetail).promise()
        .then(res => post);
    };

    /**
     * Format the post ready for saving to permanent storage
     * 
     * @param  {Array} data  [User submitted data]
     * @return {Object}      [Individual post formatted as an object]
     */
    const formatPost = (data) => {

        const timestamp = new Date().getTime();
        return {
            id: uuid.v1(),
            user_id: data.user_id,
            parent_id: data.parent_id,
            title: data.title,
            body: data.body,
            createdAt: timestamp,
            updatedAt: timestamp
        };
    };

    // Validate the submitted data
    if (
        typeof title !== 'string' || 
        typeof body !== 'string' || 
        typeof user_id !== 'number'
    ) {
        console.error('Validation Failed');
        callback(new Error('Couldn\'t submit post because of validation errors.'));
        return;
    }
   
    // Submit the post and respond accordingly
    submitPost(formatPost(requestBody))
    .then(res => {
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: `Sucessfully submitted post`,
            postId: res.id
            })
        });
    })
    .catch(err => {
        console.log(err);
        callback(null, {
            statusCode: 500,
            body: JSON.stringify({
                message: `Unable to submit post`
            })
        })
    });

};