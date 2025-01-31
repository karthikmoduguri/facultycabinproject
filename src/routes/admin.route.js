import { Router } from "express";
import { addUser, adminlogin, deleteUser } from "../controllers/admin.controller.js";
import { admin, protect } from "../middlewares/genauth.middlewares.js";
const router = Router();

router.post("/login",adminlogin);

router.post("/add-user",protect,admin,addUser);
router.post("/delete-user/:id",protect,admin,deleteUser);

export default router 