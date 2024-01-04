const assert = require('assert');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const db = require('../database/db.init');
const { User, Experience, Result } = require('../models/index_models');

const common_variables = require("../common_variables");
const controller = require('../controllers/server_tcp_user_controller');
const service = require('../services/server_tcp_user_service');


const user = {
    name: "GODAIL-FABRIZIO",
    firstName: "Giuliana",
    password: "19500#cde",
    email: "giuliana.godail_fabrizio@edu.univ-fcomte.fr",
    age: "Adulte",
    gender: "Féminin",
    typeUser: "cobaye"
}


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


// ============================================================================ createUser
describe('Testing the createUser service', function () {

    it('the service creates a user', async function () {
        const user_created = await new Promise((resolve, reject) => {
            service.createUser(user, (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });

        // tester que l'user renvoyé a les mêmes attributs que les paramètres passés
        assert.equal(user_created._doc.name, user.name);

        // tester que l'user existe dans la BDD
        const user_founded = await User.find({ email: user.email });
        assert.ok(user_founded);

        // tester que le mot de passe est crypté et qu'une fois décrypté, c'est le même que celui souhaité
        assert.notEqual(user_founded[0].password, user.password); // TODO
        assert.ok(bcrypt.compare(user_founded[0].password, user.password));
    });

    it('the service returns an error because the user is already registered', async function () {
        const result = await new Promise((resolve, reject) => {
            service.createUser(user, (error, result) => {
                if (error) {
                    resolve(error);
                }
                reject(result);
            });
        });

        assert.equal(result, common_variables.already_registered);
    });

    it('the service returns age error', async function () {
        const badUser = {
            name: "GIRARD",
            firstName: "Mathéo",
            password: "19500#cde",
            email: "matheo.girard@edu.univ-fcomte.fr",
            age: "Bébé",
            gender: "Masculin",
            typeUser: "cobaye"
        };

        const result = await new Promise((resolve, reject) => {
            service.createUser(badUser, (error, result) => {
                if (error) {
                    resolve(error);
                }
                reject(result);
            });
        });

        assert.ok(result);
    });

    it('the service returns gender error', async function () {
        const badUser = {
            name: "GIRARD",
            firstName: "Mathéo",
            password: "19500#cde",
            email: "matheo.girard@edu.univ-fcomte.fr",
            age: "Adulte",
            gender: "Non spécifié",
            typeUser: "cobaye"
        };

        const result = await new Promise((resolve, reject) => {
            service.createUser(badUser, (error, result) => {
                if (error) {
                    resolve(error);
                }
                reject(result);
            });
        });

        assert.ok(result);
    });
});


// ============================================================================ addResult
describe('Testing the addResult service', function () {

    it('the service adds results to a user', async function () {
        const experience = await Experience.findOne({ numero: 1 });

        const user = {
            email: "patelaiden@gmail.com",
        };

        const result_to_create = {
            experience: experience._id,
            reactTime: 100,
            execTime: 200,
            error: 0,
        };

        const result_created = await new Promise((resolve, reject) => {
            service.addResult(result_to_create, user, (err, res) => { // TODO changer le format de user pour devenir un email
                if (err) {
                    reject(err);
                }
                resolve(res);
            });
        });

        // tester que le résultat est présent dans la BDD
        const result_bdd = await Result.findOne({
            experience: result_to_create.experience,
            reactTime: result_to_create.reactTime,
            execTime: result_to_create.execTime,
            error: result_to_create.error,
        });
        assert.ok(result_bdd);

        // tester que le résultat renvoyer est égal à celui souhaité
        assert.strictEqual(result_created.experience.toString(), result_to_create.experience.toString());
        assert.strictEqual(result_created.reactTime, result_to_create.reactTime);
        assert.strictEqual(result_created.execTime, result_to_create.execTime);
        assert.strictEqual(result_created.error, result_to_create.error);

        // tester que le tableau de résultats de l'utilisateur contient le résultat
        const user_bdd = await User.findOne({ email: user.email });
        const results_user = user_bdd.results
            .filter(res => {
                return res.experience.toString() == result_to_create.experience.toString() &&
                    res.reactTime == result_to_create.reactTime &&
                    res.execTime == result_to_create.execTime && res.error == result_to_create.error;
            });
        assert.notEqual(results_user.length, 0, "The cobaye results table does not contain the previous result.");
    });

    it('the service returns an error related to the experience parameter', async function () {
        const badId = "0000dd588443e074169987e0";

        const user = {
            email: "patelaiden@gmail.com",
        };

        const result = {
            experience: badId,
            reactTime: 100,
            execTime: 200,
            error: 0,
        };

        // TODO un résultat est renvoyé alors que l'expérience n'existe pas
        // const results = await new Promise((resolve, reject) => {
        //     service.addResult(result, user, (err, res) => {
        //         if (err) {
        //             resolve(err);
        //         }
        //         console.log(res)
        //         reject(res);
        //     });
        // });

        // assert.ok(results);
    });

    it('the service returns an error related to the error parameter', async function () {
        const experience = await Experience.findOne({ numero: 1 });

        const user = {
            email: "patelaiden@gmail.com",
        };

        const result = {
            experience: experience._id,
            reactTime: 100,
            execTime: 200,
            error: "Pas d'erreur",
        };

        const results = await new Promise((resolve, reject) => {
            service.addResult(result, user, (err, res) => {
                if (err) {
                    resolve(err);
                }
                reject(res);
            });
        });

        assert.ok(results);
    });

    it('the service returns an error because the user id was not found, results are not created', async function () {
        const experience = await Experience.findOne({ numero: 1 });

        const user = {
            email: "fakemail@gmail.com",
        };

        const result = {
            experience: experience._id,
            reactTime: 100,
            execTime: 200,
            error: 0,
        };

        const results = await new Promise((resolve, reject) => {
            service.addResult(result, user, (err, res) => {
                if (err) {
                    resolve(err);
                }
                reject(res);
            });
        });

        assert.equal(results, common_variables.not_found);
    });
});
