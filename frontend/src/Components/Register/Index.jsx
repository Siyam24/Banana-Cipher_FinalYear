import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
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
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

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
              type={showPassword ? "text" : "password"}
              placeholder='Password'
              required
              name='password'
              value={data.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {!data.password && <FaLock className={styles.icon} />}
            {data.password && (
              <div className={styles['eye-icon']} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            )}
          </div>

          <div className={styles['input-box']}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder='Confirm Password'
              required
              name='confirmPassword'
              value={data.confirmPassword}
              autoComplete="new-password"
              onChange={handleChange}
            />
            {!data.confirmPassword && <FaLock className={styles.icon} />}
            {data.confirmPassword && (
              <div className={styles['eye-icon']} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            )}
          </div>

          <div className={styles['remember-forgot']}>
            <label>
              <input type="checkbox" required /> I accept the <a href="#">Terms & Conditions</a>
            </label>
          </div>

          <div className={styles['error-message']}>
            {[serverError, errors.userName, errors.email, errors.password, errors.confirmPassword].map(
              (error, index) =>
                error && <div key={index} className='error-message'>{error}</div>
            )}
          </div>
          
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
