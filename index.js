const http = require('http')
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const fs = require("fs");


const app = express()
const path = require('path')
const server = http.createServer(app)


// specifiying path for rendering index.html
app.use(express.static(__dirname + '/client'));

// rendering the index.html at '/' 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
})


// function to get the search results of the song from the input
app.get('/input', (req, res) => {
    const { queryInput } = req.query;

    const url = `https://search.azlyrics.com/search.php?q=${queryInput}&w=songs&p=1&x=f0627f8ad29987cc3bfee64c7456f18b887f11cb8e9f77aecf7dbbcf25e6e738`;

    (async () => {
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            const listItems = $(".table tbody tr");
            const songs = [];

            listItems.each((idx, el) => {
                const song = { name: "", artist: "", link: "" };

                const bTagArtist = $(el).find("td a b").eq(1);
                song.artist = bTagArtist.text();

                const bTagName = $(el).find("td a span b");
                song.name = bTagName.text();

                const anchorTag = $(el).find("td a").first();
                song.link = anchorTag.attr("href");

                songs.push(song);
            });

            res.json({ songs });
        } catch (err) {
            console.error(err);
        }
    })();
});


// function to get the lyrics after clicking on the song
app.get('/lyrics', (req, res) => {
    const { link } = req.query;

    (async () => {
        try {
            console.log(link)
            const { data } = await axios.get(link);
            const $ = cheerio.load(data);

            const lyrics = $(".col-xs-12 div:eq(5)");

            // console.log(lyrics.text())
            res.json({ lyrics: lyrics.html() });
        } catch (err) {
            console.error(err);
        }
    })();
})



// listening the server at port 3000 and rendering
server.listen(3000, () => {
    console.log('listening on http://localhost:3000')
})