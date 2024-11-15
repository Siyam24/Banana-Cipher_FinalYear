import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
        localStorage.removeItem("token");
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
      <div className='buttonContainer'>
        <button className='homeButton' onClick={handleNewGame}>New Game</button>
        <button className='homeButton' onClick={handleViewLeaderBoard}>Score!</button>
        <button className='homeButton' onClick={handleLogout}>Exit</button>
      </div>
    </div>
  );
};

export default Home;
