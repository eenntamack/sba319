const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const fs = require("fs")
dotenv.config()

const app = express()

const port = process.env.PORT || 3000

const books =  require("./routes/create.js")
const bookView = require("./routes/view.js")
const bookSearch = require("./routes/search")

// Middleware 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use("/books/create",books) 
app.use("/books/view",bookView)
app.use("/books/search",bookSearch)

app.use(express.static("./styles"))
app.use(express.static("./images"))
 
app.engine("page", (filePath, data, callback) => { 
    fs.readFile(filePath, (err, content) => {
        if (err) return callback(err);
        const rendered = content.toString()
            .replace("#books#", data.books || "")
            .replace(/#id#/g,data.id || "")
            .replace(/#currentPos#/g,data.currentPos || "")
            .replace("#chapters#",data.chapters || null)
            .replace("#content#",data.content || "")
        return callback(null, rendered);
    });
});

app.set("views", "./pages");
app.set("view engine", "page");

// Mongoose Connection
mongoose.connect(process.env.ATLAS_URI)
mongoose.connection.once('open', ()=> {
    console.log('connected to mongoDB')
})

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

app.get("/books", async (req, res) => {
    //let pagination = 
    let novels = await Books.find()
    let container = "";

    for (let book of novels) {
        let bookContainer = `<form id="${book._id}" class="book" action="/books/view" method="POST" style="overflow:hidden; display:flex; flex-direction:column; background-color:#1c1c1c;">`;

        if (book.image && book.image.data && book.image.contentType) {
            const base64 = book.image.data.toString("base64");
            bookContainer += `<img src="data:${book.image.contentType};base64,${base64}" style="width:100%; height:auto; border-radius:10px; top:-30px; position:relative;"/>`;
        }

        bookContainer += `<p style="color:white;">${book.name}</p>`;
        bookContainer += `<div style="display:flex; flex-direction:row; justify-content:center; align-items:center;">`
        bookContainer += `<button class="bookoption" type="submit" name="bookid" value=${book._id}>View</button>`
        bookContainer += `<button class="deleteBook bookoption" type="button" name="delete" value="${book._id}">Remove</button>`
        bookContainer += `</div>`
        bookContainer += `</form>`;
        container += bookContainer;
    }

    const data = {
        books: container,
        currentPos: `data-current-pos="0"` 
    };

    res.render("item", data);
});
app.post("/books",(req,res)=>{
    res.redirect("/books")
})

app.delete("/books",async(req,res)=>{
    const deletedNovel = await Books.findByIdAndDelete(req.body.bookID)
    if(deletedNovel){
        res.json({success:true,message:"book deleted"})
    }else{
        res.status(500).json({message:"book does not exits and could not be deleted"})
    }
})

app.get("/",(req,res)=>{
    res.render("main")
})

app.listen(port,()=>{
    console.log(`listening on localhost:3000`)
})