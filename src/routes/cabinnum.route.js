import { Router } from "express";

import {addcabin} from "../controllers/cabinnum.controller.js";


const router=Router();

router.post("/addcabin",addcabin);


export default router;