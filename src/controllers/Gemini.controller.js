import "dotenv/config";  // Load environment variables
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const chatwithgemini=async(req,res)=>{
    try {
        const {message}=req.body;
        if(!message){
            return res.status(400).json({message:"Please provide message"});
        }
        const prompt = message;
        const result = await model.generateContent(prompt);
        const reply=result.response.text();
        return res.status(200).json({message:reply});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}