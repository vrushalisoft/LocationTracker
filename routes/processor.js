var express = require('express');
var router = express.Router();

var Processor = require('../model/Processor')

router
.get('/', (req, res, next)=> {
  Processor.getAllProcessors((response)=> {
    res.json(response)
  })
})
.get('/:_id', (req, res, next)=> {
  var id = req.params['_id']
  Processor.getProcessById(id, (response)=> {
    res.json(response)
  })
})
.post('/', (req, res, next) => {
  var body = req.body;
  console.log(body)
  Processor.upsertProcessor(body, (response)=> {
    res.json(response)
  })

})

module.exports = router;