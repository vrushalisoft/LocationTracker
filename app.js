//taskkill /F /IM node.exe
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var processRouter = require('./routes/processor');
var ramRouter = require('./routes/ram');
var SpareTypesRouter = require('./routes/sparetypes');
var ScreensRouter = require('./routes/screens');
var StoragesRouter = require('./routes/storages');
var ItemTypesRouter = require('./routes/itemtypes');
var BrandsRouter = require('./routes/brands');
var VendorsRouter = require('./routes/vendors');
var ModelNosRouter = require('./routes/modelnos');
var Masters = require('./routes/masters');
var ItemsRouter = require('./routes/items');

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
var path = process.env.ONLINE_DB_STRING

mongoose.connect(path, function (err, db) {
    if(err) console.log(err);
    else console.log('Connected To Db')
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/processor', processRouter);
app.use('/ram', ramRouter);
app.use('/sparetypes', SpareTypesRouter);
app.use('/screens', ScreensRouter);
app.use('/storages', StoragesRouter);
app.use('/itemtypes', ItemTypesRouter);
app.use('/brands', BrandsRouter);
app.use('/vendors', VendorsRouter);
app.use('/modelnos', ModelNosRouter);
app.use('/master', Masters);
app.use('/items', ItemsRouter);

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
