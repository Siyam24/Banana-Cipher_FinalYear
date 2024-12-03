import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from "./styles.module.css";

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Check if user is already logged in and redirect
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/home"); // Redirect to home if already logged in
        }
    }, [navigate]);

    // Check if Remember Me is selected and load email
    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setData((prevData) => ({ ...prevData, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
        setErrors({ ...errors, [input.name]: "" });
    };

    const handleCheckboxChange = () => {
        setRememberMe(!rememberMe);
        if (!rememberMe) {
            localStorage.setItem("rememberedEmail", data.email);
        } else {
            localStorage.removeItem("rememberedEmail");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = "http://localhost:3000/api/user/login";
            const { data: res } = await axios.post(url, data);

            // Save token and username to localStorage
            localStorage.setItem("token", res.token);
            localStorage.setItem("username", res.userName);

            // Redirect to home page
            navigate("/home");
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const message =
                    status === 401
                        ? "Invalid email or password."
                        : status === 500
                        ? "Server error. Please try again later."
                        : "An unexpected error occurred.";
                setErrors({ ...errors, message });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={`${styles['form-box']} ${styles.login}`}>
                <form onSubmit={handleSubmit}>
                    <h1>Welcome to Banana Cipher!</h1>

                    <div className={styles['input-box']}>
                        <input
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                        />
                        <FaUser className={styles.icon} />
                    </div>

                    <div className={styles['input-box']}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            name="password"
                            value={data.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />
                        {!data.password && <FaLock className={styles.icon} />}
                        {data.password && (
                            <div className={styles['eye-icon']} onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        )}
                    </div>

                    <div className={styles['remember-forgot']}>
                        <label>
                            <input type="checkbox" checked={rememberMe} onChange={handleCheckboxChange} />
                            Remember Me
                        </label>
                        <a href="#">Forgot Password?</a>
                    </div>

                    {errors.message && (
                        <div className={styles['error-message']}>
                            <p>{errors.message}</p>
                        </div>
                    )}

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                    </button>

                    <div className={styles['register-link']}>
                        <p>Don't have an account? <a href="/register">Sign Up</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
