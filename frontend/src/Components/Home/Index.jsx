import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './homeStyles.module.css';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    //window.location.reload();
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <button className={styles.homeButton}>New Game</button>
        <button className={styles.homeButton}>Score!</button>
        <button className={styles.homeButton} onClick={handleLogout}>Exit</button>
      </div>
    </div>
  );
};

export default Home;
