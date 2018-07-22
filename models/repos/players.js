'use strict';

class PlayersRepository {
    constructor(rep, pgp) {
        this.rep = rep;
        this.pgp = pgp;
    }

    findPlayer(fullName) {
        return this.rep.one(`SELECT *
        FROM "Players"
        WHERE levenshtein($1, "Full_Name") < 5
        ORDER BY levenshtein($1, "Full_Name")
        LIMIT 1`, [fullName]);
    }
};

module.exports = PlayersRepository;