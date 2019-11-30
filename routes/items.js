var express = require('express');
var router = express.Router();

var Items = require('../model/Items')

router
.get('/', (req, res, next)=> {
  Items.getAllItems((response)=> {
    res.json(response)
  })
})
.get('/:_id', (req, res, next)=> {
  var id = req.params['_id']
  Items.getItemsById(id, (response)=> {
    res.json(response)
  })
})
.post('/', (req, res, next) => {
  var body = req.body;
  Items.upsertItems(body, (response)=> {
    res.json(response)
  })

})

module.exports = router;