const fs = require("fs");
const omdbapi = require('omdbapi');
const request = require("request");
const client = require('./keys.js');
const inquirer = require("inquirer");
const Spotify = require("node-spotify-api");
const spotify = new Spotify ({
    id: "6c462450f6e14c74b63d75284c418d52",
    secret: "a9c85e9c67bf4840ad427dc132a62d35"
});


inquirer
.prompt ([
    {
        type: "input",
        message: "What is your name?",
        name: "username"
    },
    {
        type: "list",
        message: "Select one: ",
        choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "choices"
    }
])
.then(function(response){
    console.log("Welcome " + response.username + "!");
    console.log("You have selected: " + response.choices);
    if (response.choices === "my-tweets"){
        inquirer
        .prompt([
            {
                type: "input",
                message: "Enter the user's Twitter Handle: ",
                name: "twitterHandle"
            }
        ])
        .then(function(response){
            console.log("Retrieving the last 20 tweets from " + response.twitterHandle + "...");
            var params = {
                screen_name: response.twitterHandle
            };
            client.get('statuses/user_timeline', params, function(error, tweets, response) {
                if (!error) {
                    for (var i = 0; i < 20; i++){
                        var formTweets = (tweets[i].text).split(/(.{50})/g).join("\n");
                        
                        fs.writeFile("tweets.txt", "", function(err) {
                            if (err) {
                                return console.log(err);
                            }
                        })
    
                        fs.appendFile("tweets.txt", 
                            "\t\t\t\tLATEST TWEET #" + [i + 1] 
                            + "\n====================================================\n" 
                            + formTweets
                            + "\n\n====================================================\n", 
                            function(err){
                                if (err){
                                    return console.log(err);
                                }                 
                        })
                    }
                    console.log("Success!! Please view tweets.txt to see the latest tweets from " + params.screen_name + "!\n");
                }
            })
        })
    } else if (response.choices === "movie-this") {
        inquirer
        .prompt([
            {
                type: "input",
                message: "What movie would you like to search?",
                name: "movieTitle"
            }
        ])
        .then(function(response){
            var movieName = response.movieTitle.trim();
            var queryURL = 'http://www.omdbapi.com/?t=' + movieName + '&apikey=40e9cece';
            request(queryURL, function(error, response, body){
                if(error){
                    console.log(error)
                } else {
                    fs.appendFile("movies.txt", 
                    "\n\t\t\tTITLE: " + movieName.toUpperCase() 
                    + " Released (" + JSON.parse(body).Year + ")"
                    + "\n===================================================\n"
                    // + "\nadded by: " + username
                    + "\n\nIMDB Rating: " + JSON.parse(body).Ratings[0].Value
                    + "\nRT Rating: " + JSON.parse(body).Ratings[1].Value
                    + "\n\nPlot Summary: \n" + JSON.parse(body).Plot
                    + "\n\nStarring: " + JSON.parse(body).Actors
                    + "\n\nProduced by: " + JSON.parse(body).Country
                    + "\nLanguages: " + JSON.parse(body).Language
                    + "\n\n==================================================", 
                    function(err){
                        if (err){
                            return console.log(err);
                        } else {
                            console.log("Success! You have added " + movieName + " to movies.txt!");
                        }                
                    })
                }
            })
        })

    } else if (response.choices === "spotify-this-song") {
        var songTitle = " ";
        inquirer
        .prompt([
            {
                type: "input",
                message: "What song would you like to search? ",
                name: songTitle
            }
        ])
        .then(function(response){
            if (songTitle === undefined) {
                songTitle = "I Saw the Sign";
            } else {
                spotify.search({ type: "track", query: songTitle }, (err, data) => {
                    if (err) throw err;
                    let items = data.tracks.items;
                    let songArr = [];
                    for (var i = 0; i < items.length; i++) {
                        songArr.push({
                            "Artist(s): ": items[i].artists,
                            "Song Title: ": items[i].name,
                            "Album: ": items[i].album.name,
                            "Spotify Link: ": items[i].preview_url
                        })
                        console.log(JSON.parse(songArr));
                        fs.writeFile("random.txt", JSON.parse(songArr), (err) => {
                            if (err) throw err;
                            console.log ("New song added to random.txt!");
                        })
                    }
                })
            }
        }) 
    } else if (response.choices ==="do-what-it-says") {
        console.log("Do what it says?  What did it say to do...?  ");
    } else {
        console.log("Start over");
        system.exit(0);
    }

});


