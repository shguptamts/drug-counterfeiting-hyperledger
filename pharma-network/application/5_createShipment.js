'use strict';

const fs = require('fs')
const yaml = require('js-yaml')
const {FileSystemWallet, Gateway } = require('fabric-network')
const helper = require('./helper.js')
let gateway

async function main(org, buyerCRN, drugName, listOfAssets, transporterCRN){

  try{

    const pharmanetContract = await helper.getContractInstnace(org);

    console.log('..... Creating a Shipment')
    const shipmentBuffer = await pharmanetContract.submitTransaction('createShipment', buyerCRN, drugName, listOfAssets, transporterCRN)
    console.log('..... Create shipment transacton submitted')
    console.log('..... Processing shipment creation Transaction response \n\n')
    let newShipment = JSON.parse(shipmentBuffer.toString())
    console.log(newShipment)
    console.log('\n\n..... Transaction Complete!')
    return newShipment
  }catch(error){
    console.log(`\n\n ${error} \n\n`)
  }finally{
    helper.disconnect();
  }

}


main("manufacturer","DIST001","Paracetamol", "[001,002,003]",  "TRA001").then(() => {
  console.log('Shipment registered')
}).catch((e) => {
  console.log("Error while creating PO")
  console.log(e)
})

module.exports.execute = main
