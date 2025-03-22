import { TimeTable } from "../models/timetable.model.js";


export const gettimetable=async (req,res)=>{
    try {
        const timetables=await TimeTable.findOne({facultyId:req.params.facultyId});
        if(!timetables){
            return res.status(404).json({
                success:false,
                message:"timetable not found"
            })  
        }

        res.status(200).json({success:true,data:timetables});
    } catch (error) {
        res.status(500).json({success:false,data:error.message});
    }
}