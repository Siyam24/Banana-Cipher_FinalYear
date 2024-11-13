import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import User from "../models/user.js";

const loginUser = async (req, res) =>{
    try {
        const { error } = validate(req.body);
		if (error){
            return res.status(400).send({ message: error.details[0].message });
        }	

		const user = await User.findOne({ email: req.body.email });
		if (!user){
			return res.status(401).send({ message: "Invalid Email or Password" });
        }

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword){
			return res.status(401).send({ message: "Invalid Email or Password" });
        }

		const token = jwt.sign({ _id: user._id }, process.env.JWT_PRIVATEKEY, { expiresIn: "7d" });
		res.status(200).send({ data: token, message: "logged in successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

export default loginUser;