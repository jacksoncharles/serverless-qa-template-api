'use strict';

const uuidv1 = require('uuid/v1');

const Reply = require('./_classes/Reply');

const Errors = require('./../_classes/Errors');

const { ValidationError } = Errors.ValidationError;
const { DynamodbError } = Errors.DynamodbError;

/**
 * Handler for the lambda function.
 *
 * @param  {Object}        event -          AWS Lambda uses this parameter to pass in event
 *                                          data to the handler.
 * @param  {Object}        context -        AWS Lambda uses this parameter to provide your
 *                                          handler the runtime information of the Lambda
 *                                          function that is executing.
 * @param  {Function}      callback -       Optional parameter used to pass a callback.
 *
 * @return JSON    JSON encoded response.
 */
module.exports.replyCreate = (event, context, callback) => {
  try {
    const parameters = JSON.parse(event.body);
    parameters.Id = uuidv1();

    const reply = new Reply(parameters);

    reply
      .validate()
      .save()
      .then((data) => {
        const response = {
          statusCode: 200,
          body: JSON.stringify(data),
        };

        return callback(null, response);
      })
      .catch((error) => {
        console.log('<<<Unknown Error>>>', error);

        callback(null, {
          statusCode: 500,
          body: JSON.stringify({ message: error.message }),
        });
      });
  } catch (error) {
    if (error instanceof ValidationError) {
      callback(null, {
        statusCode: 422,
        body: error.message,
      });
    } else if (error instanceof DynamodbError) {
      console.log('<<<Dynamodb Error>>>', error);

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
