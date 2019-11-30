var express = require('express');
var router = express.Router();

var SpareTypes = require('../model/SpareTypes')

router
.get('/', (req, res, next)=> {
  SpareTypes.getAllSpareTypes((response)=> {
    res.json(response)
  })
})
.get('/:_id', (req, res, next)=> {
  var id = req.params['_id']
  SpareTypes.getSpareTypesById(id, (response)=> {
    res.json(response)
  })
})
.post('/', (req, res, next) => {
  var body = req.body;
  SpareTypes.upsertSpareTypes(body, (response)=> {
    res.json(response)
  })

})

module.exports = router;