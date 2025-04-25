const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const app = express()

const port = process.env.PORT || 3000

const books =  require("./routes/create.js")




// Middleware 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use("/books",books) 

// Mongoose Connection
mongoose.connect(process.env.ATLAS_URI)
mongoose.connection.once('open', ()=> {
    console.log('connected to mongoDB')
})

const chapters = new mongoose.Schema({
    name: {type: String, required: true},
    text: {type: String, required: true}
})
const booksSchema = new mongoose.Schema({
    name:  { type: String, required: true },
    chapters: [chapters],
});
const Books = mongoose.models.book || mongoose.model('book', booksSchema);

app.get("/books",async (req,res)=>{
    let novels = await Books.find()
    res.json(novels)
})

app.listen(port,()=>{
    console.log(`listening on localhost:3000`)
})