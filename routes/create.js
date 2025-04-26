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
    res.redirect("/books")
}).post(async(req,res)=>{
    const data = {}
    content =
    `
    <form class="bookView" action="/books" method="POST" style="padding: 20px;">
        <div class="topBody">
            <input type="file" accept="image/*" />
            <input name="title" required/> 
            <input name="numOfchapters" type="number"/>
        </div>
        <button type="submit">Add</button>
    </form>
    `
    data.content = content

    res.render("create",data)
})
// INDUCES



module.exports = router