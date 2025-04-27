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
    imageSeed.push(fs.readFileSync("./images/Glassoptical.png"))
    imageSeed.push(fs.readFileSync("./images/Scenery_with_newbrushChallenge.png"))
    return imageSeed
}

router.route("/").get((req,res)=>{
    const data = {}
    content =
    `
    <form class="bookView" action="/books/create" method="POST" style="padding: 30px; background-color:#3c3c3c; color:#f4f4f4; width:500px; border-radius:20px;" enctype="multipart/form-data">
        <div class="topBody" style="display:flex; flex-direction:column; justify-content:center; ">
            <h1 style="font-size: 30px;">Add an image</h1>
            <input type="file" name="image" accept="image/*" />
            <h1 style="font-size: 30px;">Title</h1>
            <input name="title" style="height:30px; font-size:25px;" required/> 
        </div>
        <button type="submit" style="margin-top:10px;">Add</button>
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
            },
            hasImage:true
        });
    } else {
        newBook = new Books({
            name: req.body.title,
            chapters: [{
                name:"temp chapter",
                text:"temp text"
            }]
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
        },
        {
            name: "The Void",
            image:{ 
                data:seed[3],
                contentType: "image/png"
            },
            chapters:[
                {
                    name:`The Descent`,
                    text:`A strange emptiness filled the air as Nyx stood at the edge of the precipice, gazing into the abyss below. The Void was a place where time and space twisted into nothingness, a realm where the laws of the universe held no sway. Nyx had heard the legends, of course—the ancient whispers of those who had ventured too far and never returned. But she had to know. The Void called to her, a silent promise of something beyond what the world could offer. With a final breath, she stepped forward. Her body fell, not with the weight of gravity but as if the very air around her was pushing her deeper into the darkness. The wind ceased to exist, and the light of the world above her faded into blackness, leaving her to drift alone. For what felt like an eternity, Nyx plummeted into the unknown, her mind racing with fear, curiosity, and the chilling sense that the Void itself was watching her.`
                },
                {
                    name:`The Endless Reflection`,
                    text:`When Nyx's feet finally touched solid ground, the sensation was as unsettling as the fall itself. She was no longer in the world she had known. The Void had swallowed her whole, but here, there were no walls, no boundaries. Everything stretched infinitely in all directions—an endless expanse of darkness that felt more like a reflection than a place. The ground beneath her seemed to pulse with a strange energy, alive with whispers that echoed through her mind. It was as if the Void itself was trying to communicate, its ancient consciousness reaching out to her. The deeper she ventured, the more the world around her began to shift, with images flickering like broken memories. Faces, places, and events that Nyx could not place danced in the void, each one appearing for a moment before dissolving into the endless black. She realized then that the Void was not a place; it was a state of being. And as she walked through this endless reflection, she felt herself slipping away, her identity fading like the shadows that surrounded her. The Void was not merely a destination—it was the undoing of everything, including herself.`
                }
            ],hasImage:true
        },
        {
            name: "The Sky",
            image:{ 
                data:seed[4],
                contentType: "image/png"
            },
            chapters:[
                {
                    name:'The Edge of the Horizon',
                    text: `It was on the edge of the world, where the sky kissed the earth, that Elara stood, watching the sun dip below the horizon. The air was thick with the scent of saltwater, and the faintest of breezes tugged at her cloak. The rumors of the Sky Gate had haunted her thoughts for years—stories of a hidden realm above the clouds, where time flowed differently and the stars themselves were said to be within reach. Her journey had begun with nothing but a map passed down by her grandmother, a cryptic message that pointed to the forgotten lands of the sky. Now, standing on the cliff's edge, Elara felt the weight of destiny pressing against her chest. The sky was no longer just a canvas for her dreams; it was a path she was destined to walk.`
                 
                },
                {
                    name:'The First Flight',
                    text:'The night came quickly, and with it, the strange silence of the Sky Gate. Elara had followed the map through dense forests, across rivers, and up the towering peaks of the Shattered Mountains, until she reached the temple—a crumbling structure that seemed to pulse with energy. Inside, an ancient machine stood, its gears long rusted and its purpose unclear. But there, amidst the dust and cobwebs, was a single glowing crystal, suspended in mid-air. Elara knew, without a doubt, that this was the key. With trembling hands, she activated the mechanism, and the world around her began to shift. The ground trembled beneath her, and in an instant, she was lifted into the air, the Sky Gate opening before her like a mouth ready to swallow her whole. For the first time in her life, Elara felt what it was like to truly fly.'
                },
                {
                    name:'The City Above the Clouds',
                    text:`The journey through the Sky Gate was unlike anything Elara had ever experienced. As she emerged from the swirling vortex, the world around her opened up into a breathtaking sight—a city suspended among the clouds, its towers reaching toward the heavens, connected by shimmering bridges made of light. The people here were unlike any she had ever known, their skin glistening with the brilliance of stars, their eyes reflecting the vastness of the sky itself. They called themselves the Skyborn, guardians of the secrets of the skies. Elara had not just discovered a hidden realm; she had stumbled upon an entire civilization that had lived above the clouds for centuries. But as she stepped into their city, a sense of unease washed over her. The Skyborn were not welcoming her with open arms. Something was amiss, and Elara was determined to uncover the truth behind the Sky Gate, before the skies themselves turned against her.`
                }
            ],hasImage:true
        },
        {
            name:"A book without a face",
            chapters: [{
                name:"temp chapter",
                text:"temp text"
            }]
        },
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