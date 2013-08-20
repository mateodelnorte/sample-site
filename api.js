'use strict';

var bus = require('servicebus').bus();
var restify = require('restify');
var util = require('util');

var server = restify.createServer({
  name: 'api',
  version: 'v0.0.1'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.post('/api/order', function (req, res) {
  var order = req.body;
  console.log('saving order: ' + util.inspect(order));
  bus.send('order:placed', order);
  res.send({
    success: true
  });
});

server.listen(3002, function() {
  console.log('%s listening at %s', server.name, server.url);
});
