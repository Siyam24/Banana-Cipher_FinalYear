import React, { useState, useEffect } from 'react';

const GamePage = () => {
    const [questionImage, setQuestionImage] = useState(null); // Start with null
    const [answer, setAnswer] = useState(null);
    const [userAnswer, setUserAnswer] = useState(null);
    const [timer, setTimer] = useState(30);
    const [lives, setLives] = useState(3);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isAnswering, setIsAnswering] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

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
                setImageError(false);
            } else {
                setImageError(true);
            }
        } catch (error) {
            console.error("Error fetching question data:", error);
            setImageError(true);
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
        setUserAnswer(number);
        if (number === answer) {
            setScore(prev => prev + 1);
            fetchQuestion();
            setTimer(30);
        } else {
            handleIncorrectAnswer();
        }
    };

    const handleIncorrectAnswer = () => {
        setLives(prev => prev - 1);
        if (lives <= 1) {
            handleGameOver();
        }
    };

    const handleGameOver = () => {
        setGameOver(true);
    };

    const handleRestart = () => {
        setLives(3);
        setScore(0);
        setGameOver(false);
        setUserAnswer(null);
        fetchQuestion();
        setTimer(30);
    };

    const handleQuit = () => {
        console.log('Game quit!');
    };

    const renderLives = () => {
        return '❤️'.repeat(lives);
    };

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    return (
        <div className="game-page">
            {isPaused && (
                <div className="pause-overlay">
                    <h2>Game Paused</h2>
                    <button onClick={togglePause}>Resume</button>
                </div>
            )}
            {gameOver ? (
                <div className="game-over">
                    <h2>Game Over</h2>
                    <p>Your Score: {score}</p>
                    <p>Correct Answer: {answer}</p>
                    <button onClick={handleRestart}>Restart</button>
                    <button onClick={handleQuit}>Quit</button>
                </div>
            ) : (
                <div className={`game-content ${isPaused ? 'blur' : ''}`}>
                    <div className="game-header">
                        <div className="lives">Lives: {renderLives()}</div>
                        <div className="score">Score: {score}</div>
                        <div className="timer">Time: {timer}s</div>
                    </div>
                    <div className="question">
                        {imageError ? (
                            <p>Error loading image. Please try again later.</p>
                        ) : questionImage ? (
                            <img 
                                src={questionImage} 
                                alt="Question" 
                                onError={() => setImageError(true)} 
                            />
                        ) : (
                            <p>Loading question...</p>
                        )}
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
                        <button onClick={handleRestart}>Restart</button>
                        <button onClick={togglePause}>{isPaused ? "Resume" : "Pause"}</button>
                        <button onClick={handleQuit}>Quit</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GamePage;
