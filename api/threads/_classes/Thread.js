'use strict';

const validator = require('validator');

const Dynamic = require('./../../_classes/Dynamic');

const Errors = require('./../../_classes/Errors');

const ValidationError = Errors.ValidationError;

/**
 * Thread class. Each instance maps to one document in permanent storage and extends the
 * Dynamic wrapper class.
 *
 * @type {class}
 */
module.exports = class Thread extends Dynamic {
  /**
     * Return a string containing the name of the table in perment storage
     * for the model.
     *
     * @return {String} - Name of the string
     */
  static table() {
    return 'Thread';
  }

  /**
     * Return a new instance of this
     *
     * @param  {Object} parameters - Properties to be assigned to the newly created object
     *
     * @return {Object} New instance of the Thread object
     */
  static model(parameters) {
    return new Thread(parameters);
  }

  /**
     * Return an object that represents the properties of this class
     *
     * @return {Object} - Class properties that can be saved to dynamodb
     */
  properties() {
    return {
      Id: this.Id,
      ForumId: this.ForumId,
      UserId: this.UserId,
      UserName: this.UserName,
      Title: this.Title,
      Message: this.Message,
      CreatedDateTime: this.CreatedDateTime,
      UpdatedDateTime: this.UpdatedDateTime,
    };
  }

  /**
     * Validate the class properties and throw an exception if necessary
     *
     * @return {this} - Instance of this
     */
  validate() {
    const errors = [];

    if (typeof this.Id === 'undefined' || validator.isEmpty(this.Id)) errors.push({ Id: 'must provide a unique string for Id' });
    if (typeof this.ForumId === 'undefined' || validator.isEmpty(this.ForumId)) errors.push({ ForumId: 'must provide a value for ForumId' });
    if (typeof this.UserId === 'undefined' || validator.isEmpty(this.UserId)) errors.push({ UserId: 'must provide a value for UserId' });
    if (typeof this.UserName === 'undefined' || validator.isEmpty(this.UserName)) errors.push({ UserName: 'must provide a value for UserName' });
    if (typeof this.Title === 'undefined' || validator.isEmpty(this.Title)) errors.push({ Title: 'must provide a value for Title' });
    if (typeof this.Message === 'undefined' || validator.isEmpty(this.Message)) errors.push({ Message: 'must provide a value for Message' });

    if (errors.length) throw new ValidationError(JSON.stringify(errors));

    return this;
  }
};
