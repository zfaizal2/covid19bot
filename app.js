// app.js
var Twitter = require('twitter');
var config = require('./config.js');
const bodyParser = require("body-parser")

const https = require('https')
const request = require('request')

var express = require ('express');
var app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ 
     extended: true 
}));
 
app.use(bodyParser.json()); 


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get('/', (req, res) => res.send('Hello World!'))


// request.post('https://api.covid19api.com/webhook', {
//     json: {
//         "URL" : "https://api.covid19api.com/webhook"
//     }
// }, (error, res, body) => {
//     if (error) {
//       console.error(error)
//       return
//     }
//     console.log(`statusCode: ${res.statusCode}`)
//     console.log(body)
// })

app.post("/hook", (req, res) => {
    console.log("hello")
    //console.log(req.body.json) // Call your action on the request here
    const sum = req.body['URL']
    console.log(sum)
    tweetSummary(sum)
    res.send({"result":"success"})
    res.status(200).end() // Responding is important
})

function tweetSummary(url) {
    console.log('hey!')
    request(url, { json: true }, (err, res, body) => {

        if (err) { 
            return console.log(err); 
        }
        var sum = 0;
        for (var i = 0; i < (body["Countries"]).length; i++) {
            sum += body["Countries"][i]["NewConfirmed"];
        }
        console.log(sum);
    });
}




var T = new Twitter(config);

// Set up your search parameters
var params = {
    q: '#nodejs',
    count: 10,
    result_type: 'recent',
    lang: 'en'
}

// T.get('search/tweets', params, function(err, data, response) {
//   if(!err){
//     // Loop through the returned tweets
//     for(let i = 0; i < data.statuses.length; i++){
//         // Get the tweet Id from the returned data
//         let id = { id: data.statuses[i].id_str }
//         // Try to Favorite the selected Tweet
//         T.post('favorites/create', id, function(err, response){
//           // If the favorite fails, log the error message
//           if(err){
//             console.log(err[0].message);
//           }
//           // If the favorite is successful, log the url of the tweet
//           else{
//             let username = response.user.screen_name;
//             let tweetId = response.id_str;
//             console.log('Favorited: ', `https://twitter.com/${username}/status/${tweetId}`)
//           }
//         });
//       }
//   } else {
//     console.log(err);
//   }
// })

