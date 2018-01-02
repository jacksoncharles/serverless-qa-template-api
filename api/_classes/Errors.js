'use strict';

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
  	NotFoundError : NotFoundError,
  	ValidationError : ValidationError
}