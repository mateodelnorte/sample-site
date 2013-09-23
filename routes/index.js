
/*
 * GET home page.
 */

exports.index = function (req, res){
  res.render('index', { 
    __hostname: 'api.' + req.headers.host,
    __port: process.env.port
  });
};