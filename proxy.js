'use strict';

var bouncy = require('bouncy');

var server = bouncy(function (req, res, bounce) {
  if (req.url && req.url.match(/\/api\//)) {
    console.log('routing to api');
    bounce(3002);
  }
  else {
    bounce(3001);
  }
});
server.listen(3000);
