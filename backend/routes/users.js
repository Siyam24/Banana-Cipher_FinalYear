import express from "express";
import registerUser from "../controllers/register.js";
import loginUser from "../controllers/login.js";
import questionData from "../controllers/apiQuestion.js";
import updateScore from "../controllers/score.js";

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get('/question', questionData);
router.post('/update-score', updateScore);

export default router;