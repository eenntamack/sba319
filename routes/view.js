const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()
const multer = require("multer")

const fillerBooks = require("../seed/filler.js")

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


router.route("/").get( async (req, res) => {
    let novel = await Books.findById(req.params.bookid)
    let container = "";
    container+=`<section class="bookView"><div class="topBody>"`
    container+=`
        <div class="title">
            ${novel.name}
        </div>
    `
    if (novel.image && novel.image.data && novel.image.contentType) {
        const base64 = novel.image.data.toString("base64");
        container += `<img src="data:${novel.image.contentType};base64,${base64}" />`;
    }

    container+=`</div>`
    container += 
    `
    <textarea id="chapter">
    </textarea>
    <button type="submit" name="action" value="update">
        update
    </button>
    <button type="submit" name="action" value="delete">
        delete
    </button>
    `
    container+=`</form>`
    const data = {
        books: container,
        id: req.params.bookid,
        chapters: novel.chapters
    };

    res.render("item", data);
});