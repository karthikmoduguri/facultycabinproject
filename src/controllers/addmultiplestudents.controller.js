import { User } from "../models/user.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/jwtUtils.js";
import { upload } from "../middlewares/multer.middlewares.js";
import csv from "csv-parser";
import fs from "fs";
import passport from "passport";

const addmultipleuser=asynchandler(async(req,res)=>{
    console.log("atleast nenu call ayyana");
        const file = req.file;
        console.log(file);
        if (!file) {
          return res.status(400).json({ message: "Please upload a file" });
        }
        console.log(file);
        const users = [];
          fs.createReadStream(file.path)
            .pipe(csv())
            .on("data", (data) => {
              users.push(data);
            })
            .on("end", async() => {
                try {
                    const usersToInsert = users.map((row) => ({
                        email: row.email,
                        role: "student"||row.role,
                        name: row.name,
                        department: row.department,
                        semester: row.semester,
                        section: row.section,
                        batch: row.batch,
                        regno: row.regno,
                        password:"newpass"
                      }));
                      console.log(usersToInsert);
                      await User.insertMany(usersToInsert);
                      fs.unlinkSync(req.file.path); // Delete file after processing
              
                      res.status(200).json({ message: "Students uploaded successfully!" });
                } catch (error) {
                    res.status(500).json({ message: "Error uploading students", error });
                }
            })
 });

 export {addmultipleuser};


