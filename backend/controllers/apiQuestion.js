import fetch from 'node-fetch';

const questionData = async (req, res) => {
    try {
        const response = await fetch('https://marcconrad.com/uob/banana/api.php?out=json');
 
        if (!response.ok) {
            throw new Error(`Failed to fetch, status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.question && data.solution !== undefined) {
            res.json(data);
        } else {
            throw new Error('Invalid data structure received from the API');
        }
    } catch (error) {
        console.error('Error fetching question data:', error);
        res.status(500).json({ error: `Failed to fetch data: ${error.message}` });
    }
};

export default questionData;
