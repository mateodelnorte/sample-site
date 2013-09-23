/* en lieu of a real database...*/
var orders = {};

module.exports.saveOrder = function (order, callback) {
  orders[order.id] = order;
  callback(null, order);
};

module.exports.getOrder = function (id, callback) {
  callback(null, orders[id]);
};