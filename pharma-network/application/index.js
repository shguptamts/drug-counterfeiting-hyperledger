const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000

//  import all functions

const addToWallet = require('./1_addToWallet.js')
const registerCompany = require('./2_registerCompany.js')
const addDrug = require('./3_addDrug.js')
const createPO = require('./4_createPO.js')

const createShipment = require('./5_createShipment.js')
const updateShipment = require('./6_updateShipment.js')
const retailDrug = require('./7_retailDrug.js')
const viewHistory = require('./8_viewHistory.js')
const viewDrugCurrentState = require('./9_viewDrugCurrentState.js')

const test = require('./test.js')


//  define express app settings
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.set('title', 'Pharma Net app')


//  expose api calls

app.get('/', (req,res) => res.send('hello world'))

app.get('/test', (req, res) => {
  test.execute()
    .then((files) => {
      console.log('files are : ')
      const result = {
        status : 'success',
        files : files
      };
      res.json(result)
    })
    .catch((e) =>{
      const result = {
        status : 'error',
        error : e
      };
      res.status(500).send(result)
    })
});

//  dummy post api call

app.get('/addToWallet', (req, res) => {
  addToWallet.execute()
    .then(() => {
      console.log('add to Wallet ran successfully')
      const result = {
        status : 'success',
      };
      res.json(result)
    })
    .catch((e) =>{
      const result = {
        status : 'error',
        error : e
      };
      res.status(500).send(result)
    })
});

app.post('/registerCompany', (req, res) => {
  registerCompany.execute( req.body.companyCRN, req.body.companyName, req.body.location, req.body.organisationRole)
    .then((company) => {
      console.log('Company registered')
      const result = {
        status : 'success',
        company : company
      };
      res.json(result)
    })
    .catch((e) =>{
      const result = {
        status : 'error',
        error : e
      };
      res.status(500).send(result)
    })
});

app.post('/addDrug', (req, res) => {
  addDrug.execute(req.body.drugName, req.body.serialNo, req.body.mfgDate, req.body.expDate, req.body.companyCRN)
    .then((drug) => {
      console.log('Drug registered')
      const result = {
        status : 'success',
        drug : drug
      };
      res.json(result)
    })
    .catch((e) =>{
      const result = {
        status : 'error',
        error : e
      };
      res.status(500).send(result)
    })
});

app.post('/createPO', (req, res) => {
  createPO.execute(req.body.org,req.body.buyerCRN, req.body.sellerCRN, req.body.drugName, req.body.quantity)
    .then((po) => {
      console.log('PO registered')
      const result = {
        status : 'success',
        po : po
      };
      res.json(result)
    })
    .catch((e) =>{
      const result = {
        status : 'error',
        error : e
      };
      res.status(500).send(result)
    })
});

app.post('/createShipment', (req, res) => {
  createShipment.execute(req.body.org,req.body.buyerCRN, req.body.drugName, req.body.listOfAssets, req.body.transporterCRN )
    .then((shipment) => {
      console.log('Shipment registered')
      const result = {
        status : 'success',
        shipment : shipment
      };
      res.json(result)
    })
    .catch((e) =>{
      const result = {
        status : 'error',
        error : e
      };
      res.status(500).send(result)
    })
});


app.post('/updateShipment', (req, res) => {
  updateShipment.execute(req.body.org,req.body.buyerCRN, req.body.drugName,  req.body.transporterCRN )
    .then((shipment) => {
      console.log('Shipment updated')
      const result = {
        status : 'success',
        shipment : shipment
      };
      res.json(result)
    })
    .catch((e) =>{
      const result = {
        status : 'error',
        error : e
      };
      res.status(500).send(result)
    })
});


app.post('/retailDrug', (req, res) => {
  retailDrug.execute(req.body.org, req.body.drugName, req.body.serialNo, req.body.retailerCRN, req.body.customerAadhar )
    .then((drug) => {
      console.log('Drug sold')
      const result = {
        status : 'success',
        drug : drug
      };
      res.json(result)
    })
    .catch((e) =>{
      const result = {
        status : 'error',
        error : e
      };
      res.status(500).send(result)
    })
});

app.get('/viewHistory', (req, res) => {
  viewHistory.execute(req.body.org, req.body.drugName, req.body.serialNo )
    .then((drug) => {
      console.log('Drug History viewed')
      const result = {
        status : 'success',
        drugHistory : drug
      };
      res.json(result)
    })
    .catch((e) =>{
      const result = {
        status : 'error',
        error : e
      };
      res.status(500).send(result)
    })
});

app.get('/viewDrugCurrentState', (req, res) => {
  viewDrugCurrentState.execute(req.body.org, req.body.drugName, req.body.serialNo )
    .then((drug) => {
      console.log('Drug current state viewed')
      const result = {
        status : 'success',
        drugCurrentState : drug
      };
      res.json(result)
    })
    .catch((e) =>{
      const result = {
        status : 'error',
        error : e
      };
      res.status(500).send(result)
    })
});

app.listen(port, () => console.log(`Distributed Pharma App listening on port ${port}!`))
