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
import adminroute from "./routes/admin.route.js"
import timetable from "./routes/timetable.route.js"
import cabinnum from "./routes/cabinnum.route.js"
import  cabinbook from "./routes/cabinbook.route.js"
import gemini from "./routes/Gemini.route.js";
import department from "./routes/department.route.js"
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
app.use('/api/v1/admin',adminroute);
app.use('/api/v1/timetable',timetable);
app.use('/api/v1/cabinnum',cabinnum);
app.use('/api/v1/cabinbook',cabinbook);
app.use('/api/v1/ai', gemini);
app.use('/api/v1/department', department);
export{app}