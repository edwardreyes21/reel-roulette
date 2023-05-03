require('dotenv').config();

const express = require('express');
const passport = require('passport');
const path = require('path');
const crypto = require('crypto');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));
app.use(session({
  secret: crypto.randomBytes(64).toString('hex'),
  resave: false,
  saveUninitialized: false
}));

mongoose.connect(process.env.mongodb_connection_string, { useNewUrlParser: true, useUnifiedTopology: true });

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  email: { type: String, required: true },
  watchList: [movieSchema]
});

const User = mongoose.model('User', userSchema);

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  passReqToCallback: true
},
function(request, accessToken, refreshToken, profile, done) {
  User.findOne({ googleId: profile.id })
    .then((user) => {
      if (!user) {
        console.log("Creating new user on db");
        const newUser = new User({ googleId: profile.id, email: profile.emails[0].value });
        newUser.save();
        return newUser;
      }
      else {
        console.log("User is already on db");
        return user;
      }
    })
    .then((user) => {
      return done(null, user);
    })
    .catch((err) => {
      return done(err);
    })
}));

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => {
    return cb(null, user);
  });
});

app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { 
    successRedirect: '/auth/google/success', 
    failureRedirect: '/auth/google/failure'
  }
));

app.get('/auth/google/success', (req, res) => {
  console.log("Logged in!");
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});