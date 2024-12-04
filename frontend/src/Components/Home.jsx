import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGamepad, FaListUl, FaSignOutAlt } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    const fetchTime = async () => {
      try {
        const response = await fetch("http://worldtimeapi.org/api/timezone/America/New_York");
        //http://worldtimeapi.org/api/timezone/Europe/London
        const data = await response.json();
        
        const currentTime = new Date(data.datetime);
        const hour = currentTime.getHours();

        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 18) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");
      } catch (error) {
        console.error("Error fetching time:", error);
        setGreeting("Hello");
      } finally {
        setLoading(false);
      }
    };

    fetchTime();
  }, [navigate]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/login");
    }
  };
  

  const handleNewGame = () => {
    navigate("/game");
  };

  const handleViewLeaderBoard = () => {
    navigate("/leader-board");
  };

  return (
    <div className="container">
      {loading ? (
        <h1 className="greeting">Loading...</h1>
      ) : (
        <h1 className="greeting">
          {greeting}, <span className="username">{username || "Player"}!</span>
        </h1>
      )}
      <div className="buttonContainer">
        <button className="homeButton" onClick={handleNewGame}>
          <FaGamepad style={{ marginRight: "15px" }} />
          New Game
        </button>
        <button className="homeButton" onClick={handleViewLeaderBoard}>
          <FaListUl style={{ marginRight: "15px" }} />
          Score-Board
        </button>
        <button className="homeButton" onClick={handleLogout}>
          <FaSignOutAlt style={{ marginRight: "15px" }} />
          Exit
        </button>
      </div>
    </div>
  );
};

export default Home;
