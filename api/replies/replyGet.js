'use strict';

const Reply = require('./_classes/Reply');

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
module.exports.replyGet = (event, context, callback) => {
  Reply.find(event.pathParameters.id)
    .then((reply) => {
      const response = {
        statusCode: Object.keys(reply).length === 0 ? 404 : 200,
        body: JSON.stringify(reply),
      };

      callback(null, response);
    })
    .catch((error) => {
      console.log('<<<Unknown Error>>>', error);

      callback(null, {
        statusCode: 500,
        body: error,
      });
    });
};
