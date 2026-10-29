const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret_key';

let users = [];

// Home Route
app.get('/', (req, res) => {
    res.send('Authentication API is running');
});

// Task 1: User Registration
app.post('/auth/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: 'username and password are required'
        });
    }

    if (users.find(u => u.username === username)) {
        return res.status(409).json({
            error: 'username already exists'
        });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    users.push({
        username,
        passwordHash
    });

    res.status(201).json({ username });
});

// Task 2: Login and JWT Issuance
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);

    if (!user || !bcrypt.compareSync(password || '', user.passwordHash)) {
        return res.status(401).json({
            error: 'Invalid credentials'
        });
    }

    const token = jwt.sign(
        { username },
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.json({ token });
});

// Task 3: Authentication Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: 'Access token required'
        });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({
                error: 'Invalid or expired token'
            });
        }

        req.user = user;
        next();
    });
}

// Protected Profile Route
app.get('/profile', authenticateToken, (req, res) => {
    res.json({
        message: 'Access granted',
        user: req.user
    });
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000');
});