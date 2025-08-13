import { User } from "../models/user.model.js";
import { Cabin } from "../models/cabinnum.model.js";
import { asynchandler } from "../utils/asynchandler.js";

export const addcabin=asynchandler(async(req,res)=>{

    
    const {facultyId,floorNo,cabinNo}=req.body;

    const faculty=await User.findOne({_id:facultyId,role:"faculty"});

    if(!faculty){
        return res.status(404).json({
            success:false,
            message:"faculty not found"
        })
    }

    let cabin = await Cabin.findOne({facultyId});

    if(!cabin){
    const cabin =new Cabin({facultyId,floorNo,cabinNo});
    await cabin.save();
    console.log(cabin);
}   else{
    cabin.floorNo=floorNo;
    cabin.cabinNo=cabinNo;
}
    
    // await cabin.save();

return res.status(200).json({
    success:true,
    message:"cabin added successfully"
})
});


export const getcabinnum =async (req,res) => {
    try {
        const {facultyId}=req.params;

        if(!facultyId){
            return res.status(404).json({
                success:false,
                message:"faculty not found"
            })
        }

        const cabin=await Cabin.findOne({facultyId});
        if(!cabin){
            return res.status(404).json({
                success:false,
                message:"cabin not found"
            })  
        }

        res.status(200).json({
            success:true,
            data:cabin
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}