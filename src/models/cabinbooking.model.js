import mongoose from "mongoose";
const cabinbookingschema=new mongoose.Schema({
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    facultyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    timeSlot: { 
        type: String, // Example: "10:00 AM - 11:00 AM"
        required: true 
    },
    status: { 
        type: String, 
        enum: ["Pending", "Approved", "Rejected"], 
        default: "Pending" 
    }
})

export const CabinBooking= mongoose.model('CabinBooking', cabinbookingschema);