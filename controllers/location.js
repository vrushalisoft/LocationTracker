var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config')

var LocationSchema = new Schema({
  type: String,
  name: String,
  street: String, 
  city : String ,
  state: String,
  zip: Number,
  geofence: Boolean,
  final_dest: Boolean,
  day: Number,
  month: Number,
  year: Number,
  active: Boolean,
 
  
},{collection:config.tables.LOCATION})

var Location = module.exports = mongoose.model('Location',LocationSchema,config.tables.LOCATION);

module.exports.index = (req, res) => {
  res.render('location', {
    title: "Location"
  })
}

module.exports.getAllLocations = (req, res) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching locations, Try again",
    details: []
  };
  Location.find({}, {__v:0},(err, locations)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All Locations";
      retObj.details = locations;
      res.json(retObj)
    }
  });
}

module.exports.getLocationById = (req, res) => {
  var locationId = req.params['_id'] 
  var retObj = {
    status: false,
    message: "Err Querying database while fetching location by id, Try again",
    details: []
  };
  Processor.findById(locationId, {__v:0}, (err, location)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found Location By Id";
      retObj.details = location;
      res.json(retObj)
    }
  });
}

module.exports.upsertLocation = (req, res) => {
  console.log('Error O')
  var location = req.body
  console.log(location);
  var retObj = {
    status: false,
    message: "Err Adding location, Try again",
    details: []
  };
  var query = { _id: mongoose.Types.ObjectId() };
  if (location._id) {
    query = { _id: location._id };
  }
  Location.updateOne(query, location, {upsert: true}, (err, result)=>{
    if(err) {
      console.log("Error In Upsert Location");
      console.log(err);
      res.json(retObj)
    } else {
      if(location._id) {
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
