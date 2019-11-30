var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ModelNosSchema = new Schema({
  brandId: String,
  name: String
},{collection:'ModelNos'})

var ModelNos = module.exports = mongoose.model('ModelNos',ModelNosSchema,'ModelNos');

module.exports.getAllModelNos = (callback) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching modelnos, Try again",
    details: []
  };
  ModelNos.find({}, {__v:0},(err, modelnos)=>{
    if(err) {
      callback(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All ModelNos";
      retObj.details = modelnos;
      callback(retObj)
    }
  });
}

module.exports.upsertModelNos = (body, callback) => {
  var retObj = {
    status: false,
    message: "Err Adding modelnos, Try again",
    details: []
  };
  var query = { _id: mongoose.Types.ObjectId() };
  if (body._id) {
    query = { _id: body._id };
  }
  ModelNos.updateOne(query, body, {upsert: true}, (err, result)=>{
    if(err) {
      console.log("Error In Upsert ModelNos");
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

module.exports.getModelNosById = (id, callback) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching modelnos by id, Try again",
    details: []
  };
  ModelNos.findById(id, {__v:0}, (err, modelnos)=>{
    if(err) {
      callback(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found ModelNos By Id";
      retObj.details = modelnos;
      callback(retObj)
    }
  });
}