'use strict';

const PO = require('../models/po.js');

class POList{

  constructor(ctx){
    this.ctx = ctx;
    this.name = 'org.pharma-network.pharmanet.lists.po';
  }

  /**
	 * Adds a po model to the blockchain
	 * @param poKeyArray
	 * @returns {Promise<void>}
	 */
   async createPO(drugObj, poKeyArray){
     let compositeKey =  this.ctx.stub.createCompositeKey(this.name, poKeyArray).replace(/\0/g, '');
     await this.ctx.stub.putState(compositeKey, drugObj.toBuffer());
   }

   /**
	 * Returns the Company model stored in blockchain identified by this key
	 * @param poKeyArray
	 * @returns {Promise<Company>}
	 */
   async getPO(poKeyArray){
     let compositeKey =  this.ctx.stub.createCompositeKey(this.name, poKeyArray).replace(/\0/g, '');
     let buffer =  await this.ctx.stub.getState(compositeKey);
     return PO.fromBuffer(buffer);
   }

   getKey(keyArray){
     return this.ctx.stub.createCompositeKey(this.name, keyArray).replace(/\0/g, '');
   }


}

module.exports = POList;
