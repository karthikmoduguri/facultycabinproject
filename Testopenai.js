import "dotenv/config";  // Load environment variables
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load API key from .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "babulake babu tag evaridhi telugu film industry lo:pawan kalyan de kada? :telugu mix english lo text ivvu";

const result = await model.generateContent(prompt);
console.log(result.response.text());