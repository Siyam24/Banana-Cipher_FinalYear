import express from "express";
import registerUser from "../controllers/register.js";
import loginUser from "../controllers/login.js";
import questionData from "../controllers/apiQuestion.js";

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get('/question', questionData);

export default router;