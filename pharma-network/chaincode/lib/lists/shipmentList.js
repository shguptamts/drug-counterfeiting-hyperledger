'use strict';

const Shipment = require('../models/shipment.js');

class ShipmentList{

  constructor(ctx){
    this.ctx = ctx;
    this.name = 'org.pharma-network.pharmanet.lists.shipment';
  }

  /**
	 * Adds a company model to the blockchain
	 * @param shipmentKeyArray
	 * @returns {Promise<void>}
	 */
   async createShipment(shipmentObj, shipmentKeyArray){
     let compositeKey =  this.ctx.stub.createCompositeKey(this.name, shipmentKeyArray);
     await this.ctx.stub.putState(compositeKey, shipmentObj.toBuffer());
   }

   /**
	 * Returns the Company model stored in blockchain identified by this key
	 * @param shipmentKeyArray
	 * @returns {Promise<Company>}
	 */
   async getShipment(shipmentKeyArray){
     let compositeKey =  this.ctx.stub.createCompositeKey(this.name, shipmentKeyArray);
     let buffer =  await this.ctx.stub.getState(compositeKey);
     return Shipment.fromBuffer(buffer);
   }

   getKey(keyArray){
     return this.ctx.stub.createCompositeKey(this.name, keyArray).replace(/\0/g, '');
   }

   async updateShipment(shipmentObj, shipmentKeyArray){
     let compositeKey =  this.ctx.stub.createCompositeKey(this.name, shipmentKeyArray);
     await this.ctx.stub.putState(compositeKey, shipmentObj.toBuffer());
   }


}

module.exports = ShipmentList;
