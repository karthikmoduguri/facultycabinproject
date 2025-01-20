import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from 'express-session';
import { router } from "./routes/auth.route.js";
//import passport from "./middlewares/auth.middleware.js";
import configurePassport from "./middlewares/auth.middleware.js";
import passport from "passport";
dotenv.config();

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );
// app.use(notFound);
// app.use(errorHandler);
configurePassport();
app.use(passport.initialize());
app.use(passport.session()); // Initialize Passport
app.use('/api/v1/auth', router); // Google Auth routes

export{app}