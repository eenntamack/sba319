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
    },
    hasImage: {type:Boolean,default:false}
});
const Books = mongoose.models.book || mongoose.model('book', booksSchema);


router.route("/").get((req,res)=>{
    const data = {}
    content =
    `
    <form class="bookView" action="/books/search" method="POST" style="padding: 20px; display:flex; flex-direction:column; justify-content:center;align-items:center;width:100%;">
        <input name="bookquery" style="display:flex; justify-content:center; align-items:start; width:500px; height:40px; font-size:25px; margin:10px;"></input>
        <div style="display:flex; justify-content:center; align-items:center; margin:10px;">
        <input type="radio" name="sorted" style="margin:10px;">Sorted</input>
        <input type="radio" name="image" style="margin:10px;">Has Image</input>
        </div>
        <button type="submit" style="margin:10px;">Submit</button>
    </form>
    `

    data.content = content

    res.render("search",data)
}).post(async(req,res)=>{
    const data={}
    let novels;

    if(req.body.sorted){
        novels = await Books.find({ name: { $regex: req.body.bookquery, $options: "i" }}).sort({name: 1})
    }else{
        novels = await Books.find({ name: { $regex: req.body.bookquery, $options: "i" }}).sort({name: 1})
    }

    if(req.body.image){
        
        novels = novels.filter(novel => novel.hasImage === true)
        console.log(novels)
    }
    let container = "";

    for (let book of novels) {
        let bookContainer = `<form id="${book._id}" class="book" action="/books/view" method="POST" style="overflow:hidden; display:flex; flex-direction:column; background-color:black;">`;

        if (book.image && book.image.data && book.image.contentType) {
            const base64 = book.image.data.toString("base64");
            bookContainer += `<img src="data:${book.image.contentType};base64,${base64}" style="width:100%; height:auto; border-radius:10px; top:-4px;"/>`;
        }

        bookContainer += `<p style="color:white;">${book.name}</p>`;
        bookContainer += `<div style="display:flex; flex-direction:row; justify-content:center; align-items:center;">`
        bookContainer += `<button class="bookoption" type="submit" name="bookid" value=${book._id}>View</button>`
        bookContainer += `</div>`
        bookContainer += `</form>`;
        container += bookContainer;
    }

    data.books = container;
    res.render("search",data)
})

module.exports = router