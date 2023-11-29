const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../../src/server');
const gameRoutePrefix = '/api/game';
describe('Bowling Game API Tests', () => {
    beforeEach(async () => {
        await setUpDbForTest();
    });
    describe('Creating new game', () => {
        let gameId;
        // Test for starting a new game
        it('POST /start - Start a new game', async () => {
            const res = await request(app)
                .post(`${gameRoutePrefix}/start`)
                .send({"playerName": "Dor Vaknin"});
            expect(res.statusCode).to.equal(201);
            expect(res.body).to.have.property('_id');
            gameId = res.body._id; // Store game ID for future tests
        });
    })

    describe('Basic scoring tests', () => {
        let gameId;

        it('POST /start - Start a new game', async () => {
            const res = await request(app)
                .post(`${gameRoutePrefix}/start`)
                .send({"playerName": "Dor Vaknin"});
            expect(res.statusCode).to.equal(201);
            expect(res.body).to.have.property('_id');
            gameId = res.body._id; // Store game ID for future tests
        });

        // Test for recording a roll - normal case
        it('POST /roll - Record a normal roll', async () => {
            const res = await request(app)
                .post(`${gameRoutePrefix}/roll`)
                .send({ gameId: gameId, pins: 4 });
            expect(res.statusCode).to.equal(200);
            // Assertions about the game state can be added here
        });

        // Test for recording a strike
        it('POST /roll - Record a strike', async () => {
            const res = await request(app)
                .post(`${gameRoutePrefix}/roll`)
                .send({ gameId: gameId, pins: 6 });
            expect(res.statusCode).to.equal(200);
            // Assertions about the strike and subsequent game state
        });

        // Test for recording a spare
        it('POST /roll - Record a spare', async () => {
            // First roll of the frame
            let res = await request(app)
                .post(`${gameRoutePrefix}/roll`)
                .send({ gameId: gameId, pins: 6 });
            expect(res.statusCode).to.equal(200);

            // Second roll of the frame to complete the spare
            res = await request(app)
                .post(`${gameRoutePrefix}/roll`)
                .send({ gameId: gameId, pins: 4 });
            expect(res.statusCode).to.equal(200);
            // Assertions about the spare and subsequent game state
        });
    })
});


async function cleanDb () {
    await mongoose.connection.collections['games'].deleteMany({});
}

async function setUpDbForTest () {
    await cleanDb;
    await request(app)
    .post(`${gameRoutePrefix}/start`)
    .send({"playerName": "Dor Vaknin"});
}