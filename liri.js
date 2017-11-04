const fs = require("fs");
const omdbapi = require('omdbapi');
const request = require("request");
const client = require('./keys.js');
const inquirer = require("inquirer");

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
        choices: ["my-tweets", "movie-this"],
        name: "choices"
    }
])
.then(function(response){
    console.log("Welcome " + response.username + "!");
    console.log("You have selected: " + response.choices);
    if (response.choices === "my-tweets"){
        var params = {
            screen_name: 'csr4'
        };
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                for (var i = 0; i < 20; i++){
                    var formTweets = (tweets[i].text).split(/(.{50})/g).join("\n");

                    console.log(
                        "\t\tLATEST TWEET #" + [i + 1] 
                        + "\n====================================================\n" 
                        + formTweets
                        + "\n\n====================================================\n");
                    
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
                console.log("tweets.txt was updated!\n")
            }
        })
    }

    if (response.choices === "movie-this") {
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
                    console.log(
                        "\n\t\tTITLE: '" + movieName.toUpperCase() 
                        + "' (" + JSON.parse(body).Year + ")"
                        + "\n===================================================\n"
                        + "\nIMDB RATING: " + JSON.parse(body).Ratings[0].Value
                        + "\nRT RATING: " + JSON.parse(body).Ratings[1].Value
                        + "\n\nPLOT: \n" + JSON.parse(body).Plot
                        + "\n\nSTARRING: " + JSON.parse(body).Actors
                        + "\n\nProduced by: " + JSON.parse(body).Country
                        + "\nLanguages: " + JSON.parse(body).Language
                        + "\n\n=================================================="
                    )
                }

                fs.appendFile("movies.txt", 
                "\n\t\t\tTITLE: " + movieName.toUpperCase() 
                + " Released (" + JSON.parse(body).Year + ")"
                + "\n===================================================\n"
                + "\nIMDB Rating: " + JSON.parse(body).Ratings[0].Value
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
                        console.log("movies.txt was updated!")
                    }                
                })
            })

        })

    }

});


