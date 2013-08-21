'use strict';

/**
 * Module dependencies.
 */

var bus = require('servicebus').bus();
var debug = require('debug')('site');
var express = require('express');
var http = require('http');
var path = require('path');
var uniqueId = require('node-uuid').v4;
var util = require('util');

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

/* en lieu of a real database...*/
function OrderRepository () {
  this.orders = {};
}

OrderRepository.prototype.saveOrder = function (order, callback) {
  this.orders[order.id] = order;
  callback(null, order);
};

OrderRepository.prototype.getOrder = function (id, callback) {
  callback(null, this.orders[id]);
};

var db = new OrderRepository();

app.post('/api/order', function (req, res) {
  var order = req.body;

  order.id = uniqueId();
  order.created = new Date().toUTCString();

  db.saveOrder(order, function (err) {
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

app.get('/api/order/confirmation/:orderId', function (req, res) {
  var orderId = req.params.orderId;
  db.getOrder(orderId, function (err, order) {
    if (err) throw err;
    res.send(order);
  });
});

bus.subscribe('email:sent:confirmation', function (msg) {
  db.getOrder(msg.data.orderId, function (err, order) {
    if (err) throw err;
    order.confirmationEmailText = msg.data.text;
    db.saveOrder(order, function (err) {
      if (err) throw err;
      debug('received confirmation email');
    });
  });
});

bus.subscribe('email:sent:receipt', function (msg) {
  db.getOrder(msg.data.orderId, function (err, order) {
    if (err) throw err;
    order.receiptEmailText = msg.data.text;
    db.saveOrder(order, function (err) {
      if (err) throw err;
      debug('received receipt email');
    });
  });
});

http.createServer(app).listen(port, function(){
  debug('Express server listening on port ' + port);
});
