const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to Task Management API');
});

module.exports = router;