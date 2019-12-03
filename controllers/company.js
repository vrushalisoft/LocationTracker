var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config')

var CompanySchema = new Schema({
  company_name: String,
  street: String, 
  city : String ,
  state: String,
  zip: Number,
  day: Number,
  month: Number,
  year: Number,
  active: Boolean,
 
  
},{collection:config.tables.COMPANY})

var Company = module.exports = mongoose.model('Company',CompanySchema,config.tables.COMPANY);

module.exports.index = (req, res) => {
  res.render('company', {
    title: "Company"
  })
}

module.exports.getAllCompanys = (req, res) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching companys, Try again",
    details: []
  };
  Company.find({}, {__v:0},(err, companys)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All Companys";
      retObj.details = companys;
      res.json(retObj)
    }
  });
}

module.exports.getCompanyById = (req, res) => {
  var companyId = req.params['_id'] 
  var retObj = {
    status: false,
    message: "Err Querying database while fetching company by id, Try again",
    details: []
  };
  Processor.findById(companyId, {__v:0}, (err, company)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found Company By Id";
      retObj.details = company;
      res.json(retObj)
    }
  });
}

module.exports.upsertCompany = (req, res) => {
  console.log('Error O')
  var company = req.body
  console.log(company);
  var retObj = {
    status: false,
    message: "Err Adding company, Try again",
    details: []
  };
  var query = { _id: mongoose.Types.ObjectId() };
  if (company._id) {
    query = { _id: company._id };
  }
  Company.updateOne(query, company, {upsert: true}, (err, result)=>{
    if(err) {
      console.log("Error In Upsert Company");
      console.log(err);
      res.json(retObj)
    } else {
      if(company._id) {
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
