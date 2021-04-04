'use strict';

const {Contract, Context} = require('fabric-contract-api');

const Company = require('./lib/models/company.js')
const CompanyList = require('./lib/lists/companyList.js')


const Drug = require('./lib/models/drug.js')
const DrugList = require('./lib/lists/drugList.js')

const orgRoleMap  = {
  'manufacturer' : 'Manufacturer',
  'distributor' : 'Distributor',
  'retailer' : 'retailer',
  'transporter' : 'Transporter'
};

const hierarchyMap = {
  'manufacturer' : 1,
  'distributor' : 2,
  'retailer' : 3
};

class PharmaContext extends Context {

  constructor(){
    super();
    // Add various model lists to the context class object
		// this : the context instance
    this.companyList = new CompanyList(this);
    this.drugList =  new DrugList(this);
  }

}

class PharmaContract extends Contract {


  constructor(){
    // Provide a custom name to refer to this smart contract
    super('org.pharma-network.pharmanet');

  }

  // Built in method used to build and return the context for this smart contract on every transaction invoke
  createContext(){
    return new PharmaContext();
  }

  /* ****** All custom functions are defined below ***** */

  	// This is a basic user defined function used at the time of instantiating the smart contract
  	// to print the success message on console
  async instantiate(ctx){
    console.log('Pharmanet Contract instantiated')
  }



  async registerCompany(ctx,companyCRN, companyName, location, organisationRole){

    // TODO: check for organisationRole
    if(orgRoleMap[organisationRole] === undefined)
      throw new Error('Invalid Argument. Organisation role can have below possible values \n manufacturer, \n distributor, \n reatiler,  \n transporter')

    // Fetch company with given ID from blockchain
    let existingCompanyObj = await ctx.companyList
      .getComapny(companyCRN)
      .catch( err =>  console.log('Provided Company crn is Unique'));


  if (existingCompanyObj !== undefined ) {
    throw new Error('Invalid Comapny ID. Comapny with id :' + companyCRN + '-' + companyName + ' already exists.');
  } else {

    //  Create a company object to be stored in blockchain
    let companyObj = {
      companyID : [ctx.companyList.name, companyCRN, companyName].join('.'),
      name : companyName,
      location : location,
      organisationRole : orgRoleMap[organisationRole]
    }

    // Add hierarchy key for non-transporter org role
    if(organisationRole != 'transporter'){
      companyObj.hierarchyKey = hierarchyMap[organisationRole];
    }

    // Create a new instance of company model and save it to blockchain
    let newCompanyObj =  Company.createInstance(companyObj);
    await ctx.companyList.registerCompany(newCompanyObj, companyCRN);

    // Return value of new company account created
    console.log('Company registered!');
    console.log(JSON.stringify(newCompanyObj))
    return newCompanyObj;
    }
  }

  async addDrug(ctx, drugName, serialNo, mfgDate, expDate, companyCRN){

    // TODO: validation -  This transaction should be invoked only by a manufacturer registered on the ledger.

    // Fetch company with given ID from blockchain
    let existingCompanyObj = await ctx.companyList
      .getComapny(companyCRN)
      .catch( err =>  { throw new Error('Provided Company crn does not exists.')} );


    // Create a new composite key for the new company account
    const drugKeyArray  = [drugName, serialNo];

    // Fetch company with given ID from blockchain
    let existingDrugObj = await ctx.drugList
      .getDrug(drugKeyArray)
      .catch( err =>  console.log('Provided Drug name and serial number is Unique'));


  if (existingDrugObj !== undefined ) {
    throw new Error('Invalid drug ID. Drug with id :' + drugName + '-' + serialNo + ' already exists.');
  } else {

    let drugCompositeKey = ctx.drugList.getKey([drugName, serialNo]);

    //  Create a drug object to be stored in blockchain
    let drugObj = {
      productID : drugCompositeKey,
      name : drugName,
      manufacturer : existingCompanyObj.companyID,
      manufacturingDate : mfgDate,
      expiryDate : expDate,
      owner: existingCompanyObj.companyID,
      shipment : null
    }


    // Create a new instance of company model and save it to blockchain
    let newDrugObj =  Drug.createInstance(drugObj);
    await ctx.drugList.addDrug(newDrugObj, drugKeyArray);

    // Return value of new company account created
    console.log('Drug Added!');
    console.log(JSON.stringify(newDrugObj))
    return newDrugObj;
    }
  }


}

module.exports = PharmaContract
