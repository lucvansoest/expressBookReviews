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

  const get_books = new Promise((resolve, reject) => {
    resolve(res.send(books));
  });

  get_books.then(() => console.log("Promise for Task 10 resolved"));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

    const get_book = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        if (isbn in books) 
            resolve(res.send(books[isbn]));
        else
            reject(`Book with isbn ${isbn} not found!`);         
      });
    
    get_book.then(() => console.log("Promise for Task 11 resolved"));

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

    const get_book = new Promise((resolve, reject) => {

        const author = req.params.author;
        const bookISBNs = Object.keys(books)
        let bookFound = false;
        bookISBNs.forEach((isbn) => {
            if (books[isbn].author === author) { 
                resolve(res.send(books[isbn]));
                bookFound = true;
            }
        });
        if (!bookFound) {
            reject(`Book with author '${author}' not found!`);
        }
      });
    
    get_book.then(() => console.log("Promise for Task 12 resolved"));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {


    const get_book = new Promise((resolve, reject) => {

        const title = req.params.title;
        const bookISBNs = Object.keys(books)
        let bookFound = false;
        bookISBNs.forEach((isbn) => {
            if (books[isbn].title === title) { 
                resolve(res.send(books[isbn]));
                bookFound = true;
            }
        });
        if (!bookFound) {
            reject(`Book with title '${title}' not found!`);
        }
      });
    
    get_book.then(() => console.log("Promise for Task 13 resolved"));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;
