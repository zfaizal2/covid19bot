//the worker shit


let throng = require('throng');
let Queue = require("bull");
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


function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

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
        var num = formatNumber(sum);
        var tweet = `In the last 24 hours, there have been ${num} new confirmed cases of COVID-19.`;
        console.log(tweet);
        T.post('statuses/update', {status: tweet});
        console.log(sum);
    });
}

throng({ workers, start });
