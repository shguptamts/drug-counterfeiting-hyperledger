'use strict';

const fs = require('fs')
const yaml = require('js-yaml')
const {FileSystemWallet, Gateway } = require('fabric-network')
const helper = require('./helper.js')
let gateway

async function main(companyCRN, companyName, location, organisationRole){

  try{

    const pharmanetContract = await helper.getContractInstnace(organisationRole);

    console.log('..... Register a company')
    const companyBuffer = await pharmanetContract.submitTransaction('registerCompany', companyCRN, companyName, location, organisationRole)
    console.log('Register company transacton submitted')
    console.log('..... Processing Register Company Transaction response \n\n')
    let newCompany = JSON.parse(companyBuffer.toString())
    console.log(newCompany)
    console.log('\n\n..... Create Company Transaction Complete!')
    return newCompany
  }catch(error){
    console.log(`\n\n ${error} \n\n`)
  }finally{
    helper.disconnect();
  }

}

//
// main("manufacturer","MAN008","Sun Pharma", "chennai", "manufacturer").then(() => {
//   console.log('Company registered')
// }).catch(() => {
//   console.log("Error while invoking register company")
// })

module.exports.execute = main
