const express = require('express');
const fs = require('fs').promises;
const app = express();
app.use(express.json());

const jsonFileName = 'data.json'; // JSON file name

// GET /readFile Endpoint
app.get('/readFile', async (req, res) => {
    try {
        const jsonData = await fs.readFile(jsonFileName, 'utf8');
        res.send(JSON.parse(jsonData));
    } catch (error) {
        res.status(404).send('File not found or could not be read.');
    }
});

// POST /writeFile Endpoint
app.post('/writeFile', async (req, res) => {
    const data = req.body;
    try {
        if (!data) throw new Error('No data provided.');
        await fs.writeFile(jsonFileName, JSON.stringify(data, null, 2));
        res.send('File written successfully.');
    } catch (error) {
        res.status(400).send(error.message);
    }
});


// PUT /updateFile Endpoint
app.put('/updateFile', async (req, res) => {
    const newData = req.body;
    try {
        if (!newData) throw new Error('No new data provided.');

        const jsonData = await fs.readFile(jsonFileName, 'utf8');
        const existingData = JSON.parse(jsonData);

        existingData.message += `\n${newData.message}`;

        await fs.writeFile(jsonFileName, JSON.stringify(existingData, null, 2));
        res.send('File updated successfully.');
    } catch (error) {
        res.status(400).send(error.message);
    }
});



// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = 200;
app.listen(PORT, async () => {
    try {
        await fs.access(jsonFileName);
        console.log(`Server running on port http://localhost:${PORT}`);
    } catch (error) {
        console.error('File not found or could not be accessed.');
    }
});


