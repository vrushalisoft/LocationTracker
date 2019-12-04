var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config')

var RepsSchema = new Schema({
  name: String,
  email: String, 
  phone_no : Number ,
  day: Number,
  month: Number,
  year: Number,
  
},{collection:config.tables.REPS})

var Reps = module.exports = mongoose.model('Reps',RepsSchema,config.tables.REPS);

module.exports.index = (req, res) => {
  res.render('reps', {
    title: "Reps"
  })
}

module.exports.getAllRepss = (req, res) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching representative, Try again",
    details: []
  };
  Reps.find({}, {__v:0},(err, repss)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All Repss";
      retObj.details = repss;
      res.json(retObj)
    }
  });
}

module.exports.getRepsById = (req, res) => {
  var repsId = req.params['_id'] 
  var retObj = {
    status: false,
    message: "Err Querying database while fetching representative by id, Try again",
    details: []
  };
  Processor.findById(repsId, {__v:0}, (err, reps)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found Reps By Id";
      retObj.details = reps;
      res.json(retObj)
    }
  });
}

module.exports.upsertReps = (req, res) => {
  console.log('Error O')
  var reps = req.body
  console.log(reps);
  var retObj = {
    status: false,
    message: "Err Adding representative, Try again",
    details: []
  };
  var query = { _id: mongoose.Types.ObjectId() };
  if (reps._id) {
    query = { _id: reps._id };
  }
  Reps.updateOne(query, reps, {upsert: true}, (err, result)=>{
    if(err) {
      console.log("Error In Upsert Representative");
      console.log(err);
      res.json(retObj)
    } else {
      if(reps._id) {
        retObj.message = "Updated Successfully"
      } else {
        retObj.message = "Inserted Successfully"
      }
      retObj.status = true;
      retObj.details = result;
      res.json(retObj)
    }
  });
}
