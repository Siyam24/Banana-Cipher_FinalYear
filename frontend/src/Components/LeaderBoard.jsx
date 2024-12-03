import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LeaderBoard = () => {
    const [leaderBoardData, setLeaderBoardData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);

    const fetchLeaderBoardData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/leaderboard');
            if (!response.ok) {
                throw new Error('Failed to fetch leaderboard data');
            }

            const data = await response.json();

            const sortedData = data.users;
            setLeaderBoardData(sortedData);
            setFilteredData(sortedData);
        } catch (error) {
            console.error("Error fetching leaderboard data:", error);
            setError("Unable to load leaderboard data. Please try again later.");
        }
    };

    useEffect(() => {
        fetchLeaderBoardData();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = leaderBoardData.filter((player) =>
            player.userName.toLowerCase().includes(query)
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
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody className="scrollable-tbody">
                        {filteredData.map((player) => {
                            const originalRank =
                                leaderBoardData.findIndex((p) => p.userName === player.userName) + 1;

                            return (
                                <tr key={`${player.userName}-${originalRank}`}>
                                    <td>{originalRank}</td>
                                    <td>{player.userName}</td>
                                    <td>{player.score}</td>
                                </tr>
                            );
                        })}
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