import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";


const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID, // from Google Cloud
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/api/v1/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = await User.create({
              googleId: profile.id,
              email: profile.emails[0].value,
              role: 'student', // Default role; customize as needed
            });
          }
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id); // Save user ID to session
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

export default configurePassport;