'use strict';

const fs = require('fs')
const {FileSystemWallet, X509WalletMixin } = require('fabric-network')
const path = require('path')

const crypto_materials = path.resolve(__dirname, '../networkcrypto-config')

const wallet = new FileSystemWallet('./identity/manufacturer')

async function main(certificationPath, privateKeyPath){

  try{
    const certificate = fs.readFileSync(certificatePath).toString()

    const privateKey = fs.readFileSync(privateKeyPath).toString()

    const identityLabel = 'Manufacturer_Admin'
    const identity = X509WalletMixin.createIdentity('manufacturerMSP', certificate, privateKey)

    await wallet.import(identityLabel, identity)
  }catch(error){
    console.log(`Error adding to wallet. ${error}`)
    console.log(error.stack)
    throw new Error(error)
  }
}

module.exports.execute = main;
