const assert = require('assert');
const mongoose = require('mongoose');

const db = require('../database/db.init');
const { User } = require('../models/index_models');

const controller = require('../controllers/front_graphs_controller');
const service = require('../services/front_graphs_service');


before(async () => {

    let dev_db_url;
    if (process.env.DOCKER_MONGO) {
        dev_db_url = `mongodb://${process.env.DOCKER_MONGO}:27017/saeS5Test`
    } else {
        dev_db_url = `mongodb://127.0.0.1/saeS5Test`;
    }

    mongoose.connect(dev_db_url)
        .then(async () => {
            await db.initBdD();
        })
        .catch(e => console.error(e)); // server
});


describe('Testing the getIndividualData service', function () {

    it('the service returns an array of length 2 with the results of the cobaye', async function () {
        const user = await User.findOne({ email: "patelaiden@gmail.com" });
        const results = await new Promise((resolve, reject) => {
            service.getIndividualData(user._id, (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });

        const expectedLength = 2;
        assert.strictEqual(results.length, expectedLength, `Length array ${expectedLength} expected ; got length array ${results.length}`);

        const expectedData = user.results.map(exp => exp.error);
        assert.deepEqual(results[1].data, expectedData, `Expected error ${expectedData}; got ${results[1].data}`);
    });

    it('the service returns an error related to the user id', async function () {
        const results = await new Promise((resolve, reject) => {
            service.getIndividualData(1, (error, result) => {
                if (error) {
                    resolve(error);
                }
                reject(result)
            });
        });
        assert.ok(results);
    });
});


describe('Testing the makeAnAverage service', function () {

    it('should calculate the average', function () {
        const length = 4;
        const testData = [
            { data: [] },
            {
                first: { data: [] },
                second: { data: [] }
            }
        ];
        const expectedData = JSON.parse(JSON.stringify(testData));

        for (let i = 1; i <= length; i++) {
            let pos0 = Math.pow(i, 5);
            let pos1 = i * 42 / 89;
            let pos2 = Math.sqrt(i);

            testData[0].data.push(pos0);
            testData[1].first.data.push(pos1);
            testData[1].second.data.push(pos2);

            expectedData[0].data.push(pos0 / length);
            expectedData[1].first.data.push(pos1 / length);
            expectedData[1].second.data.push(pos2 / length);
        }

        service.makeAnAverage(testData, length);
        assert.deepEqual(testData, expectedData, 'Les résultats après la moyenne ne correspondent pas aux attentes.');
    });
});
