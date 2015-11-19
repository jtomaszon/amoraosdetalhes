/*jslint node: true */

var fs   = require('fs');
var data = JSON.parse(fs.readFileSync(__dirname + '/../public/data.json', 'utf8'));
var mail = require('nodemailer');

var sendgrid       = require('sendgrid')(process.env.SENDGRID_APIUSER, process.env.SENDGRID_APIPASS);


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() || process.env.NOFACE) {
    return next();
  }
  req.session.redirectUrl = req.url;
  res.redirect('/auth/facebook');
}

module.exports = function (app, passport) {
  
  app.get('/downloads/MoldesHalloween.pdf', function(req, res) {
    res.redirect('https://s3-sa-east-1.amazonaws.com/amoraosdetalhes.com.br/downloads/MoldesHalloween.pdf');
  });
  
  app.get('/stats', function (req, res) {
    var User       = require('./models/user');
    User.count(function(err, result){
      res.json(result);
    });
  });
    
  app.get('/blog', function (req, res) {
    res.render('blog');
  });

  app.get('/blog/1', isLoggedIn, function (req, res) {
    res.redirect('/blog/peru-de-natal');
  });

  app.get('/blog/peru-de-natal', isLoggedIn, function (req, res) {
    res.render('peru');
  });

  app.get('/blog/bailarina-bebe', isLoggedIn, function (req, res) {
    res.render('bailarina');
  });

  app.get('/blog/presentes-bebes', isLoggedIn, function (req, res) {
    res.render('presentes-bebes');
  });

  app.get('/blog/presentes-halloween', isLoggedIn, function (req, res) {
    res.render('presentes-halloween');
  });

  app.get('/blog/princess-bela', isLoggedIn, function (req, res) {
    res.render('princess-bela');
  });
  
  app.get('/blog/bonecas', isLoggedIn, function (req, res) {
    res.render('bonecas');
  });

  app.get('/blog/sagrada-familia', isLoggedIn, function (req, res) {
    res.render('sagrada-familia');
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
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    transporter.sendMail({
      from: 'info@amoraosdetalhes.com.br',
      to: 'info@amoraosdetalhes.com.br',
      subject: 'Contato amoraosdetalhes.com',
      text: req.body.name + " <" + req.body.email + "> " + 'diz: \n' + req.body.message
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


//  app.get('/newsletter', function (req, res) {
//    var User        = require('./models/user');
//    
//    User.find({$and:[{ email : { $ne : '' }, halloween : false }]}, {email: 1, name: 1}, function(err, users){
//  
//      if (users.length == 0) {
//        res.send( { "status" : "nothing to send" } );
//      }else {
//        res.json({ status: "emails " + users.length + " was sucefully sent" });
//      }
//
//      users.forEach(function(user){
//        var email       = new sendgrid.Email();
//        var message = "Olá " + user.name + "<br /><br />" +
//          "Muito obrigada por curtir e se cadastrar no meu novo site (<3) <br />" +
//          "Espero que tenha gostado de tudo, pois em cada detalhe tem muito amor.<br />" + 
//          "Segue o link para download do PDF com o molde de presente para o Halloween: <br /><br />" +
//          "http://amoraosdetalhes.com.br/downloads/MoldesHalloween.pdf <br /><br />" +
//          "Sei que de Horripilante essas fofuras não tem nada, rs <br />" +
//          "Mas você pode soltar a criatividade e criar peças lindas com esses moldes! <3 <br /><br />" +
//          "Aproveite e não se esqueça de me contar o que achou e se quiser pode compartilhar as suas criações, vou adorar conhecer o seu trabalho! <3 <br /><br />" +
//          "Beijos iluminados e tenha uma linda semana! <br /><br />" +
//          "Giulia.<br />";
//
//        email.addTo(user.email);
//        email.setFrom('info@amoraosdetalhes.com.br');
//        email.setFromName('Amor aos Detalhes Artesanato');
//        email.setSubject('Amor aos Detalhes: Presente de Halloween');
//        email.setHtml(message);
//
//        sendgrid.send(email, function(err, json){
//          if (err) { return console.error(err); }
//
//          User.findOneAndUpdate({ 'email' : user.email }, { halloween : true }, function(err, user) {
//            console.log(user.email + ' was updated');
//          });
//
//        });
//        
//      });
//   
//    });
//    
//  });

};
