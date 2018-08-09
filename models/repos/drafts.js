'use strict';

class DraftsRepository {
    constructor(rep, pgp) {
        this.rep = rep;
        this.pgp = pgp;
    }

    recordDraftPosition(seasonId, playerId, platformId, draftTypeId, value) {
        const sql = `INSERT INTO "Draft_Positions"
            ("Season_ID", "Player_ID", "Platform_ID", "Draft_Type_ID", "Date", "Value")
            VALUES
            ($1, $2, $3, $4, NOW(), $5)`;
        return this.rep.none(sql, [seasonId, playerId, platformId, draftTypeId, value]);
    }
};

module.exports = DraftsRepository;