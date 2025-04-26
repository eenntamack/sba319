const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const fs = require("fs")
dotenv.config()

const app = express()

const port = process.env.PORT || 3000

const books =  require("./routes/create.js")
const bookView = require("./routes/view.js")

// Middleware 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use("/books/create",books) 
app.use("/books/view",bookView)
app.use(express.static("./styles"))

app.engine("page", (filePath, data, callback) => { 
    fs.readFile(filePath, (err, content) => {
        if (err) return callback(err);
        const rendered = content.toString()
            .replace("#books#", data.books || "")
            .replace("#id#",data.id|| "")
            .replace("#chapters#",data.chapters||"")
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
    }
});
const Books = mongoose.models.book || mongoose.model('book', booksSchema);

app.get("/books", async (req, res) => {
    let novels = await Books.find();
    let container = "";

    for (let book of novels) {
        let bookContainer = `<form id="${book._id}" class="book" action="/books/view" method="POST">`;

        if (book.image && book.image.data && book.image.contentType) {
            const base64 = book.image.data.toString("base64");
            bookContainer += `<img src="data:${book.image.contentType};base64,${base64}" />`;
        }

        bookContainer += `<p>${book.name}</p>`;
        bookContainer += `<button type="submit" name="bookid" value=${book._id}>View</button>`
        bookContainer += `</form>`;
        container += bookContainer;
    }


    const data = {
        books: container,
    };

    res.render("item", data);
});


app.get("/",(req,res)=>{
    res.render("main")
})




app.listen(port,()=>{
    console.log(`listening on localhost:3000`)
})