'use strict';

var Dynamic = require('./../../_classes/Dynamic');

/**
 * Reply class. Each instance maps to one document in permanent storage and extends the
 * Dynamic wrapper class.
 * 
 * @type {class}
 */
module.exports = class Reply extends Dynamic {

    constructor( parameters ) {

        super( parameters );
    }

    /**
     * Return a new instance of this
     * 
     * @param  {Object} parameters - Properties to be assigned to the newly created object
     * 
     * @return {Object} New instance of the Reply object
     */
    static model( parameters ) {

        return new Reply( parameters );
    }
}