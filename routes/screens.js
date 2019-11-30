var express = require('express');
var router = express.Router();

var Screens = require('../model/Screens')

router
.get('/', (req, res, next)=> {
  Screens.getAllScreens((response)=> {
    res.json(response)
  })
})
.get('/:_id', (req, res, next)=> {
  var id = req.params['_id']
  Screens.getScreensById(id, (response)=> {
    res.json(response)
  })
})
.post('/', (req, res, next) => {
  var body = req.body;
  Screens.upsertScreens(body, (response)=> {
    res.json(response)
  })

})

module.exports = router;