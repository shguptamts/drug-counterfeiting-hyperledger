'use strict';

const fs = require('fs')
const yaml = require('js-yaml')
const {FileSystemWallet, Gateway } = require('fabric-network')
let gateway

async function getContractInstnace(org){

  gateway = new Gateway();

  const wallet = new FileSystemWallet('./identity/'+org)

  const fabricUserName = org+'_admin'

  let connectionProfile = yaml.safeLoad(fs.readFileSync('./connection-profile-'+org+'.yaml', 'utf8'))

  let connectionOptions = {
    wallet: wallet,
    identity: fabricUserName,
    discovery: {enabled: false, asLocalHost: true}
  }

  console.log('..... Connection to Fabric Gateway')
  await gateway.connect(connectionProfile, connectionOptions)

  console.log('..... Connecting to channel - PharmaChannel')
  const channel = await gateway.getNetwork('pharmachannel')

  console.log('..... Connecting to Pharmanet smart contract')
  return channel.getContract('pharmanet','org.pharma-network.pharmanet')
}

async function disconnect(){
  console.log('..... Disconnecting from Fabric Gateway')
  gateway.disconnect();
}

module.exports.getContractInstnace = getContractInstnace;
module.exports.disconnect = disconnect;
