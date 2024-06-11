const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
    firstName: "John",
    lastName: "wick",
    username: "johnwick@gamil.com",
    password: "test1",
    DOB: "22-01-1990",
},
{
    firstName: "John",
    lastName: "smith",
    username: "johnsmith@gamil.com",
    password: "test2",
    DOB: "21-07-1983",
},
{
    firstName: "Joyal",
    lastName: "white",
    username: "joyalwhite@gamil.com",
    password: "test3",
    DOB: "21-03-1989",
},
];

const isValid = (username) => { //returns boolean
    const isUserExist = users.filter(user => user.username === username)
    if(isUserExist.length > 0){
        return true
    } else {
        return false
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    const isValidUser = users.find(user => user.username === username && user.password === password);
    if(isValidUser){
        return true
    } else {
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const isUserRegistered = users.filter(user => user.username === username);

    if (isUserRegistered.length === 0) {
        return res.status(404).json({ message: "This user not found" })
    } else if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: {
                firstName: isUserRegistered[0].firstName,
                lastName: isUserRegistered[0].lastName,
                username
            }
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(406).json({ message: "Invalid credentials" })
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const { user } = req;
    let filtered_book = books[isbn] ? books[isbn] : [];
    if (filtered_book.length === 0) {
        return res.status(404).json({ message: "Book not found" });
    } else {
        if (!review) {
            return res.status(400).json({ message: "The review cannot be empty" });
        }
       filtered_book.reviews[`${user.data.username}`] = {"review": review}
       return res.status(202).json({ message: "Your review was uploaded successfully" })
    };
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { user } = req;
    const filtered_book = books[isbn] ? books[isbn] : [];
    if (filtered_book.length === 0) {
        return res.status(404).json({ message: "Book not found" });
    } else {
        if(Object.keys(filtered_book.reviews).length === 0){
            return res.status(400).json({message: "You have no a review of this book"})
        }
        delete filtered_book.reviews[`${user.data.username}`]
        return res.status(202).json({message: "Your review of this book was deleted successfully"})
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
