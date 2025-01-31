import jwt from "jsonwebtoken";
import { asynchandler } from "../utils/asynchandler.js";
import {User} from "../models/user.model.js";
const protect =asynchandler(async (req,res,next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        console.log("hi na");
        console.log("Authorization Header:", req.headers.authorization);
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user=await User.findById(decoded.id).select('-password');
        
            next();
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:'Token verification failed'
            });
        }
    } else {
        return res.status(401).json({
            success:false,
            message:'no token provided'
        });
    }
});

const admin=async (req,res,next) => {
    console.log("hira hinana")
    console.log(req.user);
    if (req.user && req.user.role==='admin') {
        console.log("okokok");
        next();
    } else {
        return res.status(401).json({
            message:'failed, you r not admin '
        })
    }
}

export {protect,admin};
