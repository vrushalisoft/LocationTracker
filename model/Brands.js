var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BrandsSchema = new Schema({
  name: String
},{collection:'Brands'})

var Brands = module.exports = mongoose.model('Brands',BrandsSchema,'Brands');

module.exports.getAllBrands = (callback) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching brands, Try again",
    details: []
  };
  Brands.find({}, {__v:0},(err, brands)=>{
    if(err) {
      callback(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All Brands";
      retObj.details = brands;
      callback(retObj)
    }
  });
}

module.exports.upsertBrands = (body, callback) => {
  var retObj = {
    status: false,
    message: "Err Adding brands, Try again",
    details: []
  };
  var query = { _id: mongoose.Types.ObjectId() };
  if (body._id) {
    query = { _id: body._id };
  }
  Brands.updateOne(query, body, {upsert: true}, (err, result)=>{
    if(err) {
      console.log("Error In Upsert Brands");
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

module.exports.getBrandsById = (id, callback) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching brands by id, Try again",
    details: []
  };
  Brands.findById(id, {__v:0}, (err, brands)=>{
    if(err) {
      callback(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found Brands By Id";
      retObj.details = brands;
      callback(retObj)
    }
  });
}