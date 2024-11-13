import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from 'axios';
import styles from "./styles.module.css";

const Registration = () => {
  const [data, setData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
    setErrors({ ...errors, [input.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true); 

    try {
      const url = "http://localhost:3000/api/user/register";
      const response = await axios.post(url, data);
      console.log(response.data.message);
      navigate("/login");
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setServerError(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={`${styles['form-box']} ${styles.register}`}>
        <form onSubmit={handleSubmit}>
          <h1>Create Your Banana Cipher Account</h1>

          <div className={styles['input-box']}>
            <input
              type="text"
              placeholder='Username'
              required
              name='userName'
              value={data.userName}
              onChange={handleChange}
            />
            <FaUser className={styles.icon} />
          </div>

          <div className={styles['input-box']}>
            <input
              type="email"
              placeholder='Email Address'
              required
              name='email'
              value={data.email}
              onChange={handleChange}
              autoComplete="email"
            />
            <MdEmail className={styles.icon} />
          </div>

          <div className={styles['input-box']}>
            <input
              type="password"
              placeholder='Password'
              required
              name='password'
              value={data.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <FaLock className={styles.icon} />
          </div>

          <div className={styles['input-box']}>
            <input
              type="password"
              placeholder='Confirm Password'
              required
              name='confirmPassword'
              value={data.confirmPassword}
              autoComplete="new-password"
              onChange={handleChange}
            />
            <FaLock className={styles.icon} />
          </div>

          <div className={styles['remember-forgot']}>
            <label>
              <input type="checkbox" required /> I accept the <a href="#">Terms & Conditions</a>
            </label>
          </div>

          {serverError && <div className={styles['error-message']}>{serverError}</div>}
          {errors.userName && <div className={styles['error-message']}>{errors.userName}</div>}
          {errors.email && <div className={styles['error-message']}>{errors.email}</div>}
          {errors.password && <div className={styles['error-message']}>{errors.password}</div>}
          {errors.confirmPassword && <div className={styles['error-message']}>{errors.confirmPassword}</div>}
          
          <button type="submit" disabled={loading}>
            {loading ? "Creating Your Account..." : "Sign Up"}
          </button>
          
          <div className={styles['register-link']}>
            <p>Already have an account? <a href="/login">Sign in</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;