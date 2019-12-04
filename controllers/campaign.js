var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config')

var CampaignSchema = new Schema({
  name: String,
  total_assets: Number, 
  total_devices : Number,
  start_day: Number,
  start_month: Number,
  start_year: Number,
  end_day: Number,
  end_month: Number,
  end_year: Number,
  subscription: String,
  day: Number,
  month: Number,
  year: Number,
  active: Boolean,
 
  
},{collection:config.tables.CAMPAIGN})

var Campaign = module.exports = mongoose.model('Campaign',CampaignSchema,config.tables.CAMPAIGN);

module.exports.index = (req, res) => {
  res.render('campaign', {
    title: "Campaign"
  })
}

module.exports.getAllCampaigns = (req, res) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching campaigns, Try again",
    details: []
  };
  Campaign.find({}, {__v:0},(err, campaigns)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All Campaigns";
      retObj.details = campaigns;
      res.json(retObj)
    }
  });
}

module.exports.getCampaignById = (req, res) => {
  var campaignId = req.params['_id'] 
  var retObj = {
    status: false,
    message: "Err Querying database while fetching campaign by id, Try again",
    details: []
  };
  Processor.findById(campaignId, {__v:0}, (err, campaign)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found Campaign By Id";
      retObj.details = campaign;
      res.json(retObj)
    }
  });
}

module.exports.upsertCampaign = (req, res) => {
  console.log('Error O')
  var campaign = req.body
  console.log(campaign);
  var retObj = {
    status: false,
    message: "Err Adding campaign, Try again",
    details: []
  };
  var query = { _id: mongoose.Types.ObjectId() };
  if (campaign._id) {
    query = { _id: campaign._id };
  }
  Campaign.updateOne(query, campaign, {upsert: true}, (err, result)=>{
    if(err) {
      console.log("Error In Upsert Campaign");
      console.log(err);
      res.json(retObj)
    } else {
      if(campaign._id) {
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
