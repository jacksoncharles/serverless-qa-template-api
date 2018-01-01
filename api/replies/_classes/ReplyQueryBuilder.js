'use strict';

const validator = require('validator');

const Errors = require('./../../_classes/Errors');

const ValidationError = Errors.ValidationError;

/**
 * Responsible for turning parameters passeed are turned in DynamoDb parameters by building
 * this.parameters object using data passed inside this.events.queryStringParameters
 *
 * @type {class}
 */
module.exports = class ReplyQueryBuilder {
  constructor(criterion) {
    /** @type {Object} Key/value pairs used to build our DynamoDb parameters. */
    this.criterion = criterion;

    /**
     * Used to hold the dynamodb query parameters built using values
     * within property this.event
     *
     * @todo : Change TableName to value of process.env.DYNAMODB_REPLY_TABLE
     *
     * @type {object}
     */
    this.params = {
      TableName: 'Reply',
    };

    /**
     * Used to hold any validation errors.
     *
     * @type {array}
     */
    this.failures = [];
  }

  /**
   * Getter
   *
   * @return {object} parameters
   */
  get parameters() {
    return this.params;
  }

  /**
   * Setter
   *
   * @return {object} parameters
   */
  set parameters(params) {
    this.params = params;
  }

  /**
   * Getter
   *
   * @return {array} errors
   */
  get errors() {
    return this.failures;
  }

  /**
   * Setter
   *
   * @return {array} failures
   */
  set errors(failures) {
    this.failures = failures;
  }

  /**
   * Validates the parameters passed inside this.criterion object
   *
   * @return {boolean}
   */
  validate() {
    this.errors = []; // Reset the errors array before running the validation logic

    if (this.criterion !== null && typeof this.criterion === 'object') {
      if (Object.prototype.hasOwnProperty.call(this.criterion, 'threadid') === false &&
        Object.prototype.hasOwnProperty.call(this.criterion, 'userid') === false
      ) {
        this.errors.push({ message: 'You must provide a threadid or userid parameter' });
      }

      if (Object.prototype.hasOwnProperty.call(this.criterion, 'threadid')) {
        if (validator.isAlphanumeric(this.criterion.threadid) === false) {
          this.errors.push({ message: 'Your threadid parameter must be an alphanumeric string' });
        }
      }

      if (Object.prototype.hasOwnProperty.call(this.criterion, 'userid')) {
        if (validator.isNumeric(this.criterion.userid) === false) {
          this.errors.push({ message: 'Your userid parameter must be numeric' });
        }
      }
    } else {
      this.errors.push({ message: 'You must supply a threadid or userid' });
    }

    if (this.errors.length) {
      throw new ValidationError(JSON.stringify(this.errors));
    }

    return this;
  }

  /**
     * If "threadid" has been passed inside this.event this method will build
     * upon this.parameters object
     *
     * @return this
     */
  buildThreadIndex() {
    if (Object.prototype.hasOwnProperty.call(this.criterion, 'threadid')) {
      this.parameters.IndexName = 'ThreadIndex';
      this.parameters.KeyConditionExpression = 'ThreadId = :searchstring';
      this.parameters.ExpressionAttributeValues = {
        ':searchstring': this.criterion.threadid,
      };
    }

    return this;
  }

  /**
   * If "userid" has been passed inside this.event this method will build upon
   * this.parameters object.
   *
   * @return this
   */
  buildUserIndex() {
    if (Object.prototype.hasOwnProperty.call(this.criterion, 'userid')) {
      this.parameters.IndexName = 'UserIndex';
      this.parameters.KeyConditionExpression = 'UserId = :searchstring';
      this.parameters.ExpressionAttributeValues = {
        ':searchstring': this.criterion.userid,
      };
    }

    return this;
  }

  /**
   * If pagination parameters have been passed inside this.event this
   * method will build upon this.parameters object.
   *
   * @return this
   */
  buildPagination() {
    if (Object.prototype.hasOwnProperty.call(this.criterion, 'threadid') &&
      Object.prototype.hasOwnProperty.call(this.criterion, 'createddatetime')
    ) {
      this.parameters.ExclusiveStartKey = {
        ThreadId: this.criterion.threadid,
        DateTime: this.criterion.createddatetime,
      };
    }

    if (Object.prototype.hasOwnProperty.call(this.criterion, 'limit')) {
      this.parameters.Limit = this.criterion.limit;
    }

    return this;
  }
};
