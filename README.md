# This is a story/novel creation MEN(MongoDb,Express,Node) application #

## Application has 4 key features ##

1. Creating a story
2. Adding Chapters
3. Editing/Updating the application
4. Adding the cover art associated to those chapters
5. Searching your catalog of stories

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
