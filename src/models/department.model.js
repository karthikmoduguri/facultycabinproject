import mongoose from "mongoose";

const departmentschema=new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    }
})

export const Department= mongoose.model('Department', departmentschema);