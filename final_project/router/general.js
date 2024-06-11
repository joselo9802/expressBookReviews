const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password, firstName, lastName, DOB } = req.body;
    if (!username || !password || !firstName || !lastName || !DOB) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (isValid(username)) {
        return res.status(400).send({ message: "This user already exists" })
    } else {
        users.push({
            "firstName": firstName,
            "lastName": lastName,
            "username": username,
            "password": password,
            "DOB": DOB
        })

        return res.status(201).send("H, " + firstName + ", your user's account has been created successfully");
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(300).send(JSON.stringify({ books }, null, 4));
});

// Get the book list available in the shop by Promises
// public_users.get('/', async function (req, res) {
//     new Promise((resolve, rejected) => {
//         resolve(res.send(JSON.stringify({ books }, null, 4)));
//     }).catch(() => res.status(500).json({ message: "Error in the process" }));
// })

// // Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params;
    let filtered_books = books[isbn] ? books[isbn] : [];
    if (filtered_books.length === 0) {
        return res.status(404).json({ message: "Book not found" });
    } else {
        return res.status(300).send(JSON.stringify({ filtered_books }, null, 4));
    }
});

// Get book details based on ISBN by Promises
// public_users.get('/isbn/:isbn', function (req, res) {
//     const { isbn } = req.params;
//     new Promise((resolve, rejected) => {
//         let filtered_books = books[isbn] ? books[isbn] : [];
//         if (filtered_books.length === 0) {
//             resolve(res.status(404).json({ message: "Book not found" }));
//         } else {
//             resolve(res.status(300).send(JSON.stringify({ filtered_books }, null, 4)));
//         }
//     }).catch(() => res.status(500).json({ message: "Error in the process" }));
// });

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const { author } = req.params;
    const books_list = JSON.stringify(books)
    const books_list_array = JSON.parse(books_list)
    const books_match = Object.keys(books_list_array).filter(key => books_list_array[key].author.split(" ").includes(author))
    const filtered_books = books_match.map(isbn => books_list_array[isbn])
    if (filtered_books.length === 0) {
        return res.status(404).json({ message: "Book(s) not found" });
    } else {
        return res.status(300).send(JSON.stringify({ filtered_books }, null, 4));
    }
});

// Get book details based on authorby Promises
// public_users.get('/author/:author', function (req, res) {
//     const { author } = req.params;
//     new Promise((resolve, rejected) => {
//         const books_list = JSON.stringify(books)
//         const books_list_array = JSON.parse(books_list)
//         const books_match = Object.keys(books_list_array).filter(key => books_list_array[key].author.split(" ").includes(author))
//         const filtered_books = books_match.map(isbn => books_list_array[isbn])
//         if (filtered_books.length === 0) {
//             resolve(res.status(404).json({ message: "Book(s) not found" }));
//         } else {
//             resolve(res.status(300).send(JSON.stringify({ filtered_books }, null, 4)));
//         }
//     }).catch(() => res.status(500).json({ message: "Error in the process" }));
// });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const { title } = req.params;
    const books_list = JSON.stringify(books)
    const books_list_array = JSON.parse(books_list)
    const books_match = Object.keys(books_list_array).filter(key => books_list_array[key].title.split(" ").includes(title))
    const filtered_books = books_match.map(isbn => books_list_array[isbn])
    if (filtered_books.length === 0) {
        return res.status(404).json({ message: "Book(s) not found" });
    } else {
        return res.status(300).send(JSON.stringify({ filtered_books }, null, 4));
    }
});

// Get all books based on title by Promises
// public_users.get('/title/:title', function (req, res) {
//     const { title } = req.params;
//     new Promise((resolve, rejected) => {
//         const books_list = JSON.stringify(books)
//         const books_list_array = JSON.parse(books_list)
//         const books_match = Object.keys(books_list_array).filter(key => books_list_array[key].title.split(" ").includes(title))
//         const filtered_books = books_match.map(isbn => books_list_array[isbn])
//         if (filtered_books.length === 0) {
//             resolve(res.status(404).json({ message: "Book(s) not found" }));
//         } else {
//             resolve(res.status(300).send(JSON.stringify({ filtered_books }, null, 4)));
//         }
//     }).catch(() => res.status(500).json({ message: "Error in the process" }));
// });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;
    const filtered_book = books[isbn];
    if (!filtered_book) {
        return res.status(404).json({ message: "Book not found" });
    } else {
        const book_reviews = filtered_book.reviews;
        return res.status(300).send(JSON.stringify({ book_reviews }, null, 4));
    }
});

module.exports.general = public_users;
