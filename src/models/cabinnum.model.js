import mongoose from "mongoose";
import { User } from "./user.model.js";
const cabinnumSchema=new mongoose.Schema({
    facultyId:{
        ref:'User',
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        unique: true,  
    },
    floorNo: {
        type: Number,
        required: true
    },
    cabinNo: {
        type: String,
        required: true
    }
})

export const Cabin= mongoose.model('Cabin', cabinnumSchema);