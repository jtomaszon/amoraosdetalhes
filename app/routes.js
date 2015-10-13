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
  app.get('/stats', function (req, res) {
    var User       = require('./models/user');
    User.count(function(err, result){
      res.json(result);
    });
  });
    
  app.get('/blog', function (req, res) {
    res.render('blog');
  });

  app.get('/blog/:item', isLoggedIn, function (req, res) {
    var item = req.params.item;
    res.render('post', data[item]);
  });

  // Facebook
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback', function(req, res, next){
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
    })(req, res, next)
  });

  // route for logging out
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });
  // END Facebook

  // Email
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
  // END Email
  
  // API
  app.get('/api/items', function (req, res) {
    var item = req.params.item;
    res.json(data);
  });
  
  app.get('/api/items/:item', function (req, res) {
    var item = req.params.item;
    res.json(data[item]);
  });
  // End API


  app.get('/newsletter', function (req, res) {
    var User       = require('./models/user');

    User.find({$and:[{ email : '' , halloween : false }]}, {email: 1, name: 1}, function(err, users){
  
      users.forEach(function(user){
        console.log(user.email);
        var transporter = mail.createTransport({
          service: 'hotmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        var message = "Olá " + user.name + "\n\n" +
          "Muito obrigada por curtir e se cadastrar no meu novo site (<3) \n" +
          "Espero que tenha gostado de tudo, pois em cada detalhe tem muito amor.\n" + 
          "Segue o link para download do PDF com o molde de presente para o Halloween: \n\n" +
          "http://amoraosdetalhes.com.br/downloads/MoldesHalloween.pdf \n\n" +
          "Sei que de Horripilante essas fofuras não tem nada, rs \n" +
          "Mas você pode soltar a criatividade e criar peças lindas com esses moldes! <3 \n\n" +
          "Aproveite e não se esqueça de me contar o que achou e se quiser pode compartilhar as suas criações, vou adorar conhecer o seu trabalho! <3 \n\n" +
          "Beijos iluminados e tenha uma linda semana! \n\n" +
          "Giulia.\n";

        transporter.sendMail({
          from: 'amoraosdetalhes@outlook.com.br',
          to: user.email,
          subject: 'Amor aos Detalhes: Presente de Halloween',
          text: message
        }, function (err, info) {
          if (err) {
            console.log("ERROR Email", err);
          }
          console.log("EMAIL", info);
          User.update({ 'email' : user.email }, { halloween : true }, function(err, user) {
            console.log(user.email + 'was updated');
          });
        });     

      });

      if (users.length == 0) {
        res.send( { "status" : "nothing to send" } );
      }else {
        res.json({ status: 200 });
      }
        
    });
    
  });

  
};
