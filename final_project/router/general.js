const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Function to check if the user exists
const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (isbn in books) 
        res.send(books[isbn]);
    else
        res.status(404).json({message: `Book with isbn ${isbn} not found!`}); 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const bookISBNs = Object.keys(books)
    let bookFound = false;
    bookISBNs.forEach((isbn) => {
        if (books[isbn].author === author) { 
            res.send(books[isbn]);
            bookFound = true;
        }
    });
    if (!bookFound) res.status(404).json({message: `Book with author '${author}' not found!`}); 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const bookISBNs = Object.keys(books)
    let bookFound = false;
    bookISBNs.forEach((isbn) => {
        if (books[isbn].title === title) 
        {
            res.send(books[isbn]);
            bookFound = true;
        }
    });
    if (!bookFound) res.status(404).json({message: "Book with title '${title}' not found!"}); 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;
