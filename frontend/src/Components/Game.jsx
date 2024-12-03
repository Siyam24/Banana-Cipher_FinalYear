import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const GamePage = () => {
    const [questionImage, setQuestionImage] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [userAnswer, setUserAnswer] = useState(null);
    const [timer, setTimer] = useState(30);
    const [lives, setLives] = useState(3);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isAnswering, setIsAnswering] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [showQuitOverlay, setShowQuitOverlay] = useState(false);
    const [showRestartOverlay, setShowRestartOverlay] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [feedbackType, setFeedbackType] = useState("");

    const navigate = useNavigate();

    const fetchQuestion = async () => {
        try {
            setIsAnswering(true);
            const response = await fetch('http://localhost:3000/api/question');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.question && data.solution !== undefined) {
                setQuestionImage(data.question);
                setAnswer(data.solution);
            }
        } catch (error) {
            console.error("Error fetching question data:", error);
        } finally {
            setIsAnswering(false);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, []);

    useEffect(() => {
        if (timer > 0 && !gameOver && !isAnswering && !isPaused) {
            const countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(countdown);
        } else if (timer === 0 && !gameOver) {
            handleGameOver();
        }
    }, [timer, gameOver, isAnswering, isPaused]);

    const handleAnswerClick = (number) => {
        setFeedback("");
        setFeedbackType("");

        setUserAnswer(number);

        if (number === answer) {
            setScore(prev => prev + 10);
            setFeedback("🎉 Excellent! You nailed it! Ready for the next challenge?");
            setFeedbackType("correct");
            confetti();
            fetchQuestion();
            setTimer(30);
        } else {
            setFeedback("❌ Oops! That wasn't the right answer. Keep trying!");
            setFeedbackType("wrong");
            handleIncorrectAnswer();
        }

        setTimeout(() => {
            setFeedback("");
            setFeedbackType("");
        }, 2000);
    };

    const handleIncorrectAnswer = () => {
        setLives(prev => prev - 1);
        if (lives <= 1) {
            handleGameOver();
        }
    };

    const handleGameOver = async () => {
        setGameOver(true);
        const userName = localStorage.getItem("username");

        if (!userName || typeof score !== 'number') {
            console.error("Invalid data:", { userName, score });
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3000/api/update-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, score }),
            });
    
            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorMessage.error}`);
            }
    
            const data = await response.json();
            console.log("Score updated successfully:", data);
        } catch (error) {
            console.error("Error updating score:", error);
        }
    };

    const handleRestart = () => {
        setIsPaused(true);
        setShowRestartOverlay(true);
    };

    const handleConfirmRestart = () => {
        setLives(3);
        setScore(0);
        setGameOver(false);
        setUserAnswer(null);
        setFeedback("");
        setFeedbackType("");
        fetchQuestion();
        setTimer(30);
        setIsPaused(false);
        setShowRestartOverlay(false);
    };

    const handleCancelRestart = () => {
        setShowRestartOverlay(false);
        setIsPaused(false);
    };

    const handleQuit = () => {
        setIsPaused(true);
        setShowQuitOverlay(true);
    };

    const handleLeave = () => {
        navigate('/home');
    };

    const handleStay = () => {
        setIsPaused(false);
        setShowQuitOverlay(false);
    };

    const renderLives = () => {
        return '❤️'.repeat(lives);
    };

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    return (
        <div className="game-page">
            {isPaused && !showQuitOverlay && !showRestartOverlay && (
                <div className="pause-overlay">
                    <h2>Game Paused!</h2>
                    <button onClick={togglePause}>Resume</button>
                </div>
            )}
            {showQuitOverlay && (
                <div className="quit-overlay">
                    <h2>Are you sure you want to quit?</h2>
                    <button onClick={handleLeave}>Leave</button>
                    <button onClick={handleStay}>Stay</button>
                </div>
            )}
            {showRestartOverlay && (
                <div className="quit-overlay">
                    <h2>Are you sure you want to restart?</h2>
                    <button onClick={handleConfirmRestart}>Yes</button>
                    <button onClick={handleCancelRestart}>No</button>
                </div>
            )}
            {gameOver ? (
                <div className="game-over">
                <h1 className="game-over-title">Game Over</h1>
                <p className="game-over-score">🎯 Your Final Score: <strong>{score}</strong></p>
                <p className="game-over-answer">📖 Correct Answer: <strong>{answer}</strong></p>
                <div className="game-over-actions">
                    <button className="game-over-btn" onClick={handleConfirmRestart}>
                        🔄 Restart
                    </button>
                    <button className="game-over-btn quit-btn" onClick={handleLeave}>
                        🚪 Quit
                    </button>
                </div>
            </div>
            ) : (
                <div className={`game-content ${isPaused ? 'blur' : ''}`}>
                    <div className="game-header">
                        <div className="lives">Lives: {renderLives()}</div>
                        <div className="score">Score: {score}</div>
                        <div className="timer">Time: {timer}s</div>
                    </div>
                    <div className="question">
                        {questionImage ? (
                            <img
                                src={questionImage}
                                alt="Question"
                            />
                        ) : (
                            <p>Loading question...</p>
                        )}
                    </div>
                    <div className={`feedback ${feedbackType}`}>
                        <p>{feedback}</p>
                    </div>
                    <div className="answers">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
                            <button
                                key={number}
                                onClick={() => handleAnswerClick(number)}
                                disabled={isAnswering || isPaused}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                    <div className="game-controls">
                        <button onClick={handleQuit}>Quit</button>
                        <button onClick={togglePause}>{isPaused ? "Resume" : "Pause"}</button>
                        <button onClick={handleRestart}>Restart</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GamePage;
