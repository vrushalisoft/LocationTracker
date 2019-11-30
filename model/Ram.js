var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RamSchema = new Schema({
  type: String,
  size: String
},{collection:'Rams'})

var Ram = module.exports = mongoose.model('Ram',RamSchema,'Rams');

module.exports.getAllRams = (callback) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching rams, Try again",
    details: []
  };
  Ram.find({}, {__v:0},(err, rams)=>{
    if(err) {
      callback(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All Rams";
      retObj.details = rams;
      callback(retObj)
    }
  });
}

module.exports.upsertRam = (body, callback) => {
  var retObj = {
    status: false,
    message: "Err Adding ram, Try again",
    details: []
  };
  var query = { _id: mongoose.Types.ObjectId() };
  if (body._id) {
    query = { _id: body._id };
  }
  Ram.updateOne(query, body, {upsert: true}, (err, result)=>{
    if(err) {
      console.log("Error In Upsert Ram");
      console.log(err);
      
      
      callback(retObj)
    } else {
      if(body._id) {
        retObj.message = "Updated Successfully"
      } else {
        retObj.message = "Inserted Successfully"
      }
      retObj.status = true;
      retObj.details = result;
      callback(retObj)
    }
  });
}

module.exports.getRamById = (id, callback) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching ram by id, Try again",
    details: []
  };
  Ram.findById(id, {__v:0}, (err, ram)=>{
    if(err) {
      callback(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found Ram By Id";
      retObj.details = ram;
      callback(retObj)
    }
  });
}