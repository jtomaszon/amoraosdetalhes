// set up ======================================================================
var express  = require('express');
var compress = require('compression');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var passport = require('passport');

var port     = process.env.PORT || 8082;                // set the port
var fs       = require('fs');
var db       = require('./config/database');            // load the database config

// Express dependencies
var morgan = require('morgan');                  // log requests to the console
var bodyParser = require('body-parser');         // pull information from HTML POST
var methodOverride = require('method-override'); // simulate DELETE and PUT

// configuration ===============================================================
mongoose.connect(db.url);
require('./config/passport')(passport);

var data = JSON.parse(fs.readFileSync(__dirname + '/public/data.json', 'utf8'));

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                        // log every request to the console
app.use(compress()); 
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

app.use(function (req, res, next) {
  res.locals = {
    data: data
  };
  next();
});

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

// routes ======================================================================
require('./app/routes')(app, passport);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
