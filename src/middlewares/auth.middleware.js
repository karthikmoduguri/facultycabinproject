import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";


const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID, // from Google Cloud
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:7000/api/v1/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Find user by Google ID
          let user = await User.findOne({ googleId: profile.id });
      
          if (!user) {
            // If no user is found with Google ID, try matching with email
            user = await User.findOne({ email: profile.emails[0].value });
      
            if (user) {
              // Update the user record with Google ID
              user.googleId = profile.id;
              user.googleAuthenticated = true; // Mark as authenticated
              await user.save();
            } else {
              // If no matching email, create a new user
              // user = await User.create({
              //   googleId: profile.id,
              //   email: profile.emails[0].value,
              //   role: 'student', // Default role; customize as needed
              // });
              return res.status(404).json({success:false,message:'you r not a valid college user'})
            }
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


/*
google authentication flow 
User clicks "Google Sign-In."
Google server:
Asks for email and password (if not signed in already).
Verifies credentials.
On successful login:
Generates ID token or Access token.
Sends token to your backend.
Backend:
extracts payload(email,profile pic etc ..)from token
and checks if user is already present in db or not(email-check for uniqueness )
*/