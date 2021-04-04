'use strict';

const {Contract, Context} = require('fabric-contract-api');

const Company = require('./lib/models/company.js')
const CompanyList = require('./lib/lists/companyList.js')


const Drug = require('./lib/models/drug.js')
const DrugList = require('./lib/lists/drugList.js')

const PO = require('./lib/models/po.js')
const POList = require('./lib/lists/poList.js')

const Shipment = require('./lib/models/shipment.js')
const ShipmentList = require('./lib/lists/shipmentList.js')

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
    this.poList = new POList(this);
    this.shipmentList = new ShipmentList(this);
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

    //  This transaction should be invoked only by a manufacturer.
    if('manufacturerMSP' != ctx.clientIdentity.mspId)
      throw new Error('Only a manufacturer can register drug');

    // This transaction should be invoked only by a manufacturer registered on the ledger
    let existingCompanyObj = await ctx.companyList
      .getComapny(companyCRN)
      .catch( err =>  { throw new Error('Provided Company is not registered in blockchain.')} );


    // Create a new composite key for the new drug
    const drugKeyArray  = [drugName, serialNo];

    // Fetch drug with given ID from blockchain
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


    // Create a new instance of drug model and save it to blockchain
    let newDrugObj =  Drug.createInstance(drugObj);
    await ctx.drugList.addDrug(newDrugObj, drugKeyArray);

    // Return value of new company account created
    console.log('Drug Added!');
    console.log(JSON.stringify(newDrugObj))
    return newDrugObj;
    }
  }

  async createPO(ctx, buyerCRN, sellerCRN, drugName, quantity){

    //  This transaction should be invoked only by a distributor or retailer.
    // if('distributorMSP' != ctx.clientIdentity.mspId && 'retailerMSP' != ctx.clientIdentity.mspId)
    //   throw new Error('Only distributor or retailer can create PO');

    // check buyer registered on the ledger
    let buyerObj = await ctx.companyList
      .getComapny(buyerCRN)
      .catch( err =>  { throw new Error('Provided Buyer is not registered in blockchain.')} );

    // check seller registered on the ledger
    let sellerObj = await ctx.companyList
      .getComapny(sellerCRN)
      .catch( err =>  { throw new Error('Provided Seller is not registered in blockchain.')} );

    // validate transfer of drug takes place in a hierarchical manner and no organisation in the middle is skipped
    if( buyerObj.hierarchyKey - sellerObj.hierarchyKey != 1)
      throw new Error('Invalid Purchase Order! Transfer of drug is not place in a hierarchical manner.')

    // Create a new composite key for the new drug
    const poKeyArray  = [buyerCRN, drugName];

    // Fetch drug with given ID from blockchain
    let existingPOObj = await ctx.poList
      .getPO(poKeyArray)
      .catch( err =>  console.log('Provided PO is Unique'));


    if (existingPOObj !== undefined ) {
      throw new Error('Invalid PO ID. PO with id :' + buyerCRN + '-' + drugName + ' already exists.');
    } else {

        let poCompositeKey = ctx.poList.getKey(poKeyArray);

        //  Create a drug object to be stored in blockchain
        let poObj = {
          poID : poCompositeKey,
          drugName : drugName,
          quantity : quantity,
          buyer : buyerObj.companyID,
          seller : sellerObj.companyID
        }

        // Create a new instance of drug model and save it to blockchain
        let newPOobj =  PO.createInstance(poObj);
        await ctx.poList.createPO(newPOobj, poKeyArray);

        // Return value of new company account created
        console.log('Purchase Order Added!');
        console.log(JSON.stringify(newPOobj))
        return newPOobj;

    }

  }

  async createShipment(ctx, buyerCRN, drugName, listOfAssets, transporterCRN ){

      let assetsSerialNo = listOfAssets.substring(1, listOfAssets.length -1).split(',');


      let assets = []
      let assetsCompositeKey = []

        // check buyer registered on the ledger
        let buyerObj = await ctx.companyList
          .getComapny(buyerCRN)
          .catch( err =>  { throw new Error('Provided Buyer is not registered in blockchain.')} );

        // check transporter registered on the ledger
        let transporterObj = await ctx.companyList
          .getComapny(transporterCRN)
          .catch( err =>  { throw new Error('Provided Transporter is not registered in blockchain.')} );


        // Create a new composite key for the new drug
        const poKeyArray  = [buyerCRN, drugName];

        // Fetch drug with given ID from blockchain
        let existingPOObj = await ctx.poList
          .getPO(poKeyArray)
          .catch( err =>  console.log('There is no corresponding PO for shipment'));

        // length of ‘listOfAssets’ should be exactly equal to the quantity specified in the PO
        if( listOfAssets.length != existingPOObj.quantity)
          throw new Error('Invalid parameter! List of asset is not equal to quantity specified in PO')


        if (existingPOObj == undefined ) {
          throw new Error('Invalid PO ID. PO with id :' + buyerCRN + '-' + drugName + ' does not exists for corresponding shipment.');
        } else {

          for(let i=0; i< assetsSerialNo.length; ++i){

            let serialNo = assetsSerialNo[i]
          let  drugKeyArray = [drugName, serialNo]

            //  validate IDs of the asset should be valid IDs which are registered on the network.
            let existingDrugObj = await ctx.drugList
              .getDrug(drugKeyArray)
              .catch( err =>  console.log('Provided Drug ' + drugName + '-' + serialNo + ' is not present in blockchain'));

            //  console.log('Existing drug obj - '+ JSON.stringify(existingDrugObj))
            if(existingDrugObj != undefined){

              //  update owner of each drug of the batch
              existingDrugObj.owner = transporterObj.companyID;

              //  add drugid in asset list
              assetsCompositeKey.push(existingDrugObj.productID)

              // add drug asset, to update the owner
              assets.push(existingDrugObj)

            }else{
              throw new Error('Provided Drug ' + drugName + '-' + serialNo + ' is not present in blockchain');
            }

          }



            let shipmentCompositeKey = ctx.shipmentList.getKey(poKeyArray);

            //console.log(assetsCompositeKey+ '   Assest after join'+ assetsCompositeKey)

            //  Create a drug object to be stored in blockchain
            let shipmentObj = {
              shipmentID : shipmentCompositeKey,
              creator : existingPOObj.seller,
              assets : assetsCompositeKey.join(':'),
              transporter : transporterObj.companyID,
              status : 'in-transit'
            }

            // Create a new instance of drug model and save it to blockchain
            let newShipmentObj =  Shipment.createInstance(shipmentObj);
            await ctx.shipmentList.createShipment(newShipmentObj, poKeyArray);

            // Return value of new company account created
            console.log('Shipment Added!');
            console.log(JSON.stringify(newShipmentObj))

            //  update owner of drugs in consingment

            assets.forEach(async (existingDrugObj, i) => {
              try{

                await ctx.drugList.updateDrug(existingDrugObj, [drugName,listOfAssets[i]]);
                console.log('Updated drug obj '+JSON.stringify(existingDrugObj))
              }catch(error){
                console.log('Error in updating drug - ' + error)
              }
            });

            return newShipmentObj;

        }
  }

  // async updateShipment(ctx, buyerCRN, drugName, transporterCRN){
  //
  //   // check buyer registered on the ledger
  //   let buyerObj = await ctx.companyList
  //     .getComapny(buyerCRN)
  //     .catch( err =>  { throw new Error('Provided Buyer is not registered in blockchain.')} );
  //
  //   // check transporter registered on the ledger
  //   let transporterObj = await ctx.companyList
  //     .getComapny(transporterCRN)
  //     .catch( err =>  { throw new Error('Provided Transporter is not registered in blockchain.')} );
  //
  //
  //   // Create a new composite key for the new drug
  //   const shipmentKeyArray  = [buyerCRN, drugName];
  //
  //   // Fetch drug with given ID from blockchain
  //   let existingShipmentObj = await ctx.shipmentList
  //     .getShipment(shipmentKeyArray)
  //     .catch( err =>  console.log('There is no corresponding shipment'));
  //
  //     console.log('Existing shipment obj -'+JSON.stringify(existingShipmentObj))
  //
  //   if (existingShipmentObj == undefined ) {
  //     throw new Error('Invalid shipment ID. Shipment with id :' + buyerCRN + '-' + drugName + ' does not exists.');
  //   } else {
  //
  //     // TODO: validate transaction should be invoked only by the transporter of the shipment.
  //
  //     console.log('Existing shipment assets - ' + existingShipmentObj.assets)
  //
  //
  //       existingShipmentObj.assets.split(':').forEach(async (drugCompositeKey, i) => {
  //         let serialNo = drugCompositeKey.replace(ctx.drugList.name,'').replace(drugName,'')
  //         let drugKeyArray = [drugName,serialNo]
  //         console.log(drugKeyArray +' for updating owner and shipment')
  //
  //         //  validate IDs of the asset should be valid IDs which are registered on the network.
  //         let existingDrugObj = await ctx.drugList
  //           .getDrug(drugKeyArray)
  //           .catch( err =>  console.log('Provided Drug ' + drugKeyArray + ' is not present in blockchain'));
  //
  //         console.log('Existing drug obj - ' + JSON.stringify(existingDrugObj))
  //
  //         if(existingDrugObj != undefined){
  //
  //           //  update owner and shipment of each drug of the batch
  //           existingDrugObj.owner = buyerObj.companyID;
  //           existingDrugObj.shipment = existingShipmentObj.shipmentID;
  //
  //           //  update drug asset in blockchain
  //           try{
  //             await ctx.drugList.updateDrug(existingDrugObj, drugKeyArray);
  //             console.log('Updated drug asset' + JSON.stringify(drugObj))
  //           }catch(err){
  //             console.log('Error in updating drug - '+ err)
  //           }
  //
  //
  //         }else{
  //           throw new Error('Drug ' + drugKeyArray + ' is not present in blockchain');
  //         }
  //       });
  //
  //       existingShipmentObj.status = 'delivered';
  //       await ctx.shipmentList.updateShipment(existingShipmentObj, shipmentKeyArray)
  //
  //       // Return value of new company account created
  //       console.log('Shipment Updated - status delivered!');
  //       console.log(JSON.stringify(existingShipmentObj))
  //       return existingShipmentObj;
  //   }
  //
  // }



}

module.exports = PharmaContract
