const ADMIN_EMAIL = "bhanupratapsingh4459@gmail.com";

module.exports = {
  isLoggedIn: (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/auth/login");
    }
    next();
  },

  isAdmin: (req, res, next) => {
    if (!req.session.user || req.session.user.email !== ADMIN_EMAIL) {
      return res.status(403).send("Access denied ❌");
    }
    next();
  },
};
