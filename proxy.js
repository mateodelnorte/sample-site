'use strict';

var bouncy = require('bouncy');
var debug = require('debug')('proxy');

var apiPort = parseInt(process.env.API_PORT || 3002);
var proxyPort = parseInt(process.env.PROXY_PORT || 3000);
var sitePort = parseInt(process.env.SITE_PORT || 3001);

var server = bouncy(function (req, res, bounce) {
  if (req.headers.host.indexOf('api') > -1) {
    bounce(apiPort);
  }
  else {
    bounce(sitePort);
  }
});

server.listen(proxyPort);

debug('proxy started on port ' + proxyPort + '. redirecting to site on ' + sitePort + ' and api on ' + apiPort);
