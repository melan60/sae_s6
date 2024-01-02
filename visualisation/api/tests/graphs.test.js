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

    it('The service returns an array of length 2 with the results of the cobaye', async function () {
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

    it('The service returns an error related to the user id', async function () {
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
