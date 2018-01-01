'use strict';

const Reply = require('./_classes/Reply');

const Errors = require('./../_classes/Errors');

const ValidationError = Errors.ValidationError;
const DynamodbError = Errors.DynamodbError;

/**
 * Handler for the lambda function.
 *
 * @param  {Object}        event -          AWS Lambda uses this parameter to pass in event
 *                                          data to the handler.
 * @param  {Object}        context -        AWS Lambda uses this parameter to provide your handler
 *                                          the runtime information of the Lambda function that is
 *                                          executing.
 * @param  {Function}      callback -       Optional parameter used to pass a callback
 *
 * @return JSON    JSON encoded response.
 */
module.exports.replyUpdate = (event, context, callback) => {
  try {
    // Get the parameters passed in the body of the request
    const parameters = JSON.parse(event.body);

    // Grab the value of hash key "id" passed in the route
    parameters.Id = event.pathParameters.id;

    // Create a new instance of the reply object passing in our parameters
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
