import { Router } from "express";
import { addUser, adminlogin, deleteUser } from "../controllers/admin.controller.js";
import { admin, protect } from "../middlewares/genauth.middlewares.js";
import { addmultipleuser } from "../controllers/addmultiplestudents.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
const router = Router();

router.post("/login",adminlogin);

router.post("/add-user",protect,admin,addUser);
router.post("/delete-user/:id?",protect,admin,deleteUser);
router.post("/multiple-user",protect,admin,upload.single("file"),addmultipleuser);

export default router 