'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = module.exports = express();

// all environments
app.set('port', parseInt(process.env.PORT || 3001));
app.set('views', __dirname + '/views');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

var port = parseInt(app.get('port'))

http.createServer(app).listen(port, function(){
  console.log('Express server listening on port ' + port);
});
