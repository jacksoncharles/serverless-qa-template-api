'use strict';

const Reply = require('./_classes/Reply');

const ReplyQueryBuilder = require('./_classes/ReplyQueryBuilder');

const Errors = require('./../_classes/Errors');
const DynamodbError = Errors.DynamodbError;
const ValidationError = Errors.ValidationError;

/**
 * Handler for the lambda function.
 *
 * @param  {Object}        event -          AWS Lambda uses this parameter to pass in event
 *                                          data to the handler.
 * @param  {Object}        context -        AWS Lambda uses this parameter to provide your
 *                                          handler the runtime information of the Lambda
 *                                          function that is executing.
 * @param  {Function}      callback -       Optional parameter used to pass a callback
 *
 * @return JSON    JSON encoded response.
 */
module.exports.replyList = (event, context, callback) => {
  /**
     * Instantiate an instance of QueryBuilder
     *
     * @type {QueryBuilder}
     */
  const Query = new ReplyQueryBuilder(event.queryStringParameters);

  try {
    Query
      .validate()
      .buildThreadIndex()
      .buildUserIndex()
      .buildPagination();

    /** @type {model} Contains a list of items and optional pagination data  */
    Reply.list(Query.parameters)
      .then((replies) => {
        const response = {
          statusCode: replies.Items.length > 0 ? 200 : 204,
          body: JSON.stringify(replies),
        };

        callback(null, response);
      })
      .catch((error) => {
        callback(null, {
          statusCode: 500,
          body: JSON.stringify({ message: error.message }),
        });
      });
  } catch (error) { // Catch any errors thrown by the ReplyQueryBuilder class
    console.log('<<<ValidationError REDEFINED>>>', ValidationError);
    if (error instanceof ValidationError) {
      callback(null, {
        statusCode: 422,
        body: error.message,
      });
    } else if (error instanceof DynamodbError) {
      console.log('<<<DynamoDb Error>>>', error);

      callback(null, {
        statusCode: 500,
        body: JSON.stringify(error),
      });
    } else {
      console.log('<<<Unknown Error>>>', error);

      callback(null, {
        statusCode: 500,
        body: JSON.stringify(error),
      });
    }
  }
};
