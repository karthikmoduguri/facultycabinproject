import { Router } from "express";

import {gettimetable} from "../controllers/gettimetable.controller.js"
import { addTimeTable } from "../controllers/timetableadd.controller.js";

const router=Router();

router.post("/addtimetable",addTimeTable);
router.get("/gettimetable/:facultyId",gettimetable);

export default router;