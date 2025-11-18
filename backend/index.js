require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: "Token missing" });

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Invalid token" });
      req.user = decoded;
      next();
    });
}

app.get("/", (req, res) => {
    res.send("WebTalk Backend is Running!");
});

app.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All input fields are required' });
        }

        const existingEmail = await prisma.user.findUnique({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword }
        });

        res.status(201).json({ message: 'Signup Successful', userId: user.id });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'All input fields are required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({ message: 'Login Successful', token });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

app.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
