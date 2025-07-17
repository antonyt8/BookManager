module.exports = function(req, res, next) {
  if (req.session && req.session.user && req.session.user.isAdmin) {
    return next();
  }
  req.flash('error', 'Acesso restrito a administradores.');
  res.redirect('/');
}; 