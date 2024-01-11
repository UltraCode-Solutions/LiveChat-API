import express from "express";
import { } from "./controller.js";

const router = express.Router();

router.get("/", getUsers); // importar del controller

   
export default router;
