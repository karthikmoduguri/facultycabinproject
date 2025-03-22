import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { User } from "../models/user.model.js";
import{CabinBooking} from "../models/cabinbooking.model.js";
import { TimeTable } from "../models/timetable.model.js";
import { Cabin } from "../models/cabinnum.model.js";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const askChatbot = async (req, res) => {
    try {
        const { query } = req.body; // Student's question

        // 1️⃣ Fetch Data from Database (Optimized)
        const [users, bookings, timetables, cabins] = await Promise.all([
            User.find({}), // Get all users (faculty & students)
            CabinBooking.find({}).populate("studentId facultyId", "name email"),
            TimeTable.find({}).populate("facultyId", "name email"),
            Cabin.find({}).populate("facultyId", "name email")
        ]);

        // 2️⃣ Organize Data for Chatbot
        const contextData = {
            faculty: users
                .filter(user => user.role === "faculty")
                .map(f => ({
                    name: f.name,
                    email: f.email,
                    department: f.department
                })),
            students: users
                .filter(user => user.role === "student")
                .map(s => ({
                    name: s.name,
                    regno: s.regno,
                    batch: s.batch
                })),
            bookings: bookings.map(b => ({
                student: b.studentId.name,
                faculty: b.facultyId.name,
                status: b.status,
                date: b.date.toISOString().split("T")[0],
                timeSlot: b.timeSlot
            })),
            timetable: timetables.map(t => ({
                faculty: t.facultyId.name,
                schedule: t.week
            })),
            cabins: cabins.map(c => ({
                faculty: c.facultyId.name,
                cabinNo: c.cabinNo,
                floorNo: c.floorNo
            }))
        };

        // 3️⃣ Send Query + Data to Gemini AI
        const prompt = `Student asked: "${query}". Here is the latest data: ${JSON.stringify(contextData)}. 
        Please provide an accurate response based on this information.`;

        const result = await model.generateContent(prompt);

        // 4️⃣ Send Response to Student
        res.json({ response: result.response.text() });

    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};