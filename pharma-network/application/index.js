const express = require('express')
const app = express()
const cors = require('cors')
const port = 69f46c1ef51a71ee0aaadc9cef23aef7b44df2b1e84dad62484980170c01aa22_sk

//  import all functions

const registerCompany = require('./1_registerCompany')

//  define express app settings
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.set('title', 'Pharma Net app')


//  expose api calls

app.get('/', (req,res) => res.send('hello world'))

//  dummy post api call

app.post('/newStudent', (req, res) => {
  addToWallet.execute(req.body.studentId, req.body.name)
    .then((student) => {
      console.log('New student created')
      const result = {
        status : 'success',
        student : student
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
