var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config')

var ProcessorSchema = new Schema({
  name: {type: String, required: [true, 'Name is required']},
  speed: {type: String, required: [true, 'Speed is required']}
},{collection:config.tables.PROCESSOR})

var Processor = module.exports = mongoose.model('Processor',ProcessorSchema,config.tables.PROCESSOR);

module.exports.getAllProcessors = (callback) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching processors, Try again",
    details: []
  };
  Processor.find({}, {__v:0},(err, processors)=>{
    if(err) {
      callback(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All Processors";
      retObj.details = processors;
      callback(retObj)
    }
  });
}

module.exports.upsertProcessor = (body, callback) => {
  var retObj = {
    status: false,
    message: "Err Adding processor, Try again",
    details: []
  };
  var query = { _id: mongoose.Types.ObjectId() };
  if (body._id) {
    query = { _id: body._id };
  }
  Processor.updateOne(query, body, {upsert: true}, (err, result)=>{
    if(err) {
      console.log("Error In Upsert Processor");
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

module.exports.getProcessById = (id, callback) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching processor by id, Try again",
    details: []
  };
  Processor.findById(id, {__v:0}, (err, processor)=>{
    if(err) {
      callback(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found Processor By Id";
      retObj.details = processor;
      callback(retObj)
    }
  });
}