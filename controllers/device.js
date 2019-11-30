var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config')

var DeviceSchema = new Schema({
  imei_no:  String,
  sim_no:  String, 
  active:  Boolean,
  alocated: Boolean,
  asigned: Boolean,
  day: Number, 
  month: Number, 
  year: Number
},{collection:config.tables.DEVICE})

var Device = module.exports = mongoose.model('Device',DeviceSchema,config.tables.DEVICE);

module.exports.index = (req, res) => {
  res.render('device', {
    title: "Device"
  })
}

module.exports.getAllDevices = (req, res) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching devices, Try again",
    details: []
  };
  Device.find({}, {__v:0},(err, devices)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All Devices";
      retObj.details = devices;
      res.json(retObj)
    }
  });
}

module.exports.getDeviceById = (req, res) => {
  var deviceId = req.params['_id'] 
  var retObj = {
    status: false,
    message: "Err Querying database while fetching device by id, Try again",
    details: []
  };
  Processor.findById(deviceId, {__v:0}, (err, device)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found Device By Id";
      retObj.details = device;
      res.json(retObj)
    }
  });
}

module.exports.upsertDevice = (req, res) => {
  console.log('Error O')
  var device = req.body
  console.log(device);
  var retObj = {
    status: false,
    message: "Err Adding device, Try again",
    details: []
  };
  var query = { _id: mongoose.Types.ObjectId() };
  if (device._id) {
    query = { _id: device._id };
  }
  Device.updateOne(query, device, {upsert: true}, (err, result)=>{
    if(err) {
      console.log("Error In Upsert Device");
      console.log(err);
      res.json(retObj)
    } else {
      if(device._id) {
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
