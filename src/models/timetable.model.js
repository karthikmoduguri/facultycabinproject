import { User } from "./user.model.js";
import mongoose from "mongoose";




const timetableschema=new mongoose.Schema({
    facultyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    week: {
        monday: [{ period: Number, time: String, status: String }],
        tuesday: [{ period: Number, time: String, status: String }],
        wednesday: [{ period: Number, time: String, status: String }],
        thursday: [{ period: Number, time: String, status: String }],
        friday: [{ period: Number, time: String, status: String }],
        saturday: [{ period: Number, time: String, status: String }]
    }
    
})

export const TimeTable= mongoose.model('TimeTable',timetableschema);