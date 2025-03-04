import { User } from "../models/user.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/jwtUtils.js";
import passport from "passport";
 export const adminlogin = asynchandler(async (req,res,next) => {
    const {email ,password}=req.body;
    //admin exist checking
    // console.log(email,password);
    const admin = await User.findOne({email,role: "admin"});
    if(admin){console.log(true);}
    if(!admin){
        return res.status(404).json({
            success:false,
            message:'admin not found'
        });

    }
    const hashedPassword = await bcrypt.hash(password, 10);
    //console.log(admin);
    console.log(hashedPassword);
    const ismatch=await admin.matchPassword(password);
    console.log(ismatch);
    console.log(admin.password);
    if (!ismatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

    if(admin && ismatch){
        res.json({
            token:generateToken(admin._id, admin.role)
        })
    }
    else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
});

export const addUser = asynchandler(async (req, res) => {
    const { email, role,name,regno,batch,department,semester,section } = req.body;
  
    if (!["student", "faculty"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    const defaultPassword = "Default@123";
  
    const user = new User({
      email,
      role,
      name,
      regno,
      batch,
      department,
      semester,
      section,
      password: defaultPassword,
      addedByAdmin: true,
    });
  
    await user.save();
    res.status(201).json({ success: true, message: `${role} added successfully` });
  });

  export const deleteUser = asynchandler(async (req, res) => {
    try {
      const { id } = req.params; // Get ID from params
      const { email } = req.body; // Get Email from body
  
      let user;
  
      if (id) {
        // Delete by ID (URL parameter)
        user = await User.findByIdAndDelete(id);
      } else if (email) {
        // Delete by Email (Request body)
        user = await User.findOneAndDelete({ email });
      } else {
        return res.status(400).json({
          success: false,
          message: "Please provide a user ID or Email",
        });
      }
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting user",
        error: error.message,
      });
    }
  });
  