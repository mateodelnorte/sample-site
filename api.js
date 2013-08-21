'use strict';

var bus = require('servicebus').bus();
var debug = require('debug')('api');
var restify = require('restify');
var uniqueId = require('node-uuid').v4;
var util = require('util');

var server = restify.createServer({
  name: 'api',
  version: 'v0.0.1'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

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

server.post('/api/order', function (req, res) {
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

server.get('/api/order/:orderId/confirmation', function (req, res) {
  var orderId = req.params.orderId;
  console.log('orderId: ', orderId);
});

server.listen(3002, function() {
  debug('restify %s listening at %s', server.name, server.url);
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
