const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const sequelize = require('../config/database');
const User = require('../models/User')(sequelize, require('sequelize').DataTypes);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/usuarios/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({
        nome: profile.displayName,
        email,
        senha: require('crypto').randomBytes(16).toString('hex'), // senha aleatória
        emailConfirmed: true,
        avatar_url: profile.photos && profile.photos[0] ? profile.photos[0].value : null
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

module.exports = passport; 