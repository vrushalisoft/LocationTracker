var express = require('express');
var router = express.Router();

var ItemTypes = require('../model/ItemTypes')

router
.get('/', (req, res, next)=> {
  res.render('master', {title: 'Master'})
})

module.exports = router;