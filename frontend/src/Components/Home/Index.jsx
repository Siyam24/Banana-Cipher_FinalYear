import React from 'react';
import styles from './homeStyles.module.css';

const Home = () => {
  return (
    <div>
      <div className={styles.buttonContainer}>
        <button className={styles.homeButton}>New Game</button>
        <button className={styles.homeButton}>Score!</button>
        <button className={styles.homeButton}>Exit</button>
      </div>
    </div>
  );
};

export default Home;
