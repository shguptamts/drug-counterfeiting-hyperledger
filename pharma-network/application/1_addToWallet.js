'use strict';

const fs = require('fs')
const {FileSystemWallet, X509WalletMixin } = require('fabric-network')
const path = require('path')

var identityLabel ='manufacturer_admin';
var msp = 'manufacturerMSP';

const crypto_materials = path.resolve(__dirname, '../networkcrypto-config')

var wallet = new FileSystemWallet('./identity/manufacturer')

async function main(org,certificatePath, privateKeyPath){

  try{
    const certificate = fs.readFileSync(certificatePath).toString()

    const privateKey = fs.readFileSync(privateKeyPath).toString()

    //set identityLable and msp according to org
    setIdentityAndLabel(org)

    const identity = X509WalletMixin.createIdentity(msp, certificate, privateKey)

    await wallet.import(identityLabel, identity)
  }catch(error){
    console.log(`Error adding to wallet. ${error}`)
    console.log(error.stack)
    throw new Error(error)
  }
}

//  set identity lable and msp for identity to be gnerated
async function setIdentityAndLabel(org){

  switch(org){
    case 'distributor' : identityLabel ='distributor_admin'
                    msp = 'distributorMSP'
                    wallet = new FileSystemWallet('./identity/distributor')
                    break

    case 'retailer' :  identityLabel ='retailer_admin'
                  msp = 'retailerMSP'
                  wallet = new FileSystemWallet('./identity/retailer')
                  break

    case 'consumer': identityLabel ='consumer_admin'
                    msp = 'consumerMSP'
                    wallet = new FileSystemWallet('./identity/consumer')
                    break

    case 'transporter': identityLabel ='transporter_admin'
                    msp = 'transporterMSP'
                    wallet = new FileSystemWallet('./identity/transporter')
                    break

    case 'manufacturer': identityLabel ='manufacturer_admin'
                    msp = 'manufacturerMSP'
                    wallet = new FileSystemWallet('./identity/manufacturer')
                    break
  };
}

main('manufacturer','/home/upgrad/workspace/capstone/pharma-network/network/crypto-config/peerOrganizations/manufacturer.pharma-network.com/users/Admin@manufacturer.pharma-network.com/msp/signcerts/Admin@manufacturer.pharma-network.com-cert.pem',
'/home/upgrad/workspace/capstone/pharma-network/network/crypto-config/peerOrganizations/manufacturer.pharma-network.com/users/Admin@manufacturer.pharma-network.com/msp/keystore/1070198ad8d4af17d95e414d1f6a9a96d6d8f0c955a242c6ddf71746b794eb69_sk').then(() => {
  console.log('Manufacturer User identity added to wallet')
})

main('distributor','/home/upgrad/workspace/capstone/pharma-network/network/crypto-config/peerOrganizations/distributor.pharma-network.com/users/Admin@distributor.pharma-network.com/msp/signcerts/Admin@distributor.pharma-network.com-cert.pem',
'/home/upgrad/workspace/capstone/pharma-network/network/crypto-config/peerOrganizations/distributor.pharma-network.com/users/Admin@distributor.pharma-network.com/msp/keystore/451d0e3d2d930e48d94e7f85b6de9b671bc985d4d7b46a9e77b13702e7ab5a96_sk').then(() => {
  console.log('Distributor User identity added to wallet')
})

main('retailer','/home/upgrad/workspace/capstone/pharma-network/network/crypto-config/peerOrganizations/retailer.pharma-network.com/users/Admin@retailer.pharma-network.com/msp/signcerts/Admin@retailer.pharma-network.com-cert.pem',
'/home/upgrad/workspace/capstone/pharma-network/network/crypto-config/peerOrganizations/retailer.pharma-network.com/users/Admin@retailer.pharma-network.com/msp/keystore/1d0da7c91baa1aa3d6544d6e948eef7540a918fc010fc54bfa1b1439f0a691ce_sk').then(() => {
  console.log('Retailer User identity added to wallet')
})

main('consumer','/home/upgrad/workspace/capstone/pharma-network/network/crypto-config/peerOrganizations/consumer.pharma-network.com/users/Admin@consumer.pharma-network.com/msp/signcerts/Admin@consumer.pharma-network.com-cert.pem',
'/home/upgrad/workspace/capstone/pharma-network/network/crypto-config/peerOrganizations/consumer.pharma-network.com/users/Admin@consumer.pharma-network.com/msp/keystore/52e6eb1f87376745b2dc433ebf17562dc7f543de66ee7dc779707c9ac21fd661_sk').then(() => {
  console.log('Consumer User identity added to wallet')
})

main('transporter','/home/upgrad/workspace/capstone/pharma-network/network/crypto-config/peerOrganizations/transporter.pharma-network.com/users/Admin@transporter.pharma-network.com/msp/signcerts/Admin@transporter.pharma-network.com-cert.pem',
'/home/upgrad/workspace/capstone/pharma-network/network/crypto-config/peerOrganizations/transporter.pharma-network.com/users/Admin@transporter.pharma-network.com/msp/keystore/03ff60e67232478abcfafe47fc2473c89fac22d15104c15c3489b5354a7d91c8_sk').then(() => {
  console.log('Transporter User identity added to wallet')
})

module.exports.execute = main;
