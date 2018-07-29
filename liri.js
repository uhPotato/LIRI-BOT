var keys = require("./keys.js");
var Spotify = require("spotify");
var twitter = require("twitter");

var request = require("request");
var fs = require("fs");


// var spotify = new spotify({
//   id: 'faea3548db5f4dc2b4046e92e93e3e84',
//   secret: '1549529e8bd946198ae047dd7c09fc6b' 
// });

// console.log(twitterKeys);

var nodeArgs = process.argv;
var query = [];
// var action = process.argv.slice(2);

for (var i = 2; i < nodeArgs.length; i++){

  query.push(nodeArgs[i]);

}

var argOne = query.splice(0,1);
var argTwo = query.join(" ");
var action = String(argOne);
var value = String(argTwo);

console.log("Searching for " +  value);
console.log("What command? " + action);


switch (action){
  case "my-tweets":
  myTweets();
  logAction();
  break;

  case "spotify-this-song":
  spotifyThisSong();
  logAction();
  break;

  case "movie-this":
  movieThis();
  logAction();
  break;

  case "do-what-it-says":
  doThis();
  logAction();
  break;

}

//Functions

//Commands for Liri to take in...
// * `my-tweets`
function myTweets(){

var twitterKeys = keys.twitterKeys;

var client = new twitter({
  consumer_key: twitterKeys.consumer_key,
  consumer_secret: twitterKeys.consumer_secret,
  access_token_key: twitterKeys.access_token_key,
  access_token_secret: twitterKeys.access_token_secret
});

var params = {screen_name: "jlp0328", count:20};

client.get("statuses/user_timeline", params, function(error, tweets, response) {
  if (error) {
    console.log(error);
  }

  for(var i = 0; i < tweets.length; i++){
	console.log("************");

//	logThis(tweets[i].created_at);
//	logThis(tweets[i].text);

    console.log(tweets[i].text);
    console.log("************");
  }

});
}

// * `spotify-this-song`
function spotifyThisSong (){

  spotify.search({
    type:"track",
    query: value}, function(err, data){

      if (err) {
        console.log("Error occurred: " + err);
        return;
      }
  // * if no song is provided then your program will default to
  //   * "The Sign" by Ace of Base
  if(value === ""){
      logThis("\n************");
      logThis("Artist: Incubus");
      logThis("Song: Aqueous Transmissions");
      logThis("Song Link: https://open.spotify.com/track/5M67k54BVUDADZPryaqV1y");
      logThis("Album: Morning View");
      logThis("************\n");
  }
  else{

	console.log(data);


  //need to provide spotify token here ????

      var results = data.tracks.items[0];

      var artist = results.artists[0].name;
      var songName = results.name;
      var songLink = results.external_urls.spotify;
      var album = results.album.name;

	  //Need: artist(s), song's name, preview link of song, album//

      logThis("\n************");
      logThis("Artist: " + artist);
      logThis("Song: " + songName);
      logThis("Song Link: " + songLink);
      logThis("Album: " + album);
      logThis("************\n");
//    }
}

});

}

// * `movie-this`
function movieThis(){
        // OMDB Movie - this MOVIE base code is from class files, I have modified for more data and assigned parse.body to a Var
        var movieName = value;
        // Then run a request to the OMDB API with the movie specified
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";

        request(queryUrl, function (error, response, body) {

            // If the request is successful = 200
            if (!error && response.statusCode === 200) {
                var body = JSON.parse(body);
		//		console.log(body);
                //Simultaneously output to console and log.txt via NPM simple-node-logger
                logThis('\n================ Movie Info ================');
                logThis("Title: " + body.Title);
                logThis("Release Year: " + body.Year);
                logThis("IMdB Rating: " + body.imdbRating);
                logThis("Country: " + body.Country);
                logThis("Language: " + body.Language);
                logThis("Plot: " + body.Plot);
                logThis("Actors: " + body.Actors);
                logThis("Rating: " + body.Ratings[0].Value);
                logThis('==================THE END=================');

            } else {
                //else - throw error
                console.log("Error occurred.")
            }
            //Response if user does not type in a movie title
            if (movieName === "Mr. Nobody") {
                console.log("-----------------------");
                console.log("If you haven't watched 'Mr. Nobody,' then you should (OR SO THEY SAY): http://www.imdb.com/title/tt0485947/");
                console.log("It's on Netflix!");
            }
        });
    }

// * `do-what-it-says`
function doThis(){

// Feel free to change the text in that document to test out the feature for other commands.
fs.readFile("random.txt", "utf8", function(error,data){

  var content = data.split(",");

  // var array = data.toString().split("\n");
  // console.log(array);

  action = content[0];
  value = content[1];

  switch (action){
  case "my-tweets":
  myTweets();
  break;

  case "spotify-this-song":
  spotifyThisSong();
  break;

  case "movie-this":
  movieThis();
  break;

  case "do-what-it-says":
  doThis();
  break;

}

});

}


function logThis(dataToLog) {

	// log the data to console
	console.log(dataToLog);

	// also append it to log.txt followed by new line escape
	fs.appendFile('log.txt', dataToLog + '\n', function(err) {
		
		// if there is an error log that then end function
		if (err) return console.log('Error logging data to file: ' + err);
	
	// end the appendFile function
	});

// end the logThis function
}


function logAction (){

  var logItem = "\nSearch String: " + action + ", " + value;
  console.log(logItem);

  fs.appendFile("log.txt",logItem, function(err){

    if (err) {
    console.log(err);
  }

  else {
    console.log("Content Added!");
  }

});
}