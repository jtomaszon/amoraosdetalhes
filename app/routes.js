/*jslint node: true */

var fs   = require('fs');
var data = JSON.parse(fs.readFileSync(__dirname + '/../public/data.json', 'utf8'));
var mail = require('nodemailer');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() || process.env.NOFACE) {
    return next();
  }
  req.session.redirectUrl = req.url;
  res.redirect('/auth/facebook');
}

module.exports = function (app, passport) {
  app.get('/', function (req, res) {
    res.render('home');
  });

  app.get('/blog', function (req, res) {
    res.render('blog');
  });

  app.get('/blog/:item', isLoggedIn, function (req, res) {
    var item = req.params.item;
    res.render('post', data[item]);
  });

  app.get('/items/:item', function (req, res) {
    var item = req.params.item;
    res.render('items', data[item]);
  });

  // Facebook
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', function(err, user, info){
      var redirectUrl = '/blog';
    
      if (err) {return next(err); }
      if (req.session.redirectUrl) {
        redirectUrl = req.session.redirectUrl;
        req.session.redirectUrl = null;
      }
      req.logIn(user, function(err){
        if (err) { return next(err); }
      });
      res.redirect(redirectUrl);
    })(req, res, next);
  });

  // route for logging out
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });
  // END Facebook

  app.post('/mail', function (req, res) {
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
      text: req.body.name + " <" + req.body.email + "> " + 'diz:\n' + req.body.message
    }, function (err, info) {
      if (err) {
        console.log("ERROR Email", err);
      }
      console.log("EMAIL", info);
      res.json(info);
    });
    
  });
};