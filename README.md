# This is a story/novel creation MEN(MongoDb,Express,Node) application #

## Application has 6 key features ##

1. Creating a story
2. Adding Chapters
3. Editing/Updating the books in the application
4. Adding the cover art associated to those chapters
5. Searching your catalog of stories, by name, if it has an image, with an additional option to sort by name
6. Deleting the book altogether

## This application utilizes this schema: ##

{
    name:  { type: String, required: true },
    chapters: [chapters],
    favorite: {type: Boolean, default: false},
    image:{
        data: Buffer,
        contentType: String
    }
}

chapters{
    name: {type: String, required: true},
    text: {type: String, required: true},
}

## NOTE: If you don't want the hassle of creating your own novels and want to use the functionality immediately ##

- use the route: /book/create/seed to generate the novels 
- majority of the cover art was sourced from an image generator, 2 of them are my own pieces (The Void, The Sky)