var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config')

var AssetDetailsSchema = new Schema({
  total_assets: Number,
  name: String, 
  image : String,
  height: Number,
  width: Number,
  mfg_day: Number,
  mfg_month: Number,
  mfg_year: Number,
  est_shipping_day: Number,
  est_shipping_month: Number,
  est_shipping_year:Number,
  channel: String,
  program: String,
  merchandise_type: String,
  promotion: String,
  day: Number,
  month: Number,
  year: Number,
  active: Boolean,
 
  
},{collection:config.tables.ASSET_DETAILS})

var AssetDetails = module.exports = mongoose.model('AssetDetails',AssetDetailsSchema,config.tables.ASSET_DETAILS);

module.exports.index = (req, res) => {
  res.render('asset_details', {
    title: "AssetDetails"
  })
}

module.exports.getAllAssetDetailss = (req, res) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching asset_detailss, Try again",
    details: []
  };
  AssetDetails.find({}, {__v:0},(err, asset_detailss)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All AssetDetailss";
      retObj.details = asset_detailss;
      res.json(retObj)
    }
  });
}

module.exports.getAssetDetailsById = (req, res) => {
  var asset_detailsId = req.params['_id'] 
  var retObj = {
    status: false,
    message: "Err Querying database while fetching asset_details by id, Try again",
    details: []
  };
  AssetDetails.findById(asset_detailsId, {__v:0}, (err, asset_details)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found AssetDetails By Id";
      retObj.details = asset_details;
      res.json(retObj)
    }
  });
}

module.exports.upsertAssetDetails = (req, res) => {
  console.log('Error O')
  var asset_details = req.body
  console.log(asset_details);
  var retObj = {
    status: false,
    message: "Err Adding asset_details, Try again",
    details: []
  };
  var query = { _id: mongoose.Types.ObjectId() };
  if (asset_details._id) {
    query = { _id: asset_details._id };
  }
  AssetDetails.updateOne(query, asset_details, {upsert: true}, (err, result)=>{
    if(err) {
      console.log("Error In Upsert AssetDetails");
      console.log(err);
      res.json(retObj)
    } else {
      if(asset_details._id) {
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
