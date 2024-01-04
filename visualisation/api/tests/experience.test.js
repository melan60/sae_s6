const assert = require('assert');
const mongoose = require('mongoose');

const db = require('../database/db.init');
const { Experience, Module } = require('../models/index_models');

const controller = require('../controllers/server_tcp_experience_controller');
const service = require('../services/server_tcp_experience_service');


before(() => {
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

describe('Testing the createExperience service', function () {
    it('should create an experience', function () {

    });

    it('the number of the experience created is the correct one', function () {

    });

    it('should return an error because the experience is already registered', function () {

    });

    it('should return an error related to the type of stimulus', function () {

    });

    it('should return an error related to the module parameter', function () {

    });
});
