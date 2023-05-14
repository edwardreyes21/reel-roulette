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

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.mongodb_connection_string, { useNewUrlParser: true, useUnifiedTopology: true });

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  email: { type: String, required: true },
  displayName: { type: String, required: true },
  imageUrl: { type: String, required: true },
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
        const newUser = new User({
          googleId: profile.id,
          email: profile.emails[0].value, 
          displayName: profile.displayName,
          imageUrl: profile.photos[0].value
        });
        newUser.save();
        return newUser;
      }
      else {
        console.log("User is already on db");
        user.email = profile.emails[0].value, 
        user.displayName = profile.displayName,
        user.imageUrl = profile.photos[0].value
        user.save();

        return user;
      }
    })
    .then((profile) => {
      return done(null, profile);
    })
    .catch((err) => {
      return done(err);
    })
}));

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, {
       id: user.id,
       displayName: user.displayName,
       imageUrl: user.imageUrl,
    });
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
});

app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.get('/api/user', (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: 'User is not authenticated' });
    return;
  }

  const { displayName, imageUrl } = req.user;
  res.json({ displayName, imageUrl });
})

app.get('/api/is-authenticated', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});

app.post('/watchlist/new-movie', (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: 'User is not authenticated' });
    return;
  }

  const userId = req.user.id;
  const { title } = req.body.movie;

  console.log(title);

  User.findOneAndUpdate(
    { _id: userId },
    { $push: { watchList: { title } } },
    { new: true }
  )
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((error) => {
    console.log(errror);
    res.status(500).json({ message: 'Error occured while updating the user watch list' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});