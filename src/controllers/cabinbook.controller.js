import { User } from "../models/user.model.js";
import{CabinBooking} from "../models/cabinbooking.model.js";
import { io } from "../index.js";
import { TimeTable } from "../models/timetable.model.js";

/** 📌 Student Books a Cabin */
// export const bookCabin = async (req, res) => {
//     try {
//         const { studentId, facultyId, date, timeSlot } = req.body;

//         // Check if student exists
//         const student = await User.findOne({ _id: studentId, role: "student" });
//         if (!student) {
//             return res.status(404).json({ success: false, message: "Student not found" });
//         }

//         // Check if faculty exists
//         const faculty = await User.findOne({ _id: facultyId, role: "faculty" });
//         if (!faculty) {
//             return res.status(404).json({ success: false, message: "Faculty not found" });
//         }

//         // Check if the slot is already booked
//         const existingBooking = await CabinBooking.findOne({ facultyId, date, timeSlot });
//         if (existingBooking) {
//             return res.status(400).json({ success: false, message: "Time slot already booked" });
//         }

//         // Create new booking
//         const booking = new CabinBooking({ studentId, facultyId, date, timeSlot });
//         await booking.save();
//         io.emit("newBooking", { studentId, facultyId, date, timeSlot });
//         return res.status(201).json({ success: true, message: "Cabin booked successfully", booking });
//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

export const bookCabin = async (req, res) => {
    try {
        const { studentId, facultyId, date, timeSlot } = req.body;

        // Check if student exists
        const student = await User.findOne({ _id: studentId, role: "student" });
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // Check if faculty exists
        const faculty = await User.findOne({ _id: facultyId, role: "faculty" });
        if (!faculty) {
            return res.status(404).json({ success: false, message: "Faculty not found" });
        }

        // Fetch faculty timetable
        const facultyTimetable = await TimeTable.findOne({ facultyId });

        if (!facultyTimetable) {
            return res.status(400).json({ success: false, message: "Faculty timetable not found" });
        }

        // Extract the weekday from the date
        const weekday = new Date(date).toLocaleString("en-US", { weekday: "long" }).toLowerCase();
        console.log(weekday);
        // Get schedule for the requested weekday
        const facultySchedule = facultyTimetable.week?.[weekday] || [];

        // Check if the requested time slot is an "INCLASS" period
        const inClassPeriod = facultySchedule.find(period => period.time === timeSlot && period.status === "INCLASS");

        if (inClassPeriod) {
            return res.status(206).json({ success: true, message: "Cannot book during class hours please choose another time slot" });
        }

        const existingBookings = await CabinBooking.countDocuments({ facultyId, date, timeSlot });
        if (existingBookings >= 3) {
            return res.status(400).json({ success: false, message: "Slot is full (3 students max)" });
        }

        // Create new booking
        const booking = new CabinBooking({ studentId, facultyId, date, timeSlot });
        await booking.save();
        io.emit("newBooking", { studentId, facultyId, date, timeSlot });

        return res.status(201).json({ success: true, message: "Cabin booked successfully", booking });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


/** 📌 Faculty Views All Bookings */
export const getFacultyBookings = async (req, res) => {
    try {
        const { facultyId } = req.params;

        // Check if faculty exists
        const faculty = await User.findOne({ _id: facultyId, role: "faculty" });
        if (!faculty) {
            return res.status(404).json({ success: false, message: "Faculty not found" });
        }

        // Get all bookings for faculty
        const bookings = await CabinBooking.find({ facultyId }).populate({
    path: "studentId",
   select: "name regno batch section semester"
  });
        // console.log(bookings);

        return res.status(200).json({ success: true, bookings });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/** 📌 Faculty Approves or Rejects Booking */
export const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        // Find and update booking
        const booking = await CabinBooking.findByIdAndUpdate(
            bookingId, 
            { status },
            { new: true }
        ).populate("studentId", "username");
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }
        console.log(booking.studentId._id.toString());
        if (io) {
            console.log("Emitting u event");
            io.to(booking.studentId._id.toString()).emit("updateBookingStatus", {
                bookingId: booking._id,
                status: booking.status,
                faculty: booking.facultyId,
                message: `Your booking has been ${status}.`
            });
        }
        return res.status(200).json({ success: true, message: `Booking ${status.toLowerCase()} successfully`, booking });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        // Find booking by ID
        const booking = await CabinBooking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        // Check if the booking is still pending
        if (booking.status !== "Pending") {
            return res.status(400).json({ success: false, message: "Only pending bookings can be canceled" });
        }

        // Delete the booking
        await CabinBooking.findByIdAndDelete(bookingId);

        // Emit real-time event to notify faculty
        io.emit("bookingCancelled", { bookingId, studentId: booking.studentId });

        return res.status(200).json({
            success: true,
            message: "Booking canceled successfully",
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};




export const getStudentBookings = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Fetch all bookings made by the student
        const bookings = await CabinBooking.find({ studentId })
            .populate("facultyId", "username") // Get faculty name
            .sort({ date: 1 }); // Sort by date

        if (!bookings.length) {
            return res.status(404).json({ success: false, message: "No bookings found" });
        }

        return res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: bookings
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};