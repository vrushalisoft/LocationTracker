var express = require('express');
var router = express.Router();

var Vendors = require('../model/Vendors')

router
.get('/', (req, res, next)=> {
  Vendors.getAllVendors((response)=> {
    res.json(response)
  })
})
.get('/:_id', (req, res, next)=> {
  var id = req.params['_id']
  Vendors.getVendorsById(id, (response)=> {
    res.json(response)
  })
})
.post('/', (req, res, next) => {
  var body = req.body;
  Vendors.upsertVendors(body, (response)=> {
    res.json(response)
  })

})

module.exports = router;