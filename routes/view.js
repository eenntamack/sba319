const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()
const multer = require("multer")


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
    res.redirect("/")
}).post(async (req, res) => {
    const bookId = req.body.bookid;

    const novel = await Books.findById(bookId);
    if (!novel) return res.status(404).send("Book not found");

    let container = "";
    container += `<form class="bookView" action="/books/view/action" method="POST"><div class="topBody">`;

    container += `<input class="title" style="display:flex; flex-direction:column; width:100%; justify-content:center;" name="novelName" value="${novel.name}"/>`;

    if (novel.image && novel.image.data && novel.image.contentType) {
        const base64 = novel.image.data.toString("base64");
        container += `<img src="data:${novel.image.contentType};base64,${base64}" />`;
    }

    container += `</div>`;
    container += `
        <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; opacity:0.3;">
    <input class="chapterHeader" name="chapterName" value="" style="width:50%; height:30px; font-size:15px;"> 
    <textarea id="chapter" name="chapter" rows="25" cols="100" style="font-size:15px; resize:none;" required>Hi</textarea>
    <input name="bookid" value="${bookId}" style="display:none;" />
    <textarea id="chapterText" name="chapterVal" style="display:none;"></textarea>
    <div style="display:flex; flex-direction:row; justify-content:center; align-items:center;">
        <button type="submit" name="action" value="update">update</button>
        <button type="submit" name="action" value="delete">delete</button>
    </div>
</div>
    `;
    container += `</form>`;

    if(novel.chapters.length == 0 || !novel.chapters){
        novel.chapters.push({
            name:"temp",
            text:"temp text"
        })
    }

    const data = {
        books: container,
        id: bookId,
        chapters: JSON.stringify(novel.chapters),
    };

    res.render("book", data);
});

router.route("/action").get((req,res)=>{
    res.redirect("/")
}).post(async (req,res)=>{
    let novel =  await Books.findById(req.body.bookid)
    let chapter = req.body.chapterVal
    if(req.body.action == "update"){
        if(novel.chapters.length > 0){
            novel.chapters[chapter].text =  req.body.chapter
            novel.chapters[chapter].name =  req.body.chapterName
        }else{
            novel.chapters.push({
                text: req.body.chapter,
                name: req.body.chapterName
            });
        }
        novel.save()
    }else if(req.body.action == "delete"){
        novel.chapters.splice(chapter,1)
        novel.save()
    }


    
    res.redirect("/")
})
module.exports = router