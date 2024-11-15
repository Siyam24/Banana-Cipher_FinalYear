import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LeaderBoard = () => {
    const [leaderBoardData, setLeaderBoardData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);

    const fetchLeaderBoardData = async () => {
        try {
            // Demo data for testing
            const demoData = [
                { username: 'Siyam', bestScore: 150 },
                { username: 'Sham', bestScore: 140 },
                { username: 'Dilu', bestScore: 130 },
                { username: 'Nitie', bestScore: 120 },
                { username: 'Virat', bestScore: 110 },
                { username: 'Siyam2', bestScore: 100 },
                { username: 'Sham2', bestScore: 90 },
                { username: 'Dilu2', bestScore: 80 },
                { username: 'Nitie2', bestScore: 70 },
                { username: 'Virat2', bestScore: 60 }
            ];
            setLeaderBoardData(demoData);
            setFilteredData(demoData);
        } catch (error) {
            console.error("Error fetching leaderBoard data:", error);
            setError("Unable to load leaderBoard data. Please try again later.");
        }
    };

    useEffect(() => {
        fetchLeaderBoardData();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = leaderBoardData.filter((player) =>
            player.username.toLowerCase().includes(query)
        );
        setFilteredData(filtered);
    };

    return (
        <div className="leaderBoard-page">
            <h1 className="game-title">BANANA 🍌 CIPHER</h1>
            <h2>LeaderBoard</h2>

            <input
                type="text"
                className="search-bar"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={handleSearch}
            />

            {error ? (
                <p>{error}</p>
            ) : (
                <table className="leaderBoard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            <th>Best Score</th>
                        </tr>
                    </thead>
                    <tbody className="scrollable-tbody">
                        {filteredData.map((player, index) => (
                            <tr key={`${player.username}-${index}`}>
                                <td>{index + 1}</td>
                                <td>{player.username}</td>
                                <td>{player.bestScore}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className="button-container">
                <Link to="/home" className="back-button">Back</Link>
                <Link to="/game" className="play-now-button">Play Now</Link>
            </div>
        </div>
    );
};

export default LeaderBoard;
