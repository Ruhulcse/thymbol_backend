const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("./models/userModel");
const generateToken = require("./utils/generateToken");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://api.thymbol.com/google/callback",
      //callbackURL: "http://localhost:5000/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      //console.log('profile', profile);
      const registerUserWithThatEmail = await User.findOne({
        email: profile.emails[0].value,
      });
      //   console.log("registerUserWithThatEmail", registerUserWithThatEmail, profile.emails[0].value);
      if (registerUserWithThatEmail) {
        if (registerUserWithThatEmail.token) {
          done(null, registerUserWithThatEmail);
        } else {
          registerUserWithThatEmail.token = generateToken(
            registerUserWithThatEmail._id
          );
          done(null, registerUserWithThatEmail);
        }
      } else {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
          email:
            profile.emails && profile.emails[0]
              ? profile.emails[0].value
              : `${profile.id}@gmail.com`,
          token: generateToken(profile.id),
        };
        //console.log('newUser', newUser);
        try {
          let user = await User.findOne({ googleId: profile.id });
          //console.log('useruseruseruseruser', user);
          if (user) {
            // User already exists, optionally update their information
            user.displayName = profile.displayName;
            user.firstName = profile.name.givenName;
            user.lastName = profile.name.familyName;
            user.image = profile.photos[0].value;
            user.email =
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : `${profile.id}@gmail.com`;
            user.token = generateToken(profile.id);

            // Save any updates
            await user.save();

            // Log the user in
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
          done(err, null);
        }
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
