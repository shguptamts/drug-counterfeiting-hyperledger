'use strict';

const {Contract, Context} = require('fabric-contract-api');

const Company = require('./lib/models/company.js')
const CompanyList = require('./lib/lists/companyList.js')

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

    // Create a new composite key for the new company account
    const key  = Company.makeKey([companyCRN, companyName]);

    // Fetch company with given ID from blockchain
    let existingCompanyObj = await ctx.companyList
      .getComapny(key)
      .catch( err =>  console.log('Provided Company crn and name is Unique'));


  if (existingCompanyObj !== undefined ) {
    throw new Error('Invalid Comapny ID. Comapny with id :' + companyCRN + '-' + companyName + ' already exists.');
  } else {

    //  Create a company object to be stored in blockchain
    let companyObj = {
      crn : companyCRN,
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
    await ctx.companyList.registerCompany(newCompanyObj);

    // Return value of new company account created
    console.log('Company registered!');
    return newCompanyObj;
    }
  }
}

module.exports = PharmaContract
