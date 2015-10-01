// load the item model
var Item = require('./models/item');

module.exports = function(app) {

  app.get('/api/items', function(req, res) {

    Item.find(function(err, items) {
      if (err) res.send(err);
      res.json(items); 
    });
  });

  // create item and send back all items after creation
  app.post('/api/items', function(req, res) {

    Item.create({
      text : req.body.text,
      done : false
    }, function(err, item) {
      if (err) res.send(err);
      Item.find(function(err, items) {
        if (err) res.send(err);
        res.json(items);
      });
    });

  });

  app.delete('/api/items/:item_id', function(req, res) {
    Item.remove({
      _id : req.params.item_id
    }, function(err, item) {
      if (err) res.send(err);
      Item.find(function(err, items) {
        if (err) res.send(err);
        res.json(items);
      });
    });
  });


  app.get('*', function(req, res) {
    res.sendFile('./public/index.html');
  });

};