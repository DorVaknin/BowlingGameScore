const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../../src/server');
const gameRoutePrefix = '/api/game';
describe('Start New Game Endpoint Tests', () => {
    beforeEach(async () => {
        await cleanDb();
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
        });
    })
});


async function cleanDb () {
    await mongoose.connection.collections['games'].deleteMany({});
}