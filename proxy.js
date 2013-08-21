'use strict';

var bouncy = require('bouncy');
var debug = require('debug')('proxy');

var apiPort = process.env.API_PORT || 3002;
var proxyPort = process.env.PROXY_PORT || 3000;
var sitePort = process.env.SITE_PORT || 3001;

var server = bouncy(function (req, res, bounce) {
  if (req.url && req.url.match(/\/api\//)) {
    console.log('routing to api');
    bounce(parseInt(apiPort));
  }
  else {
    console.log('wtf am I routing to the site?')
    bounce(parseInt(sitePort));
  }
});

server.listen(parseInt(proxyPort));

debug('proxy started on port ' + proxyPort + '. redirecting to site on ' + sitePort + ' and api on ' + apiPort);
