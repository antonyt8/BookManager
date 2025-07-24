const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const sequelize = require('../config/database');
const User = require('../models/User')(sequelize, require('sequelize').DataTypes);

passport.serializeUser((user, done) => {
  console.log('[DEBUG] Serializando usuário:', user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log('[DEBUG] Deserializando usuário ID:', id);
  try {
    const user = await User.findByPk(id);
    if (user) {
      console.log('[DEBUG] Usuário encontrado:', user.email);
    } else {
      console.log('[DEBUG] Usuário não encontrado para ID:', id);
    }
    done(null, user);
  } catch (err) {
    console.error('[ERROR] Erro na deserialização:', err);
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production' 
    ? 'https://bookmanager.fly.dev/usuarios/auth/google/callback'
    : 'http://localhost:3000/usuarios/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('� Configuração OAuth:', {
      clientID: process.env.GOOGLE_CLIENT_ID ? 'DEFINIDO' : 'UNDEFINED',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'DEFINIDO' : 'UNDEFINED',
      callbackURL: process.env.NODE_ENV === 'production' 
        ? 'https://bookmanager.fly.dev/usuarios/auth/google/callback'
        : 'http://localhost:3000/usuarios/auth/google/callback',
      environment: process.env.NODE_ENV
    });
    
    console.log('�🔑 Google OAuth Callback recebido:', {
      profileId: profile.id,
      displayName: profile.displayName,
      email: profile.emails?.[0]?.value
    });
    
    const email = profile.emails[0].value;
    let user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('👤 Criando novo usuário:', email);
      user = await User.create({
        nome: profile.displayName,
        email,
        senha: require('crypto').randomBytes(16).toString('hex'), // senha aleatória
        emailConfirmed: true,
        avatar_url: profile.photos && profile.photos[0] ? profile.photos[0].value : null
      });
    } else {
      console.log('👤 Usuário existente encontrado:', email);
    }
    
    console.log('✅ Autenticação Google bem-sucedida para:', email);
    return done(null, user);
  } catch (err) {
    console.error('❌ Erro na autenticação Google:', err);
    return done(err, null);
  }
}));

module.exports = passport; 