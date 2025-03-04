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
      
      res.send("<a href='https://www.google.com/'>login success please click here</a>")
      // Generate JWT and send to client
      const token = generateToken(req.user._id, req.user.role);
      res.status(200).json({ success: true, token,message:'login successfull' });
    }
  );

  export {router}