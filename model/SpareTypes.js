var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SpareTypesSchema = new Schema({
  name: String
},{collection:'SpareTypes'})

var SpareTypes = module.exports = mongoose.model('SpareTypes',SpareTypesSchema,'SpareTypes');

module.exports.getAllSpareTypes = (callback) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching SpareTypes, Try again",
    details: []
  };
  SpareTypes.find({}, {__v:0},(err, sparetypes)=>{
    if(err) {
      callback(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All SpareTypes";
      retObj.details = sparetypes;
      callback(retObj)
    }
  });
}

module.exports.upsertSpareTypes = (body, callback) => {
  var retObj = {
    status: false,
    message: "Err Adding SpareTypes, Try again",
    details: []
  };
  var query = { _id: mongoose.Types.ObjectId() };
  if (body._id) {
    query = { _id: body._id };
  }
  SpareTypes.updateOne(query, body, {upsert: true}, (err, result)=>{
    if(err) {
      console.log("Error In Upsert SpareTypes");
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

module.exports.getSpareTypesById = (id, callback) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching processor by id, Try again",
    details: []
  };
  SpareTypes.findById(id, {__v:0}, (err, sparetypes)=>{
    if(err) {
      callback(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found SpareTypes By Id";
      retObj.details = sparetypes;
      callback(retObj)
    }
  });
}