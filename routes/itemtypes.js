var express = require('express');
var router = express.Router();

var ItemTypes = require('../model/ItemTypes')

router
.get('/', (req, res, next)=> {
  ItemTypes.getAllItemTypes((response)=> {
    res.json(response)
  })
})
.get('/:_id', (req, res, next)=> {
  var id = req.params['_id']
  ItemTypes.getItemTypesById(id, (response)=> {
    res.json(response)
  })
})
.post('/', (req, res, next) => {
  var body = req.body;
  ItemTypes.upsertItemTypes(body, (response)=> {
    res.json(response)
  })

})

module.exports = router;