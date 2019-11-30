var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StoragesSchema = new Schema({
  type: String,
  size: String
},{collection:'Storages'})

var Storages = module.exports = mongoose.model('Storages',StoragesSchema,'Storages');

module.exports.getAllStorages = (callback) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching storages, Try again",
    details: []
  };
  Storages.find({}, {__v:0},(err, storages)=>{
    if(err) {
      callback(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All Storages";
      retObj.details = storages;
      callback(retObj)
    }
  });
}

module.exports.upsertStorages = (body, callback) => {
  var retObj = {
    status: false,
    message: "Err Adding storages, Try again",
    details: []
  };
  var query = { _id: mongoose.Types.ObjectId() };
  if (body._id) {
    query = { _id: body._id };
  }
  Storages.updateOne(query, body, {upsert: true}, (err, result)=>{
    if(err) {
      console.log("Error In Upsert Storages");
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

module.exports.getStoragesById = (id, callback) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching storages by id, Try again",
    details: []
  };
  Storages.findById(id, {__v:0}, (err, storages)=>{
    if(err) {
      callback(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found Storages By Id";
      retObj.details = storages;
      callback(retObj)
    }
  });
}