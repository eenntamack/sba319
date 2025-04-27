const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()
const multer = require("multer")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
    <form class="bookView" action="/books/create" method="POST" style="padding: 20px;" enctype="multipart/form-data">
        <div class="topBody">
            <input type="file" name="image" accept="image/*" />
            <input name="title" required/> 
        </div>
        <button type="submit">Add</button>
    </form>
    `
    data.content = content

    res.render("create",data)
    
}).post( upload.single('image'),async(req,res)=>{
    let newBook;
    console.log(req.file)
    console.log(req.body)
    if (req.file) {
        newBook = new Books({
            name: req.body.title,
            image: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        });
    } else {
        newBook = new Books({
            name: req.body.title,
        });
    }

    try {
        const savedBook = await newBook.save();
        console.log("Book saved successfully");
        res.redirect("/books");
    } catch (error) {
        console.error("Error saving book:", error);
        res.status(500).json({ message: "Error saving book." });
    }
    
    
})
// INDUCES



module.exports = router