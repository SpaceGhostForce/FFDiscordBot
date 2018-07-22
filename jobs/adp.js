const moment = require('moment');
const request = require('request');
const cheerio = require('cheerio');
const { URL } = require('url');
const db = require('../models');

db.players.findPlayer("Russell Wilson")
    .then(player => {
        console.log(player);
        return 0;
    });

// Constants
const numberOfPlayersToSave = 250;
const playersPerPage = 50;

// Yahoo Snake
const numberOfPages = Math.ceil(numberOfPlayersToSave / playersPerPage);
// Generate the pages to pull
const yahooSnakeURLs = [];
for (i = 0; i < numberOfPages; i += 1) {
    const currentCount = i * playersPerPage;
    yahooSnakeURLs.push("https://football.fantasysports.yahoo.com/f1/draftanalysis?tab=SD&pos=ALL&sort=DA_AP&count=" + currentCount);
}
// Grab all the pages using Promises
function adpScraper(url) {
    return new Promise(function(resolve, reject) {
        request(url, function(err, resp, body) {
            const startingRank = parseInt((new URL(url)).searchParams.get('count'), 10);

            var $ = cheerio.load(body),
                results = [];

            if (err) {
                reject(err);
            } else {
                $('div').find('.name').each(function(i, element){
                    // Send down an array with the rank and the name
                    const currentRank = startingRank + i + 1;
                    results.push({rank: currentRank, fullName: $(this).text().replace(/'/g, '')});
                });
                resolve(results);
            }
        });
    });
}
scrapers = yahooSnakeURLs.map(adpScraper);

Promise.all(scrapers)
    .then(function(scrapes) {
        scrapes.forEach(scrape => {
            console.log(scrape);
        });
    }, function(error) {
    })
    .then(() => {
        // I'm doing this because the process hangs because the database will not disconnect.
        // This feels awful, please figure out what I'm doing wrong and fix it, future me
        process.exit();
    });
// For each page, grab each player and save them to the database

// Yahoo Auction

// ESPN