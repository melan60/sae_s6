const assert = require('assert');
const mongoose = require('mongoose');

const common_variables = require('../common_variables');
const db = require('../database/db.init');
const { Experience, Module } = require('../models/index_models');

const controller = require('../controllers/server_tcp_experience_controller');
const service = require('../services/server_tcp_experience_service');


before(async () => {
    let dev_db_url = process.env.DOCKER_MONGO ?
        `mongodb://${process.env.DOCKER_MONGO}:27017/saeS5Test` :
        `mongodb://127.0.0.1/saeS5Test`;

    await mongoose.connect(dev_db_url);
    await db.initBdD();
});


// ============================================================================ createExperience
describe('Testing the createExperience service', function () {

    it('should create an experience', async function () {

        const module = await Module.findOne({ name: "module1" });
        if (!module) {
            throw new Error("Module 'module1' non trouvé dans la base de données");
        }

        const experienceData = {
            name: 'Expérience n°1',
            typeStimulus: 'Visuel',
            distraction: '',
            modules: module._id,
        };

        const experience_created = await new Promise((resolve, reject) => {
            service.createExperience(experienceData, (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });

        // le résultat a les mêmes attributs que ceux souhaités
        assert.ok(experience_created);
        assert.equal(experience_created._doc.name, experienceData.name);
        assert.equal(experience_created._doc.modules[0].toString(), experienceData.modules.toString());

        // l'experience est enregistrée dans la BDD
        const experience_bdd = await Experience.findOne({ name: experienceData.name });
        assert.ok(experience_bdd);
    });

    it('the number of the experience created is the correct one', async function () {
        const experiences = await Experience.find();
        const module = await Module.findOne({ name: "module1" });
        const experienceData = {
            name: 'Expérience n°2',
            typeStimulus: 'Visuel',
            distraction: '',
            modules: module._id,
        };

        const experience_created = await new Promise((resolve, reject) => {
            service.createExperience(experienceData, (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });

        const experience_bdd = await Experience.findOne({ name: experience_created.name });
        assert.equal(experiences.length+1, experience_bdd.numero);
    });

    it('should return an error because the experience is already registered', async function () {
        const module = await Module.findOne({ name: "module1" });
        const experienceData = {
            name: 'Expérience n°1',
            typeStimulus: 'Visuel',
            distraction: '',
            modules: module._id,
        };

        const error = await new Promise((resolve, reject) => {
            service.createExperience(experienceData, (err, result) => {
                if (err) {
                    resolve(err);
                }
                reject(result);
            });
        });

        assert.equal(error, common_variables.already_registered);
    });

    it('should return an error related to the module parameter', async function () {
        const experienceData = {
            name: 'Test Experience 4',
            typeStimulus: 'Test Stimulus 4',
            distraction: 'Test Distraction 4',
            modules: "Invalide",
        };

        const error = await new Promise((resolve, reject) => {
            service.createExperience(experienceData, (err, result) => {
                if (err) {
                    resolve(err);
                } else {
                    reject(result);
                }
            });
        });
        assert.ok(error);
    });
});

// ============================================================================ getLastExperience
describe('Testing the getLastExperience service', function () {

    it('should get the last created experience', async function () {
        const experiences = await Experience.find();

        const last_experience = await new Promise((resolve, reject) => {
            service.getLastExperience((error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });

        // le résultat a les mêmes attributs que ceux souhaités
        assert.ok(last_experience);
        assert.equal(last_experience._doc.numero, experiences.length);
    });
});

after(async function () {
    await mongoose.connection.db.dropDatabase();
});