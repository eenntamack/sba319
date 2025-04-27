const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()
const multer = require("multer")
const fs = require("fs");

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
    },
    hasImage: {type:Boolean,default:false}
});
const Books = mongoose.models.book || mongoose.model('book', booksSchema);


function savingImagesSeed(){
    let imageSeed = []
    imageSeed.push(fs.readFileSync("./images/adventurecover_ai.jpeg"))
    imageSeed.push(fs.readFileSync("./images/fantasycover_ai.jpeg"))
    imageSeed.push(fs.readFileSync("./images/mysterycover_ai.jpeg"))
    return imageSeed
}

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
        res.redirect("/");
    } catch (error) {
        console.error("Error saving book:", error);
        res.status(500).json({ message: "Error saving book." });
    }
    
})

router.route("/seed").get(async (req,res)=>{
    let seed = savingImagesSeed()
     const books = [
        {
            name: "The Detective",
            image: {
                data: seed[2],
                contentType: "image/jpeg"
            },
            chapters: [
                {
                    name: "The Silent Letter",
                    text: `Detective Lila Hayes stood in the dimly lit room, her eyes scanning the cluttered office of the late Jonathan Blackwood, the well-known financier who had been found dead under suspicious circumstances. The scene was eerily calm, almost too calm for a man whose life had been filled with high-stakes deals and rivalries. The faint scent of cigar smoke lingered in the air, and the only sound was the ticking of an antique clock on the wall. Lila's gaze shifted to the desk, where a half-finished letter sat beside a glass of whiskey. The letter was addressed to someone she didn't recognize, but the words had been hastily scribbled—“If you find this, it's already too late.” It was a clue, or perhaps a warning. Lila had learned to trust her instincts, and everything about this case was off. Someone was hiding something, and it was up to her to uncover the truth before the secrets of Blackwood's past consumed them all.`
                }
            ],
            hasImage:true
        },
        {
            name: "The Fantasy",
            image: {
                data: seed[1],
                contentType: "image/jpeg"
            },
            chapters: [
                {
                    name: "The Whispering Woods",
                    text: `In the heart of the kingdom of Eldoria, where the trees grew tall as ancient gods and their roots ran deep into the earth's veins, there lay a mystical forest known only as the Whispering Woods. Legends told of its enchanted powers, where time itself seemed to twist, and the air was thick with secrets older than the stars. The people who ventured near it spoke of eerie whispers carried by the wind, voices that no one could place but which always seemed to beckon. No one who entered the forest returned unchanged; some went mad, others vanished without a trace. Yet, young Elara, determined to discover the truth behind these whispers, could not resist the pull. With nothing but her resolve and a satchel of herbs passed down by her grandmother, she stepped past the first line of trees, unaware that her journey would forever alter the fate of Eldoria.`
                },
                {
                    name: "The Fire-Born",
                    text: `Beneath the blood-red sky, the city of Arundel lay in ruins. Flames licked at the edges of broken stone walls, and the scent of ash hung heavy in the air. In the midst of the chaos, a figure emerged from the heart of the inferno. She was unlike any warrior the kingdom had seen before, her skin glowing with an otherworldly warmth, her eyes shimmering like molten lava. Aria, the Fire-Born, had long been an outcast, rumored to be the child of an ancient dragon and a human queen. Her power was both a gift and a curse, one that had caused her to flee from the only family she had ever known. Now, as the last remnants of Arundel's defense crumbled, Aria stood tall, her fury matched only by the raging fire around her. She had come for vengeance, and no one, not even the gods themselves, would stop her.`
                }
            ],
            hasImage:true
        },
        {
            name: "The Adventure",
            image: {
                data: seed[0],
                contentType: "image/jpeg"
            },
            chapters: [
                {
                    name: "The Map in the Attic",
                    text: `Jarek had never been one for grand adventures, content with his quiet life as a blacksmith's apprentice in the small village of Glenhaven. But everything changed the day he found the map. It was tucked away in a dusty chest in the attic of his childhood home, hidden beneath piles of old blankets and forgotten trinkets. The map was unlike anything he had ever seen—its edges frayed, its ink faded, but the symbols were unmistakable. A treasure hidden deep within the Hollow Mountains, guarded by creatures of legend and the perilous terrain of forgotten realms. Jarek's heart raced with a thrill he couldn't quite understand. He had heard the old stories—whispers of treasure hunters who never returned, of lost kingdoms buried beneath the earth. But now, the map was in his hands, and with it, a choice. Would he stay in the safety of Glenhaven, or would he risk everything to seek the adventure that awaited him?`
                },
                {
                    name: "The First Trial",
                    text: `Jarek's journey began at dawn, with only the map and a small pack of supplies. The village folk had warned him of the dangers that lay beyond the forest—of the wild beasts and treacherous cliffs. Yet, nothing could extinguish the fire of curiosity that burned within him. As he ventured deeper into the wilderness, the sounds of the village faded, replaced by the chirping of birds and the rustling of leaves. The first trial was not long in coming. As Jarek climbed a steep hill, he found himself face-to-face with a massive stone door carved into the side of a mountain. Strange runes glowed faintly across its surface, and in the center was a large, circular keyhole. The map had mentioned the trial of the gate, but it hadn't given much more detail. Jarek could sense that unlocking this door would lead him one step closer to the treasure—and to the adventure he had longed for all his life. He glanced at the map, then back at the door, feeling the weight of the journey settle on his shoulders. There was no turning back now.`
                }
            ],
            hasImage:true
        }
    ];

    // Create the books and save them individually
    Books.create(books)
        .then(() => {
            console.log("Books seeded successfully");
            res.redirect("/books");
        })
        .catch((error) => {
            console.error("Error seeding books:", error);
            res.status(500).json({ message: "Error seeding books." });
        });
});

// INDUCES



module.exports = router