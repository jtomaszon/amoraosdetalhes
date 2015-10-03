var fs       = require('fs');
var data = JSON.parse(fs.readFileSync(__dirname + '/../public/data.json', 'utf8'));

Array.prototype.contains = function(k, callback) {
    var self = this;
    return (function check(i) {
        if (i >= self.length) {
            return callback(false);
        }

        if (self[i] === k) {
            return callback(true);
        }

        return process.nextTick(check.bind(null, i+1));
    }(0));
}

module.exports = function(app) {

  app.get('/', function(req, res) {
    res.render('home');
  });

  app.get('/items/:item', function(req, res) {
    item = req.params.item;
      res.render('items', data[item]); 
  });
};