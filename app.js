// app.js

// the server shit
var config = require('./config.js');
const bodyParser = require("body-parser")

const https = require('https')
const request = require('request')

var express = require ('express');
let Queue = require('bull');

var app = express();
const port = 3000;



//worker stuff
var Twitter = require('twitter');
var T = new Twitter(config);

// Connect to a local redis intance locally, and the Heroku-provided URL in production
let REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
let workers = process.env.WEB_CONCURRENCY || 2;

// The maxium number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network 
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
let maxJobsPerWorker = 50;
let workQueue = new Queue('work', REDIS_URL);




app.use(bodyParser.urlencoded({ 
     extended: true 
}));
 
app.use(bodyParser.json()); 

app.get('/hook', (req, res) => res.sendFile('index.html', { root: __dirname }));






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
    console.log("hooks")
    //console.log(req.body.json) // Call your action on the request here
    let job = workQueue.add();
    const site = req.body['URL']
    console.log(site)
    tweetSummary(site)
    res.send({"result":"success"})
    res.status(200).end() // Responding is important
})

app.post("/replies", (req, res) => {
    let job = workQueue.add();
    console.log("replies")
    //console.log(req.body.json) // Call your action on the request here
    //const sum = req.body['URL']
    //console.log(sum)
    //tweetSummary(sum)
    res.send({"result":"success"})
    res.status(200).end() // Responding is important
})

workQueue.on('global:completed', (jobId, result) => {
    console.log(`Job completed with result ${result}`);
  });

// function formatNumber(num) {
//     return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
// }

// function tweetSummary(url) {
//     console.log('hey!')
//     request(url, { json: true }, (err, res, body) => {

//         if (err) { 
//             return console.log(err); 
//         }
//         var sum = 0;
//         for (var i = 0; i < (body["Countries"]).length; i++) {
//             sum += body["Countries"][i]["NewConfirmed"];
//         }
//         var num = formatNumber(sum);
//         var tweet = `In the last 24 hours, there have been ${num} new confirmed cases of COVID-19.`;
//         console.log(tweet);
//         T.post('statuses/update', {status: tweet});
//         console.log(sum);
//     });
// }

app.listen(process.env.PORT || 3000, function () { 
    console.log("SERVER STARTED PORT: 3000"); 
});



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

//the worker shit


function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function tweetSummary(url) {
    console.log('hey!')
    request(url, { json: true }, (err, res, body) => {
        if(res.statusCode >= 400) {
            return;
        }
        if (err) { 
            return console.log("error"); 
        }
        var sum = 0;
        var recovered =0;
        for (var i = 0; i < (body["Countries"]).length; i++) {
            sum += body["Countries"][i]["NewConfirmed"];
        }
        for (var i = 0; i < (body["Countries"]).length; i++) {
            recovered += body["Countries"][i]["NewRecovered"];
        }

        var num = formatNumber(sum);
        var recover = formatNumber(recovered);
        var tweet = `In the last 24 hours, there have been ${num} new confirmed cases of COVID-19 and ${recover} new recovered patients.`;
        console.log(tweet);
        T.post('statuses/update', {status: tweet});
        console.log(sum);
    });
}

