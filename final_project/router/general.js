// general.js
const express = require('express');
const books = require('../booksdb.js');
const public_users = express.Router();

public_users.get('/', (req, res) => {
    res.status(200).json(books);
});

public_users.get('/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
});

public_users.get('/author/:author', (req, res) => {
    const { author } = req.params;
    const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
    if (booksByAuthor.length === 0) {
        return res.status(404).json({ message: "No books found by this author" });
    }
    res.status(200).json(booksByAuthor);
});

public_users.get('/title/:title', (req, res) => {
    const { title } = req.params;
    const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
    if (booksByTitle.length === 0) {
        return res.status(404).json({ message: "No books found with this title" });
    }
    res.status(200).json(booksByTitle);
});

public_users.get('/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book.reviews);
});

module.exports.general = public_users;
