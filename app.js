//taskkill /F /IM node.exe
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config();
//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
//var processRouter = require('./routes/processor');
//var ramRouter = require('./routes/ram');
//var SpareTypesRouter = require('./routes/sparetypes');
//var ScreensRouter = require('./routes/screens');
//var StoragesRouter = require('./routes/storages');
//var ItemTypesRouter = require('./routes/itemtypes');
//var BrandsRouter = require('./routes/brands');
//var VendorsRouter = require('./routes/vendors');
//var ModelNosRouter = require('./routes/modelnos');
//var Masters = require('./routes/masters');
//var ItemsRouter = require('./routes/items');

var deviceController = require('./controllers/device');
var accountController = require('./controllers/account');
var companyController = require('./controllers/company');
var customerController = require('./controllers/customer');
var customer_userController = require('./controllers/customer_user');
var locationController = require('./controllers/location');
var campaignController = require('./controllers/campaign');
var repsController = require('./controllers/reps');
var asset_detailsController = require('./controllers/asset_details');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  //res.header("Access-Control-Allow-Origin", "http://localhost:"+config.client);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,HEAD");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
var path = process.env.LOCAL_DB_STRING

mongoose.connect(path, function (err, db) {
    if(err) console.log(err);
    else console.log('Connected To Db')
});

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/processor', processRouter);
// app.use('/ram', ramRouter);
// app.use('/sparetypes', SpareTypesRouter);
// app.use('/screens', ScreensRouter);
// app.use('/storages', StoragesRouter);
// app.use('/itemtypes', ItemTypesRouter);
// app.use('/brands', BrandsRouter);
// app.use('/vendors', VendorsRouter);
// app.use('/modelnos', ModelNosRouter);
// app.use('/master', Masters);
// app.use('/items', ItemsRouter);

app.get('/device', deviceController.index)
app.get('/device/all', deviceController.getAllDevices)
app.get('/device/id/:_id', deviceController.getDeviceById)
app.post('/device', deviceController.upsertDevice)
app.get('/account', accountController.index)
app.get('/account/all', accountController.getAllAccounts)
app.get('/account/id/:_id', accountController.getAccountById)
app.post('/account', accountController.upsertAccount)
app.get('/company', companyController.index)
app.get('/company/all', companyController.getAllCompanys)
app.get('/company/id/:_id', companyController.getCompanyById)
app.post('/company', companyController.upsertCompany)
app.get('/customer', customerController.index)
app.get('/customer/all', customerController.getAllCustomers)
app.get('/customer/id/:_id', customerController.getCustomerById)
app.post('/customer', customerController.upsertCustomer)
app.get('/customer_user', customer_userController.index)
app.get('/customer_user/all', customer_userController.getAllCustomerUsers)
app.get('/customer_user/id/:_id', customer_userController.getCustomerUserById)
app.post('/customer_user', customer_userController.upsertCustomerUser)
app.get('/location', locationController.index)
app.get('/location/all', locationController.getAllLocations)
app.get('/location/id/:_id', locationController.getLocationById)
app.post('/location', locationController.upsertLocation)
app.get('/campaign', campaignController.index)
app.get('/campaign/all', campaignController.getAllCampaigns)
app.get('/campaign/id/:_id', campaignController.getCampaignById)
app.post('/campaign', campaignController.upsertCampaign)
app.get('/reps', repsController.index)
app.get('/reps/all', repsController.getAllRepss)
app.get('/reps/id/:_id', repsController.getRepsById)
app.post('/reps', repsController.upsertReps)
app.get('/asset_details', asset_detailsController.index)
app.get('/asset_details/all', asset_detailsController.getAllAssetDetailss)
app.get('/asset_details/id/:_id', asset_detailsController.getAssetDetailsById)
app.post('/asset_details', asset_detailsController.upsertAssetDetails)




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
