import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleNewGame = () => {
    navigate("/game");
  };

  const handleViewLeaderBoard = () => {
    navigate("/leader-board");
  };

  return (
    <div className='container'>
      <h1>Welcome, {username || "Player"}!</h1>
      <div className='buttonContainer'>
        <button className='homeButton' onClick={handleNewGame}>New Game</button>
        <button className='homeButton' onClick={handleViewLeaderBoard}>Score!</button>
        <button className='homeButton' onClick={handleLogout}>Exit</button>
      </div>
    </div>
  );
};

export default Home;
