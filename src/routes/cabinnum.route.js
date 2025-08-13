import { Router } from "express";

import {addcabin,getcabinnum} from "../controllers/cabinnum.controller.js";


const router=Router();

router.post("/addcabin",addcabin);
router.post("/getcabinnum/:facultyId",getcabinnum);

export default router;