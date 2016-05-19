var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

//////////////////////////////////////////////////////////////////////
// Connect to db

var sConnect = process.env.AOTD_DB_USERNAME
       + ':' + process.env.AOTD_DB_PASSWORD
       + "@" + process.env.AOTD_DB_HOSTNAME
       + ":" + process.env.AOTD_DB_PORT
       + "/" + process.env.AOTD_DB_DATABASE;

var mongo = require('mongodb'); // We want to talk to MongoDB
var monk  = require('monk');    // We're going to use Monk to do it
var db    = monk(sConnect);     // Our db is located here

//////////////////////////////////////////////////////////////////////
// Routes

var routes = require('./routes/index');
//var albums = require('./routes/albums'); // New route for albums
var users  = require('./routes/users');

//////////////////////////////////////////////////////////////////////

var app = express();

//////////////////////////////////////////////////////////////////////
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//////////////////////////////////////////////////////////////////////
// uncomment after placing your favicon in /public

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//////////////////////////////////////////////////////////////////////

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//////////////////////////////////////////////////////////////////////
// Make our db accessible to our router

app.use(function(req, res, next)
{
  req.db = db;
  next();
});

//////////////////////////////////////////////////////////////////////
// Routes

app.use('/', routes);
//app.use('/albums', albums); // New route for albums
app.use('/users', users);

//////////////////////////////////////////////////////////////////////
// catch 404 and forward to error handler

app.use(function(req, res, next)
{
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//////////////////////////////////////////////////////////////////////
// error handlers

// development error handler (with stacktrace)
if (app.get('env') === 'development')
{
  app.use(function(err, req, res, next)
  {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler (no stacktrace)
app.use(function(err, req, res, next)
{
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//////////////////////////////////////////////////////////////////////

module.exports = app;
