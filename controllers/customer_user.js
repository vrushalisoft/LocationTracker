var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config')

var CustomerUserSchema = new Schema({
  first_name: String,
  last_name: String,
  contact_no: String,
  street: String, 
  city : String ,
  state: String,
  zip: Number,
  role: String,
  day: Number,
  month: Number,
  year: Number,
  active: Boolean,
  email: String,
  password: String 
  
},{collection:config.tables.CUSTOMER_USER})

var CustomerUser = module.exports = mongoose.model('CustomerUser',CustomerUserSchema,config.tables.CUSTOMER_USER);

module.exports.index = (req, res) => {
  res.render('customer_user', {
    title: "CustomerUser"
  })
}

module.exports.getAllCustomerUsers = (req, res) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching customer_users, Try again",
    details: []
  };
  CustomerUser.find({}, {__v:0},(err, customer_users)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All CustomerUsers";
      retObj.details = customer_users;
      res.json(retObj)
    }
  });
}

module.exports.getCustomerUserById = (req, res) => {
  var customer_userId = req.params['_id'] 
  var retObj = {
    status: false,
    message: "Err Querying database while fetching customer_user by id, Try again",
    details: []
  };
  Processor.findById(customer_userId, {__v:0}, (err, customer_user)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found CustomerUser By Id";
      retObj.details = customer_user;
      res.json(retObj)
    }
  });
}

module.exports.upsertCustomerUser = (req, res) => {
  console.log('Error O')
  var customer_user = req.body
  console.log(customer_user);
  var retObj = {
    status: false,
    message: "Err Adding customer_user, Try again",
    details: []
  };
  var query = { _id: mongoose.Types.ObjectId() };
  if (customer_user._id) {
    query = { _id: customer_user._id };
  }
  CustomerUser.updateOne(query, customer_user, {upsert: true}, (err, result)=>{
    if(err) {
      console.log("Error In Upsert CustomerUser");
      console.log(err);
      res.json(retObj)
    } else {
      if(customer_user._id) {
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
