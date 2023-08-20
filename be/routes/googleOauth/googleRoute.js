const express = require("express");
const google = express.Router();
const passport = require("passport");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

require("dotenv").config();

google.use(
  session({
    secret: process.env.GOOGLE_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

google.use(passport.initialize());
google.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_KEY,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
      console.log(profile);
      return done(null, profile);
      //   });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

google.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"], prompt: `select_account` }),
  (req, res) => {
    const redirectUrl = `${process.env.GITHUB_FE_URL}/success?user=${encodeURIComponent(
      JSON.stringify(req.user)
    )}`;
    res.redirect(redirectUrl);
  }
);

google.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const { user } = req;
    console.log(req.user);

    const token = jwt.sign(user, process.env.JWT_SECRET);
    const redirectUrl = `${process.env.GITHUB_FE_URL}/success/${encodeURIComponent(token)}`;
    res.redirect(redirectUrl);
  }
);

google.get("/success", (req, res) => {
  res.redirect(`${process.env.GITHUB_FE_URL}/homepage`);
});

module.exports = google;
