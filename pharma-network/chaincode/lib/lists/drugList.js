'use strict';

const Drug = require('../models/drug.js');

class DrugList{

  constructor(ctx){
    this.ctx = ctx;
    this.name = 'org.pharma-network.pharmanet.lists.drug';
  }

  /**
	 * Adds a company model to the blockchain
	 * @param drugKeyArray
	 * @returns {Promise<void>}
	 */
   async addDrug(drugObj, drugKeyArray){
     let compositeKey =  this.ctx.stub.createCompositeKey(this.name, drugKeyArray).replace(/\0/g, '');
     await this.ctx.stub.putState(compositeKey, drugObj.toBuffer());
   }

   /**
	 * Returns the Company model stored in blockchain identified by this key
	 * @param drugKeyArray
	 * @returns {Promise<Company>}
	 */
   async getDrug(drugKeyArray){
     let compositeKey =  this.ctx.stub.createCompositeKey(this.name, drugKeyArray).replace(/\0/g, '');
     let buffer =  await this.ctx.stub.getState(compositeKey);
     return Drug.fromBuffer(buffer);
   }

   getKey(keyArray){
     return this.ctx.stub.createCompositeKey(this.name, keyArray).replace(/\0/g, '');
   }

   async updateDrug(drugObj, drugKeyArray){
     let compositeKey =  this.ctx.stub.createCompositeKey(this.name, drugKeyArray).replace(/\0/g, '');
     await this.ctx.stub.putState(compositeKey, drugObj.toBuffer());
   }


}

module.exports = DrugList;
