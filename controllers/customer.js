var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config')

var CustomerSchema = new Schema({
  customer_name: String,
  street: String, 
  city : String ,
  state: String,
  zip: Number,
  day: Number,
  month: Number,
  year: Number,
  active: Boolean,
 
  
},{collection:config.tables.CUSTOMER})

var Customer = module.exports = mongoose.model('Customer',CustomerSchema,config.tables.CUSTOMER);

module.exports.index = (req, res) => {
  res.render('customer', {
    title: "Customer"
  })
}

module.exports.getAllCustomers = (req, res) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching customers, Try again",
    details: []
  };
  Customer.find({}, {__v:0},(err, customers)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All Customers";
      retObj.details = customers;
      res.json(retObj)
    }
  });
}

module.exports.getCustomerById = (req, res) => {
  var customerId = req.params['_id'] 
  var retObj = {
    status: false,
    message: "Err Querying database while fetching customer by id, Try again",
    details: []
  };
  Processor.findById(customerId, {__v:0}, (err, customer)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found Customer By Id";
      retObj.details = customer;
      res.json(retObj)
    }
  });
}

module.exports.upsertCustomer = (req, res) => {
  console.log('Error O')
  var customer = req.body
  console.log(customer);
  var retObj = {
    status: false,
    message: "Err Adding customer, Try again",
    details: []
  };
  var query = { _id: mongoose.Types.ObjectId() };
  if (customer._id) {
    query = { _id: customer._id };
  }
  Customer.updateOne(query, customer, {upsert: true}, (err, result)=>{
    if(err) {
      console.log("Error In Upsert Customer");
      console.log(err);
      res.json(retObj)
    } else {
      if(customer._id) {
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
