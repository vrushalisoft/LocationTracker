var express = require('express');
var router = express.Router();

var ModelNos = require('../model/ModelNos')

router
.get('/', (req, res, next)=> {
  ModelNos.getAllModelNos((response)=> {
    res.json(response)
  })
})
.get('/:_id', (req, res, next)=> {
  var id = req.params['_id']
  ModelNos.getModelNosById(id, (response)=> {
    res.json(response)
  })
})
.post('/', (req, res, next) => {
  var body = req.body;
  ModelNos.upsertModelNos(body, (response)=> {
    res.json(response)
  })

})

module.exports = router;