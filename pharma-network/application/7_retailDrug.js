'use strict';

const fs = require('fs')
const yaml = require('js-yaml')
const {FileSystemWallet, Gateway } = require('fabric-network')
const helper = require('./helper.js')
let gateway

async function main(org, drugName, serialNo, retailerCRN, customerAadhar){

  try{

    const pharmanetContract = await helper.getContractInstnace(org);

    console.log('..... Sell drug')
    const drugBuffer = await pharmanetContract.submitTransaction('retailDrug', drugName, serialNo, retailerCRN, customerAadhar)
    console.log('..... retail drug sell transaction submitted')
    console.log('..... Processing retail Drug Transaction response \n\n')
    let selledDrug = JSON.parse(drugBuffer.toString())
    console.log(selledDrug)
    console.log('\n\n..... Transaction Complete!')
    return selledDrug
  }catch(error){
    console.log(`\n\n ${error} \n\n`)
  }finally{
    helper.disconnect();
  }

}


// main("retailer","Paracetamol", "001", "RET002",  "AAD001").then(() => {
//   console.log('Drug selled')
// }).catch((e) => {
//   console.log("Error while selling Drug")
//   console.log(e)
// })

module.exports.execute = main
