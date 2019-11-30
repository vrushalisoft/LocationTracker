var express = require('express');
var router = express.Router();

var Storages = require('../model/Storages')

router
.get('/', (req, res, next)=> {
  Storages.getAllStorages((response)=> {
    res.json(response)
  })
})
.get('/:_id', (req, res, next)=> {
  var id = req.params['_id']
  Storages.getStoragesById(id, (response)=> {
    res.json(response)
  })
})
.post('/', (req, res, next) => {
  var body = req.body;
  Storages.upsertStorages(body, (response)=> {
    res.json(response)
  })

})

module.exports = router;