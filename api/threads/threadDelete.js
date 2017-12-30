'use strict';

const Thread = require('./_classes/Thread');

const Errors = require('./../_classes/Errors');

const { DynamodbError } = Errors.DynamodbError;

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
module.exports.threadDelete = (event, context, callback) => {
  Thread.destroy(event.pathParameters.id)
    .then((thread) => {
      const response = {
        statusCode: 204,
        body: thread,
      };

      return callback(null, response);
    })
    .catch((error) => {
      if (error instanceof DynamodbError) {
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
    });
};
