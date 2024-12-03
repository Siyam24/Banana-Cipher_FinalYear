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

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/home");
        }
    }, [navigate]);

    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setData((prev) => ({ ...prev, email: savedEmail }));
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
            localStorage.setItem("token", res.data);
            localStorage.setItem("username", res.userName);
            window.location = "/home";
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setErrors({ ...errors, message: error.response.data.message });
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
                            placeholder='Email Address' 
                            name='email'
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
                            placeholder='Password'
                            required
                            name='password'
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
                        <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
                    </div>

                    {errors.message && <div className={styles['error-message']}>{errors.message}</div>}

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
