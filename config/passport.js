var FacebookStrategy = require('passport-facebook').Strategy;
var User       = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findOne(id, function(err, user) {
      done(err, user);
    });
  });
  
  // FACEBOOK 
  passport.use(new FacebookStrategy({
    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL,
    enableProof     : true,
    profileFields   : ['id', 'name', 'gender', 'profileUrl', 'emails']

  },

  // facebook will send back the token and profile
  function(token, refreshToken, profile, done) {
    console.log("TOKEN", token);
    console.log("PROFILE", profile);
    process.nextTick(function() {
      User.findOne({ 'id' : profile.id }, function(err, user) {
          if (err)
            return done(err);

          if (user) {
            return done(null, user); // user found, return that user
          } else {
            var newUser            = new User();

            newUser.id    = profile.id;
            newUser.token = token;
            newUser.name  = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.email = (typeof profile.emails === 'undefined') ? '' : profile.emails[0].value;
            newUser.halloween = false;

            newUser.save(function(err) {
                if (err)
                    throw err;

                console.log("New User", newUser);
                return done(null, newUser);
            });
          }

        });
      });

    }));

};
