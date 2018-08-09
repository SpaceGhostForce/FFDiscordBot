const moment = require('moment');
const request = require('request');
const cheerio = require('cheerio');
const { URL } = require('url');
const db = require('../models');

// Constants
const numberOfPlayersToSave = 250;
const playersPerPage = 50;

// TODO: Make this pull from database;
const currentSeasonId = 1;
const platformIdEspn = 1;
const platformIdYahoo = 2;
const draftTypeIdSnake = 1;
const draftTypeIdAuction = 2;

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
                $('div').find('.ysf-player-name').each(function(i, element){
                    // Send down an array with the rank and the name
                    const currentRank = startingRank + i + 1;
                    const [teamAbbreviation, position] = $(this).children('SPAN').first().text().split(' - ');
                    results.push({rank: currentRank,
                        fullName: $(this).children('.name').first().text().replace(/'/g, ''),
                        teamAbbreviation: teamAbbreviation,
                        position: position,
                    });
                });
                resolve(results);
            }
        });
    });
}
yahooSnakeScrapers = yahooSnakeURLs.map(adpScraper);

const playerFullNames = [];
Promise.all(yahooSnakeScrapers)
    .then(function(scrapes) {
        // First, we need to put all the players into one big array
        scrapes.forEach(scrape => {
            scrape.forEach((player) => {
                playerFullNames.push(player);
            });
        });
        return playerFullNames;
    }, function(error) {
    })
    .then((playerFullNames) => {
        // Next, we need to get all of the player IDs
        return Promise.all(playerFullNames.map((player) => {
            return db.players.findPlayer(player.fullName, player.teamAbbreviation, player.position);
        }));
    })
    .then((playerRecords) => {
        // Lastly, we need to insert all of the records.
        // return Promise.all(playerFullNames.map((player) => {
        //     return db.drafts.recordDraftPosition(currentSeasonId, player.Player_ID, platformIdYahoo, draftTypeIdSnake, 1)
        // }));
        for (let i = 0; i < playerFullNames.length; i += 1) {
            // Now that we have a full list of players, we need to insert all of these into the
            // draft positions to save it.
            const player = playerRecords[i];
            if (player) {
                // const rank = playerFullNames.find(playerSearch => {
                //     return player.Full_Name === player.fullName
                // });
                if (playerFullNames[i].rank === 1) {
                    console.log(playerFullNames[i]);
                    console.log(player);
                }
                // console.log(rank);
            }
        }
    });

// Yahoo Auction

// ESPN