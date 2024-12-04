import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import sendMail from "../middleware/sendMail.js";
import dotenv from "dotenv";

dotenv.config();

const registerUser = async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const existingUserName = await User.findOne({ userName: req.body.userName });
        if (existingUserName) {
            return res.status(409).send({ message: "User with given user name already exists!" });
        }

        const existingUserMail = await User.findOne({ email: req.body.email });
        if (existingUserMail) {
            return res.status(409).send({ message: "User with given email already exists!" });
        }

        const hashPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({ ...req.body, password: hashPassword });
        await user.save();

        const token = jwt.sign({ _id: user._id }, process.env.JWT_PRIVATEKEY, { expiresIn: "7d" });


        await sendMail(
            req.body.email,
            "Welcome to Banana Cipher Game!",
            `Hello ${req.body.userName},\n\nWelcome to our quiz game! Your account has been successfully created.\n\nEnjoy playing!\n\nBest regards,\nThe Game Team.`
        );

        res.status(201).send({ data: token, message: "User created successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};

const validateUser = (data) => {
    const schema = Joi.object({
        userName: Joi.string().required().label("User Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        confirmPassword: Joi.string().required().label("Confirm Password")
            .valid(Joi.ref("password")).messages({
                "any.only": '"Confirm Password" must match "Password"',
            }),
    });

    return schema.validate(data);
};

export default registerUser;
