import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../src/models/user.model.js";
import dotenv from "dotenv";
dotenv.config();
dotenv.config({
    path:'./env'
});

console.log(process.env.DATABASE_URI);

console.log("hi")
const admincreate=async () => {
    try {
        await mongoose.connect(`${process.env.DATABASE_URI}/${"faculty-cabin-project"}`);

        const adminexists= await User.findOne({role:'admin'});
        if(adminexists){
            console.log("admin already exists");
            return;
        }

        // const hashpassword= await bcrypt.hash(process.env.ADMIN_PASSWORD,10);

        const admin = new User({
            email: "abhimoduguri@gmail.com", // Replace with your admin email
            password: process.env.ADMIN_PASSWORD,
            role: "admin",
            addedByAdmin: false,
            registrationKey: 'thisismajor', 
            createdBy: null,
          });
          await admin.save();
        console.log("Admin created successfully");
    } catch (error) {
        console.error("Error creating admin:", error);
    }finally{
        mongoose.connection.close();
    }
}

admincreate();