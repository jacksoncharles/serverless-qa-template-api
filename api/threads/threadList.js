'use strict';

const Thread = require('./_classes/Thread');

const ThreadQueryBuilder = require('./_classes/ThreadQueryBuilder');

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
module.exports.threadList = (event, context, callback) => {
  /**
     * Instantiate an instance of QueryBuilder
     *
     * @type {QueryBuilder}
     */
  const Query = new ThreadQueryBuilder(event.queryStringParameters);

  try {
    Query
      .validate()
      .buildForumIndex()
      .buildUserIndex()
      .buildPagination();

    /** @type {model} Contains a list of items and optional pagination data  */
    Thread.list(Query.parameters)
      .then((threads) => {
        const response = {
          statusCode: threads.Items.length > 0 ? 200 : 204,
          body: JSON.stringify(threads),
        };

        callback(null, response);
      })
      .catch((error) => {
        callback(null, {
          statusCode: 500,
          body: JSON.stringify({ message: error.message }),
        });
      });
  } catch (error) { // Catch any errors thrown by the ThreadQueryBuilder class
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
