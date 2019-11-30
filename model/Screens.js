var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScreensSchema = new Schema({
  size: String,
  resolution: String
},{collection:'Screens'})

var Screens = module.exports = mongoose.model('Screens',ScreensSchema,'Screens');

module.exports.getAllScreens = (callback) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching screens, Try again",
    details: []
  };
  Screens.find({}, {__v:0},(err, screens)=>{
    if(err) {
      callback(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All Screens";
      retObj.details = screens;
      callback(retObj)
    }
  });
}

module.exports.upsertScreens = (body, callback) => {
  var retObj = {
    status: false,
    message: "Err Adding screens, Try again",
    details: []
  };
  var query = { _id: mongoose.Types.ObjectId() };
  if (body._id) {
    query = { _id: body._id };
  }
  Screens.updateOne(query, body, {upsert: true}, (err, result)=>{
    if(err) {
      console.log("Error In Upsert Screens");
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

module.exports.getScreensById = (id, callback) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching screens by id, Try again",
    details: []
  };
  Screens.findById(id, {__v:0}, (err, screens)=>{
    if(err) {
      callback(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found Screens By Id";
      retObj.details = screens;
      callback(retObj)
    }
  });
}