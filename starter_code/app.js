require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
// Retrieve an access token

  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
      spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
      console.log("Something went wrong when retrieving an access token", error);
    });

// set the static folder for partials

    hbs.registerPartials( __dirname + '/views/partials');



// the routes go here:

    // get the artist by name 
    app.get('/artists', (req,res,next) => {
        // console.log(req.query);

        spotifyApi
        .searchArtists(req.query.artists)
        .then(data => {
        // console.log("The received data from the API: ", data.body.artists.items[0]);
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

            res.render('artists',{artistsList:data.body.artists.items});
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
    });

    // get albums from artist

    app.get('/albums/:artistId', (req, res, next) => {
        //console.log("resultado album id",req.params.artistId);
        var result = req.params.artistId.substr(15);
        // console.log("resultado tras quitar id",result);


        spotifyApi.getArtistAlbums(result)
        .then(data => {
            //console.log('Artist albums',data.body.items);
            res.render('albums',{albumsList:data.body.items});
        })
        .catch(err => {
            console.error("The error while searching Albums occurred: ",err);
        });
    });

    // get tracks from album selected

    app.get('/tracks/:albumId', (req, res, next) => {
        // console.log("resultado album id",req.params.albumId);
        var result2 = req.params.albumId.substr(14);
        //console.log("resultado album tras quitar id",result2);
    
        spotifyApi.getAlbumTracks(result2, { limit : 5, offset : 1 })
        .then(data => {
               // console.log('album tracks',data.body.items);
                res.render('tracks',{tracksList:data.body.items});
            })
        .catch(err => {
        console.error("The error while searching Albums occurred: ",err);
        });

    });

 


    app.get('/', (req,res,next) => {
        res.render('index');
    
    });



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
