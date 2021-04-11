'use strict';

const fs = require('fs')
const yaml = require('js-yaml')
const {FileSystemWallet, Gateway } = require('fabric-network')
const helper = require('./helper.js')
let gateway

async function main(org, buyerCRN, drugName, transporterCRN){

  try{

    const pharmanetContract = await helper.getContractInstnace(org);

    console.log('..... Updatiing Shipment')
    const shipmentBuffer = await pharmanetContract.submitTransaction('updateShipment', buyerCRN, drugName, transporterCRN)
    console.log('..... Update shipment transacton submitted')
    console.log('..... Processing shipment update Transaction response \n\n')
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


main("transporter","DIST001","Paracetamol",  "TRA001").then(() => {
  console.log('Shipment Updated')
}).catch((e) => {
  console.log("Error while updating Shipment")
  console.log(e)
})

module.exports.execute = main
