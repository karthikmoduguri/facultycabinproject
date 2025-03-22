import { Router } from "express";
import {bookCabin,getFacultyBookings,updateBookingStatus,cancelBooking,getStudentBookings} from "../controllers/cabinbook.controller.js";
const router=Router();

router.post("/bookcabin",bookCabin);

router.get("/faculty/:facultyId", getFacultyBookings);

router.patch("/update/:bookingId", updateBookingStatus);

router.delete("/cancel/:bookingId", cancelBooking);

router.get("/student/:studentId", getStudentBookings);


export default router 