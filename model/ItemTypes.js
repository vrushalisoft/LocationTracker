var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemTypesSchema = new Schema({
  name: String
},{collection:'ItemTypes'})

var ItemTypes = module.exports = mongoose.model('ItemTypes',ItemTypesSchema,'ItemTypes');

module.exports.getAllItemTypes = (callback) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching itemtypes, Try again",
    details: []
  };
  ItemTypes.find({}, {__v:0},(err, itemtypes)=>{
    if(err) {
      callback(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All ItemTypes";
      retObj.details = itemtypes;
      callback(retObj)
    }
  });
}

module.exports.upsertItemTypes = (body, callback) => {
  var retObj = {
    status: false,
    message: "Err Adding itemtypes, Try again",
    details: []
  };
  var query = { _id: mongoose.Types.ObjectId() };
  if (body._id) {
    query = { _id: body._id };
  }
  ItemTypes.updateOne(query, body, {upsert: true}, (err, result)=>{
    if(err) {
      console.log("Error In Upsert ItemTypes");
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

module.exports.getItemTypesById = (id, callback) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching itemtypes by id, Try again",
    details: []
  };
  ItemTypes.findById(id, {__v:0}, (err, itemtypes)=>{
    if(err) {
      callback(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found ItemTypes By Id";
      retObj.details = itemtypes;
      callback(retObj)
    }
  });
}