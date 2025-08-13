import dotenv from "dotenv";
import connectdb from "./db/index.js";
import { app } from "./app.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config({
    path: "./env"
});

// Create HTTP server and attach Express app
const server = http.createServer(app);

// Initialize Socket.IO at the top
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for now
        methods: ["GET", "POST"]
    }
});

// Export io so it can be used in controllers
export { io };

// Connect to MongoDB and start the server
connectdb()
    .then(() => {
        const PORT = process.env.PORT || 3000;

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        // Handle WebSocket connections
        io.on("connection", (socket) => {
            console.log(`User connected: ${socket.id}`);

            socket.on("newBooking", (data) => {
                console.log("New booking:", data);
                io.emit("bookingUpdate", data); 
            });

            socket.on("updateBookingStatus", (data) => {
                console.log("Booking status updated:", data);
                io.emit("statusUpdate", data);
            });

            socket.on("bookingCancelled", (data) => {
                console.log("Booking cancelled:", data);
                io.emit("facultyBookingCancelled", data);
            });

            socket.on("joinStudent", (studentId) => {
                socket.join(studentId);
                console.log(`Student ${studentId} joined`);
            });

            socket.on("disconnect", () => {
                console.log(`User disconnected: ${socket.id}`);
            });
        });

    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });

export { server };
