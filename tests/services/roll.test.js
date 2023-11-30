const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../../src/server');
const testCases = require('../rollTestCases.json');
const { before } = require('mocha');
const gameRoutePrefix = '/api/game';
const rollEndpoint = `${gameRoutePrefix}/roll`
describe('Record roll Endpoint Tests', () => {
    context('Scoring tests', () => {
        describe(`${testCases.OpenFrameTest.describe}`, () => {
            let gameId;
            before(async () => {
                await cleanDb;
                gameId = await getGameId();
                await request(app)
                .post(rollEndpoint)
                .send({ gameId: gameId, pins: testCases.OpenFrameTest.inputs.frame1[0] });
                res = await request(app)
                .post(rollEndpoint)
                .send({ gameId: gameId, pins: testCases.OpenFrameTest.inputs.frame1[1] });
            })
            it(`${testCases.OpenFrameTest.it}`, async () => {
                let frameScore = res._body.frames[0].frameScore;
                let totalScore = res._body.currentScore;
                expect(frameScore).to.equal(testCases.OpenFrameTest.expected.frameScore);
                expect(totalScore).to.equal(testCases.OpenFrameTest.expected.totalScore);
            });
        });
         describe(`${testCases.SpareTest.describe}`, () => {
            let gameId;
            before(async () => {
                await cleanDb;
                gameId = await getGameId();
                await request(app)
                    .post(rollEndpoint)
                    .send({ gameId: gameId, pins: testCases.SpareTest.inputs.frame1[0] });
                res = await request(app)
                    .post(rollEndpoint)
                    .send({ gameId: gameId, pins: testCases.SpareTest.inputs.frame1[1] });
            });
            it(`${testCases.SpareTest.it}`, async () => {
                let frameScore = res._body.frames[0].frameScore;
                let totalScore = res._body.currentScore;
                expect(frameScore).to.equal(testCases.SpareTest.expected.frameScore);
                expect(totalScore).to.equal(testCases.SpareTest.expected.totalScore);
            });
        });

        describe(`${testCases.StrikeTest.describe}`, () => {
            let gameId;
            before(async () => {
                await cleanDb;
                gameId = await getGameId();
                res = await request(app)
                    .post(rollEndpoint)
                    .send({ gameId: gameId, pins: testCases.StrikeTest.inputs.frame1[0] });
            });
            it(`${testCases.StrikeTest.it}`, async () => {
                let frameScore = res._body.frames[0].frameScore;
                let totalScore = res._body.currentScore;
                expect(frameScore).to.equal(testCases.StrikeTest.expected.frameScore);
                expect(totalScore).to.equal(testCases.StrikeTest.expected.totalScore);
            });
        });

        describe(`${testCases.ConsecutiveStrikesTest.describe}`, () => {
            let gameId;
            before(async () => {
                await cleanDb;
                gameId = await getGameId();
                await request(app)
                    .post(rollEndpoint)
                    .send({ gameId: gameId, pins: testCases.ConsecutiveStrikesTest.inputs.frame1[0] });
                res = await request(app)
                    .post(rollEndpoint)
                    .send({ gameId: gameId, pins: testCases.ConsecutiveStrikesTest.inputs.frame2[0] });
            });
            it(`${testCases.ConsecutiveStrikesTest.it}`, async () => {
                let frameScores = res._body.frames.map(frame => frame.frameScore);
                let totalScore = res._body.currentScore;
                expect(frameScores.filter(element => element !== 0)).to.eql([testCases.ConsecutiveStrikesTest.expected.frameScore[0], testCases.ConsecutiveStrikesTest.expected.frameScore[1]]);
                expect(totalScore).to.equal(testCases.ConsecutiveStrikesTest.expected.totalScore);
            });
        });

        describe(`${testCases.ConsecutiveSparesTest.describe}`, () => {
            let gameId;
            before(async () => {
                await cleanDb;
                gameId = await getGameId();
                await request(app)
                    .post(rollEndpoint)
                    .send({ gameId: gameId, pins: testCases.ConsecutiveSparesTest.inputs.frame1[0] });
                await request(app)
                    .post(rollEndpoint)
                    .send({ gameId: gameId, pins: testCases.ConsecutiveSparesTest.inputs.frame1[1] });
                await request(app)
                    .post(rollEndpoint)
                    .send({ gameId: gameId, pins: testCases.ConsecutiveSparesTest.inputs.frame2[0] });
                res = await request(app)
                    .post(rollEndpoint)
                    .send({ gameId: gameId, pins: testCases.ConsecutiveSparesTest.inputs.frame2[1] });
            });
            it(`${testCases.ConsecutiveSparesTest.it}`, async () => {
                let frameScores = res._body.frames.map(frame => frame.frameScore);
                let totalScore = res._body.currentScore;
                expect(frameScores.filter(element => element !== 0)).to.eql([testCases.ConsecutiveSparesTest.expected.frameScore[0], testCases.ConsecutiveSparesTest.expected.frameScore[1]]);
                expect(totalScore).to.equal(testCases.ConsecutiveSparesTest.expected.totalScore);
            });
        });

        describe(`${testCases.StrikeInAllFramesTest.describe}`, () => {
            let gameId;
            before(async () => {
                await cleanDb;
                gameId = await getGameId();
                for (let frame = 1; frame <= 9; frame++) {
                    await request(app)
                        .post(rollEndpoint)
                        .send({ gameId: gameId, pins: 10 });
                }
                await request(app)
                    .post(rollEndpoint)
                    .send({ gameId: gameId, pins: testCases.StrikeInAllFramesTest.inputs.frame10[0] });
                await request(app)
                    .post(rollEndpoint)
                    .send({ gameId: gameId, pins: testCases.StrikeInAllFramesTest.inputs.frame10[1] });
                res = await request(app)
                    .post(rollEndpoint)
                    .send({ gameId: gameId, pins: testCases.StrikeInAllFramesTest.inputs.frame10[2] });
            });
            it(`${testCases.StrikeInAllFramesTest.it}`, async () => {
                let frameScore = res._body.frames[9].frameScore;
                let totalScore = res._body.currentScore;
                expect(frameScore).to.equal(testCases.StrikeInAllFramesTest.expected.frameScore);
                expect(totalScore).to.equal(testCases.StrikeInAllFramesTest.expected.totalScore);
            });
        });

        describe(`${testCases.StrikeInTenthFrameOnlyTest.describe}`, () => {
            let gameId;
            before(async () => {
                await cleanDb;
                gameId = await getGameId();
                for (let frame = 1; frame <= 9; frame++) {
                    await request(app)
                        .post(rollEndpoint)
                        .send({ gameId: gameId, pins: 4 });
                    await request(app)
                        .post(rollEndpoint)
                        .send({ gameId: gameId, pins: 5 });
                }
                await request(app)
                    .post(rollEndpoint)
                    .send({ gameId: gameId, pins: testCases.StrikeInTenthFrameOnlyTest.inputs.frame10[0] });
                await request(app)
                    .post(rollEndpoint)
                    .send({ gameId: gameId, pins: testCases.StrikeInTenthFrameOnlyTest.inputs.frame10[1] });
                res = await request(app)
                    .post(rollEndpoint)
                    .send({ gameId: gameId, pins: testCases.StrikeInTenthFrameOnlyTest.inputs.frame10[2] });
            });
            it(`${testCases.StrikeInTenthFrameOnlyTest.it}`, async () => {
                let frameScore = res._body.frames[9].frameScore;
                let totalScore = res._body.currentScore;
                expect(frameScore).to.equal(testCases.StrikeInTenthFrameOnlyTest.expected.frameScore);
                expect(totalScore).to.equal(testCases.StrikeInTenthFrameOnlyTest.expected.totalScore);
            });
        });


    });
});


async function cleanDb () {
    await mongoose.connection.collections['games'].deleteMany({});
}

async function getGameId () {
    const res =  await request(app)
    .post(`${gameRoutePrefix}/start`)
    .send({"playerName": "Dor Vaknin"});
    return res.body._id;
}