var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemsSchema = new Schema({
  LID : String, // 1234
  itemTypeId: String, 
  modelId: String, // Dell Model
  processorId: String,
  ramId: String,
  hddStorageId: String,
  ssdStorageId: String,
  screenId: String,
  condition: String, // Some Condition
  isSpareChanged: Boolean, // true
  spareTypeId: String, 
  vendorId: String,
  isService: Boolean, // false
  isTested: Boolean,// false
  isProblemFound: Boolean, // true
  problem: String, // any spare id
  isRtd: Boolean, // false
  isWebsiteUploaded: Boolean, // false
  name: String, // dell inspiron
  isSold: Boolean, // false
  invNo: String, // Blank
  addedDate : {
		day: Number,
		month: Number,
		year: Number,
		hour: Number,
		min: Number,
		timestamp: Number
   },
    testedDate : {		
        day: Number,
        month: Number,
        year: Number,
        hour: Number,
        min: Number,
        timestamp: Number
    },
    rtdDate: {
        day: Number,
        month: Number,
        year: Number,
        hour: Number,
        min: Number,
        timestamp: Number
    },
    soldDate: {		
        day: Number,
        month: Number,
        year: Number,
        hour: Number,
        min: Number,
        timestamp: Number
    }
},{collection:'Items'})

var Items = module.exports = mongoose.model('Items',ItemsSchema,'Items');

module.exports.getAllItems = (callback) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching items, Try again",
    details: []
  };
  Items.find({}, {__v:0},(err, items)=>{
    if(err) {
      callback(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All Items";
      retObj.details = items;
      callback(retObj)
    }
  });
}

module.exports.upsertItems = (body, callback) => {
  var retObj = {
    status: false,
    message: "Err Adding items, Try again",
    details: []
  };
  var query = { _id: mongoose.Types.ObjectId() };
  if (body._id) {
    query = { _id: body._id };
  }
  Items.updateOne(query, body, {upsert: true}, (err, result)=>{
    if(err) {
      console.log("Error In Upsert Items");
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

module.exports.getItemsById = (id, callback) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching items by id, Try again",
    details: []
  };
  Items.findById(id, {__v:0}, (err, items)=>{
    if(err) {
      callback(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found Items By Id";
      retObj.details = items;
      callback(retObj)
    }
  });
}