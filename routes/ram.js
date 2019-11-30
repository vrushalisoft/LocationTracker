var express = require('express');
var router = express.Router();

var Ram = require('../model/Ram')

router
.get('/', (req, res, next)=> {
  Ram.getAllRams((response)=> {
    res.json(response)
  })
})
.get('/:_id', (req, res, next)=> {
  var id = req.params['_id']
  Ram.getRamById(id, (response)=> {
    res.json(response)
  })
})
.post('/', (req, res, next) => {
  var body = req.body;
  Ram.upsertRam(body, (response)=> {
    res.json(response)
  })

})

module.exports = router;