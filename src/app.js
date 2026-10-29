const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const studentsRouter = require('./routes/students');

dotenv.config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log(err.message));

app.get('/', (req, res) => {
    res.send('Student API is running!');
});

app.use('/students', studentsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});