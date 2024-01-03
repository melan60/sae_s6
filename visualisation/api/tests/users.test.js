const assert = require('assert');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const sinon = require('sinon');

const db = require('../database/db.init');
const { User, Experience, Result } = require('../models/index_models');

const common_variables = require("../common_variables");
const controller = require('../controllers/front_graphs_controller');
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
