'use strict';

const fs = require('fs')
const yaml = require('js-yaml')
const {FileSystemWallet, Gateway } = require('fabric-network')
const helper = require('./helper.js')
let gateway

async function main( drugName, serialNo, mfgDate, expDate, companyCRN){

  try{

    const pharmanetContract = await helper.getContractInstnace('manufacturer');

    console.log('..... Add a Drug')
    const drugBuffer = await pharmanetContract.submitTransaction('addDrug', drugName, serialNo, mfgDate, expDate, companyCRN)
    console.log('Add drug transacton submitted')
    console.log('..... Processing Add drug Transaction response \n\n')
    let newDrug = JSON.parse(drugBuffer.toString())
    console.log(newDrug)
    console.log('\n\n..... Add Drug Transaction Complete!')
    return newDrug
  }catch(error){
    console.log(`\n\n ${error} \n\n`)
  }finally{
    helper.disconnect();
  }

}


// main("Paracetamol","001", "04-21", "04-22", "MAN001").then(() => {
//   console.log('Drug registered')
// }).catch((e) => {
//   console.log("Error while adding drug")
//   console.log(e)
// })

module.exports.execute = main
