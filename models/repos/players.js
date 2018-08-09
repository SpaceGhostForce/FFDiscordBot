'use strict';

class PlayersRepository {
    constructor(rep, pgp) {
        this.rep = rep;
        this.pgp = pgp;
    }

    findPlayer(fullName, teamAbbreviation, position) {
        let sql = '';
        let searchString = '';
        // If we have a DEF, we can search by the team abbreviation
        // This may be worth fixing, but Yahoo is kind of a jerk about this with the ADP boards.
        if (position == 'DEF') {
            sql = `SELECT p.*,
            $1 AS "Original_Name"
            FROM "Players" AS p
            LEFT JOIN "Player_Team_Seasons" AS p_t_s ON p_t_s."Player_ID" = p."Player_ID"
            LEFT JOIN "Team_Seasons" AS t_s ON p_t_s."Team_Season_ID" = t_s."Team_Season_ID"
            LEFT JOIN "Teams" AS t ON t_s."Team_ID" = t."Team_ID"
            WHERE p."Position" = 'DST'
            AND t."Team_Abbreviation" = $1
            LIMIT 1`;
            searchString = teamAbbreviation.toUpperCase();
        } else {
            sql = `SELECT *,
            $1 AS "Original_Name"
            FROM "Players"
            WHERE levenshtein($1, "Full_Name") < 5
            ORDER BY levenshtein($1, "Full_Name")
            LIMIT 1`
            searchString = fullName;
        }
        return this.rep.oneOrNone(sql, [searchString]);
    }
};

module.exports = PlayersRepository;