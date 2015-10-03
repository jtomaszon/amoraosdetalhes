var fs   = require('fs');
var data = JSON.parse(fs.readFileSync(__dirname + '/../public/data.json', 'utf8'));

module.exports = function(app) {

  app.get('/', function(req, res) {
    res.render('home');
  });

  app.get('/items/:item', function(req, res) {
    item = req.params.item;
      res.render('items', data[item]); 
  });
};