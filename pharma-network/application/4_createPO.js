'use strict';

const fs = require('fs')
const yaml = require('js-yaml')
const {FileSystemWallet, Gateway } = require('fabric-network')
const helper = require('./helper.js')
let gateway

async function main(org, buyerCRN, sellerCRN, drugName, quantity){

  try{

    const pharmanetContract = await helper.getContractInstnace(org);

    console.log('..... Creating a PO')
    const poBuffer = await pharmanetContract.submitTransaction('createPO', buyerCRN, sellerCRN, drugName, quantity)
    console.log('..... Create PO transacton submitted')
    console.log('..... Processing PO creation Transaction response \n\n')
    let newPO = JSON.parse(poBuffer.toString())
    console.log(newPO)
    console.log('\n\n..... Transaction Complete!')
    return newPO
  }catch(error){
    console.log(`\n\n ${error} \n\n`)
  }finally{
    helper.disconnect();
  }

}


main("distributor","DIST001","MAN001", "Paracetamol", "3").then(() => {
  console.log('PO registered')
}).catch((e) => {
  console.log("Error while creating PO")
  console.log(e)
})

module.exports.execute = main
