'use strict';

var bus = require('./lib/bus');
var orderDb = require('./lib/repositories/order');
var debug = require('debug')('api');
var express = require('express');
var http = require('http');
var uniqueId = require('node-uuid').v4;
var util = require('util');

var server = module.exports = express();

server.set('port', parseInt(process.env.PORT || 3002));
server.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
server.use(express.logger('dev'));
server.use(express.bodyParser());
server.use(express.methodOverride());
server.use(server.router);

// development only
if ('development' === server.get('env')) {
  server.use(express.errorHandler());
}

var port = parseInt(server.get('port'))

server.post('/api/order', function (req, res) {
  var order = req.body;

  order.id = uniqueId();
  order.created = new Date().toUTCString();

  debug('saving order');

  orderDb.saveOrder(order, function (err) {
    debug('order saved: ' + util.inspect(order));
    if (err) {
      res.send({
        success: false
      });
      throw err;
    }

    bus.publish('order:placed', order);

    return res.send({
      success: true,
      order: order
    });

  });

});

server.get('/api/order/confirmation/:orderId', function (req, res) {
  var orderId = req.params.orderId;
  orderDb.getOrder(orderId, function (err, order) {
    if (err) throw err;
    res.send(order);
  });
});

http.createServer(server).listen(port, function(){
  debug('api server listening on port ' + port);
});

bus.subscribe('email:sent:confirmation', function (msg) {
  orderDb.getOrder(msg.data.orderId, function (err, order) {
    if (err) throw err;
    order.confirmationEmailText = msg.data.text;
    orderDb.saveOrder(order, function (err) {
      if (err) throw err;
      debug('received confirmation email');
    });
  });
});

bus.subscribe('email:sent:receipt', function (msg) {
  orderDb.getOrder(msg.data.orderId, function (err, order) {
    if (err) throw err;
    order.receiptEmailText = msg.data.text;
    orderDb.saveOrder(order, function (err) {
      if (err) throw err;
      debug('received receipt email');
    });
  });
});
