require('dotenv').config();

const express = require('express');
const passport = require('passport');
const path = require('path');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

mongoose.connect(process.env.mongodb_connection_string, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true },
    email: { type: String, required: true }
});

const user = mongoose.model('User', userSchema);
const db = mongoose.connection.useDb('movie_db');
const users = db.model('User', userSchema);

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
  // This function will be called when the user has been authenticated
  // You can use this callback to save user data to a database, etc.
  return cb(null, profile);
}));

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});