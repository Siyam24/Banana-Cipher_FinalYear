import User from '../models/user.js';

const updateScore = async (req, res) => {
    const { userName, score } = req.body;

    if (!userName || typeof score !== 'number') {
        return res.status(400).json({ error: 'Invalid username or score' });
    }

    try {
        const user = await User.findOne({ userName });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (score > user.score) {
            user.score = score;
            await user.save();
            return res.status(200).json({ message: 'Score updated successfully'});
        }

        res.status(200).json({ message: 'No update needed, score is lower or equal' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update score' });
    }
};

export default updateScore;
