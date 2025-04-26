const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()

const chapters = new mongoose.Schema({
    name: {type: String, required: true},
    text: {type: String, required: true},
    
})
const booksSchema = new mongoose.Schema({
    name:  { type: String, required: true },
    chapters: [chapters],
    favorite: {type: Boolean, default: false},
    image:{
        data: Buffer,
        contentType: String
    }
});
const Books = mongoose.models.book || mongoose.model('book', booksSchema);


router.route("/").get((req,res)=>{
    const data = {}
    content =
    `
    <form class="bookView" action="/books/create" method="POST" style="padding: 20px;">
        <input name="bookquery" required></input>
        <button type="submit"></button>
    </form>
    `

    data.content = content

    res.render("search",data)
}).post(async(req,res)=>{
    novel = Books
    novel = req.body.numOfchapters
    res.redirect("/books")
})
// INDUCES



module.exports = router