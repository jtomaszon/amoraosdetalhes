var fs   = require('fs');
var data = JSON.parse(fs.readFileSync(__dirname + '/../public/data.json', 'utf8'));
var mail = require('nodemailer');

module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    res.render('home');
  });

  app.get('/moldes', function(req, res) {
    res.render('patterns');
  });

  app.get('/items/:item', function(req, res) {
    item = req.params.item;
      res.render('items', data[item]); 
  });

  // Facebook
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
      passport.authenticate('facebook', {
          successRedirect : '/profile',
          failureRedirect : '/'
      }));

  // route for logging out
  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });
  // END Facebook

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

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}
