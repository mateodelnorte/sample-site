'use strict';

var bouncy = require('bouncy');
var debug = require('debug')('proxy');

var apiPort = parseInt(process.env.API_PORT || 3002);
var proxyPort = parseInt(process.env.PROXY_PORT || 3000);
var sitePort = parseInt(process.env.SITE_PORT || 3001);

var server = bouncy(function (req, res, bounce) {
  console.log('request')
  if (req.headers.host.indexOf('api') > -1) {
    console.log('routing to api at ', apiPort);
    bounce(apiPort);
  }
  else {
    console.log('wtf am I routing to the site? at ', sitePort)
    bounce(sitePort);
  }
});

server.listen(proxyPort);

debug('proxy started on port ' + proxyPort + '. redirecting to site on ' + sitePort + ' and api on ' + apiPort);
