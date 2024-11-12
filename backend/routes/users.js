import express from "express";
import registerUser from "../controllers/register.js";
import loginUser from "../controllers/login.js";

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);

export default router;