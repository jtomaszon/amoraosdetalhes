var fs   = require('fs');
var data = JSON.parse(fs.readFileSync(__dirname + '/../public/data.json', 'utf8'));
var mail = require('nodemailer');

module.exports = function(app) {

  app.get('/', function(req, res) {
    res.render('home');
  });

  app.get('/items/:item', function(req, res) {
    item = req.params.item;
      res.render('items', data[item]); 
  });

  app.post('/mail', function(req, res){
    var transporter = mail.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    transporter.sendMail({
      from: 'amoraosdetalhes@outlook.com.br',
      to: 'amoraosdetalhes@outlook.com.br',
      subject: 'Contato amoraosdetalhes.com',
      text: req.body.name + " <"+req.body.email+"> " + 'diz:\n' + req.body.message
    }, function(err, info){
      if (err) console.log("ERROR Email", err);
      console.log("EMAIL", info);
      res.json(info);
    })

  })
};