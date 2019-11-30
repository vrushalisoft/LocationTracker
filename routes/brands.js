var express = require('express');
var router = express.Router();

var Brands = require('../model/Brands')

router
.get('/', (req, res, next)=> {
  Brands.getAllBrands((response)=> {
    res.json(response)
  })
})
.get('/:_id', (req, res, next)=> {
  var id = req.params['_id']
  Brands.getBrandsById(id, (response)=> {
    res.json(response)
  })
})
.post('/', (req, res, next) => {
  var body = req.body;
  Brands.upsertBrands(body, (response)=> {
    res.json(response)
  })

})

module.exports = router;