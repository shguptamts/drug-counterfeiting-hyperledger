'use strict';

class Drug {


  /**
	 * Constructor function
	 * @param companyObj {Object}
	 */
  constructor(drugObj){
    //this.key = Drug.makeKey([drugObj.name, drugObj.serialNo]);
    Object.assign(this, drugObj)

  }

  /**
  	 * Get class of this model
  	 * @returns {string}
  */
  static getClass(){
    return 'org.pharma-network.pharmanet.models.drug';
  }

  /**
	 * Convert the buffer stream received from blockchain into an object of this model
	 * @param buffer {Buffer}
	 */
   static fromBuffer(buffer){
     let json = JSON.parse( buffer.toString('utf8').replace(/\0/g, ''));
     return new Drug(json)
   }

   /**
	 * Convert the object of this model to a buffer stream
	 * @returns {Buffer}
	 */
   toBuffer(){
     return Buffer.from(JSON.stringify(this));
   }

   /**
	 * Create a key string joined from different key parts
	 * @param keyParts {Array}
	 * @returns {*}
	 */
	 static makeKey(keyParts){
     return keyParts.map(part => JSON.stringify(part)).join(':');
   }

   /**
	 * Create an array of key parts for this model instance
	 * @returns {Array}
	 */
	  getKeyArray() {
		return this.key.split(":");
	}

  /**
	 * Create a new instance of this model
	 * @returns {Student}
	 * @param companyObj {Object}
	 */
	static createInstance(drugObj) {
		return new Drug(drugObj);
	}
}

module.exports = Drug;
