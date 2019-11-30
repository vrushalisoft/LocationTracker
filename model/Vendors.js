var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VendorsSchema = new Schema({
  name: String
},{collection:'Vendors'})

var Vendors = module.exports = mongoose.model('Vendors',VendorsSchema,'Vendors');

module.exports.getAllVendors = (callback) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching vendors, Try again",
    details: []
  };
  Vendors.find({}, {__v:0},(err, vendors)=>{
    if(err) {
      callback(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All Vendors";
      retObj.details = vendors;
      callback(retObj)
    }
  });
}

module.exports.upsertVendors = (body, callback) => {
  var retObj = {
    status: false,
    message: "Err Adding vendors, Try again",
    details: []
  };
  var query = { _id: mongoose.Types.ObjectId() };
  if (body._id) {
    query = { _id: body._id };
  }
  Vendors.updateOne(query, body, {upsert: true}, (err, result)=>{
    if(err) {
      console.log("Error In Upsert Vendors");
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

module.exports.getVendorsById = (id, callback) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching vendors by id, Try again",
    details: []
  };
  Vendors.findById(id, {__v:0}, (err, vendors)=>{
    if(err) {
      callback(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found Vendors By Id";
      retObj.details = vendors;
      callback(retObj)
    }
  });
}