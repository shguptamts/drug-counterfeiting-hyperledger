'use strict';

const Company = require('../models/company.js');

class CompanyList{

  constructor(ctx){
    this.ctx = ctx;
    this.name = 'org.pharma-network.pharmanet.lists.company';
  }

  /**
	 * Adds a company model to the blockchain
	 * @param companyObj {Company}
	 * @returns {Promise<void>}
	 */
   async registerCompany(companyObj, companyCRN){
     let compositeKey =  this.ctx.stub.createCompositeKey(this.name, [companyCRN]);
     await this.ctx.stub.putState(compositeKey, companyObj.toBuffer());
   }

   /**
	 * Returns the Company model stored in blockchain identified by this key
	 * @param companyKey
	 * @returns {Promise<Company>}
	 */
   async getComapny(companyCRN){
     let compositeKey =  this.ctx.stub.createCompositeKey(this.name, [companyCRN]);
     let buffer =  await this.ctx.stub.getState(compositeKey);
     return Company.fromBuffer(buffer);
   }
}

module.exports = CompanyList;
