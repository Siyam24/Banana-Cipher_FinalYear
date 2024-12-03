import User from '../models/user.js';

const getLeaderBoard = async (req, res) => {
    try {
        const users = await User.find({}, { userName: 1, score: 1, _id: 0 })
            .sort({ score: -1 });

        // Return the sorted data
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};

export default getLeaderBoard;
