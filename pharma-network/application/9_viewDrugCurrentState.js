'use strict';

const fs = require('fs')
const yaml = require('js-yaml')
const {FileSystemWallet, Gateway } = require('fabric-network')
const helper = require('./helper.js')
let gateway

async function main(org, drugName, serialNo){

  try{

    const pharmanetContract = await helper.getContractInstnace(org);

    console.log('..... View drug current state')
    const drugBuffer = await pharmanetContract.submitTransaction('viewDrugCurrentState', drugName, serialNo)
    console.log('..... view-drug tansaction submitted')
    console.log('..... Processing view-drug Transaction response \n\n')
    let drug = JSON.parse(drugBuffer.toString())
    console.log(drug)
    console.log('\n\n..... Transaction Complete!')
    return drug
  }catch(error){
    console.log(`\n\n ${error} \n\n`)
  }finally{
    helper.disconnect();
  }

}


// main("consumer","Paracetamol", "001").then(() => {
//   console.log('Drug current state  viewed')
// }).catch((e) => {
//   console.log("Error while viewing drug current state")
//   console.log(e)
// })

module.exports.execute = main
