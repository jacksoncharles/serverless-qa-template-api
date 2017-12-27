'use strict';

/**
 * 
 * 
 * @type {class}
 */
class DynamodbError extends Error {}

/**
 * 
 * 
 * @type {class}
 */
class NotFoundError extends Error {}

/**
 * 
 * 
 * @type {class}
 */
class ValidationError extends Error {}

module.exports = {
	DynamodbError : DynamodbError,
  	NotFoundError : NotFoundError,
  	ValidationError : ValidationError
}