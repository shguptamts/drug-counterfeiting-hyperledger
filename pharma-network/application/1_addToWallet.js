'use strict';

const fs = require('fs')
const {FileSystemWallet, X509WalletMixin } = require('fabric-network')
const path = require('path')

var identityLabel ='manufacturer_admin';
var msp = 'manufacturerMSP';
var orgs = ['manufacturer','distributor','retailer', 'consumer', 'transporter']

const crypto_materials = path.resolve(__dirname, '../network/crypto-config')

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



// Function to get current filenames
// in directory with specific extension




main('manufacturer','/home/upgrad/workspace/capstone/pharma-network/network/crypto-config/peerOrganizations/manufacturer.pharma-network.com/users/Admin@manufacturer.pharma-network.com/msp/signcerts/Admin@manufacturer.pharma-network.com-cert.pem',
'/home/upgrad/workspace/capstone/pharma-network/network/crypto-config/peerOrganizations/manufacturer.pharma-network.com/users/Admin@manufacturer.pharma-network.com/msp/keystore/416a9980bf110e6209a847315d7a6a322fb3bcc9415037849be7f152d842f863_sk').then(() => {
  console.log('Manufacturer User identity added to wallet')
})

main('distributor','/home/upgrad/workspace/capstone/pharma-network/network/crypto-config/peerOrganizations/distributor.pharma-network.com/users/Admin@distributor.pharma-network.com/msp/signcerts/Admin@distributor.pharma-network.com-cert.pem',
'/home/upgrad/workspace/capstone/pharma-network/network/crypto-config/peerOrganizations/distributor.pharma-network.com/users/Admin@distributor.pharma-network.com/msp/keystore/5dba15972f8f10ae5a115fa71e6fb3ef5a23ad63b3e0e2c5c9a4de606108e12f_sk').then(() => {
  console.log('Distributor User identity added to wallet')
})

main('retailer','/home/upgrad/workspace/capstone/pharma-network/network/crypto-config/peerOrganizations/retailer.pharma-network.com/users/Admin@retailer.pharma-network.com/msp/signcerts/Admin@retailer.pharma-network.com-cert.pem',
'/home/upgrad/workspace/capstone/pharma-network/network/crypto-config/peerOrganizations/retailer.pharma-network.com/users/Admin@retailer.pharma-network.com/msp/keystore/77572aac35c0c69e214385d9cec3adecc110b22a8e7dc1f538013e9206c7a412_sk').then(() => {
  console.log('Retailer User identity added to wallet')
})

main('consumer','/home/upgrad/workspace/capstone/pharma-network/network/crypto-config/peerOrganizations/consumer.pharma-network.com/users/Admin@consumer.pharma-network.com/msp/signcerts/Admin@consumer.pharma-network.com-cert.pem',
'/home/upgrad/workspace/capstone/pharma-network/network/crypto-config/peerOrganizations/consumer.pharma-network.com/users/Admin@consumer.pharma-network.com/msp/keystore/b2cad718036c17385b972996ea8be37200eef6d0fa9c5502b6cbee4f2eb69365_sk').then(() => {
  console.log('Consumer User identity added to wallet')
})

main('transporter','/home/upgrad/workspace/capstone/pharma-network/network/crypto-config/peerOrganizations/transporter.pharma-network.com/users/Admin@transporter.pharma-network.com/msp/signcerts/Admin@transporter.pharma-network.com-cert.pem',
'/home/upgrad/workspace/capstone/pharma-network/network/crypto-config/peerOrganizations/transporter.pharma-network.com/users/Admin@transporter.pharma-network.com/msp/keystore/78a15d6293028875912aa6f644065930b7279026562e245776717185cdfc936e_sk').then(() => {
  console.log('Transporter User identity added to wallet')
})

module.exports.execute = main;
