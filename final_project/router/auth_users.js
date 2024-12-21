// auth_users.js
const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('../booksdb.js');
const regd_users = express.Router();

let users = []; // Example user database

const isValid = (username) => {
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (!isValid(username)) {
        return res.status(404).json({ message: "Username not found" });
    }
    if (!authenticatedUser(username, password)) {
        return res.status(403).json({ message: "Invalid username or password" });
    }
    
    const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
    res.status(200).json({ message: "Login successful", token });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
    if (!token) {
        return res.status(401).json({ message: "No token provided, please login first." });
    }

    try {
        const decoded = jwt.verify(token, 'secret_key');
        const book = books[isbn];
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        book.reviews[decoded.username] = review;
        res.status(200).json({ message: "Review added/updated successfully", book });
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
