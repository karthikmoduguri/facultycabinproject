import express from "express";
// import passport from "../middlewares/auth.middleware.js";
import passport from "passport";
import { Router } from "express";
import generateToken from "../utils/jwtUtils.js";
const router = Router();
import configurePassport from "../middlewares/auth.middleware.js";
router.get("/h",(req,res)=>{
    res.send("<a href='http://localhost:7000/api/v1/auth/google'>login with google</a>")
})
configurePassport();

router.get('/google', (req, res, next) => {
  console.log('Google login route triggered'); // Debugging log
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});


// Google callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/h' }),
    (req, res) => {
      if (!req.user.googleAuthenticated) {
        // If user has not completed Google authentication, handle it
        return res.status(403).json({
          success: false,
          message: 'Account setup incomplete. Please contact admin.',
        });
      }
      
      // res.redirect(`http://localhost:5173/student-dashboard?token=${token}`);
      // Generate JWT and send to client
      const token = generateToken(req.user._id, req.user.role);
const userme = req.user; // Full user object, not just _id

console.log("Google Login User:", req.user);

// Encode user data to pass in URL
const encodedUser = encodeURIComponent(JSON.stringify(userme));

// Redirect based on role
if (req.user.role === 'student') {
  res.redirect(`http://localhost:5173/student-dashboard?token=${token}&userme=${encodedUser}`);
} else if (req.user.role === 'faculty') {
  res.redirect(`http://localhost:5173/faculty-dashboard?token=${token}&userme=${encodedUser}`);
} else {
  res.redirect(`http://localhost:5173/unauthorized`); // Optional: default or error page
}

      res.status(200).json({ success: true, token,userme,message:'login successfull' });
    }
  );

  export {router}