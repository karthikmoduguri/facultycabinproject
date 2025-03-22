import { Router } from "express";
import { addDepartment,deleteDepartment,getAllDepartments,getFacultiesByDepartment } from "../controllers/department.controller.js";
const router=Router();

router.post("/add",addDepartment);
router.get("/all",getAllDepartments);
router.delete("/delete/:code",deleteDepartment);
router.get("/faculties/:code",getFacultiesByDepartment);
export default router