import express from "express";
import { createUser, loginUser } from "./controller.js";
import { bodyCleaner } from "../../../middlewares/bodyCleaner.js";
const router = express.Router();

router.post("/register", createUser);
router.post("/login", bodyCleaner('email', 'password'), loginUser);

   
export default router;
