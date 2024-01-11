const mongoose = require('mongoose');
const sinon = require('sinon');

const db = require('../database/db.init');
const controller = require('../controllers/front_auth_controller');
const { User } = require('../models/index_models');
const assert = require('assert');


const flushPromises = () => new Promise(setImmediate);


before(async () => {
    let dev_db_url = process.env.DOCKER_MONGO ?
        `mongodb://${process.env.DOCKER_MONGO}:27017/saeS5Test` :
        `mongodb://127.0.0.1/saeS5Test`;

    await mongoose.connect(dev_db_url);
    await db.initBdD();
});


// ============================================================================ login
describe('Testing the login service', function () {

    afterEach(() => {
        sinon.restore();
    });

    it('should return a status 401 because the user is not found', async function () {
        const req = { body: { email: 'badEmail@gmail.com', password: 'Patel' } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

        await controller.login(req, res);
        sinon.assert.calledWith(res.status, 401);
        sinon.assert.calledWith(res.json, { message: 'Login failed' });
    });

    it('should return an error because of password mismatch', async function () {
        const req = { body: { password: 'EmilyDu13', email: 'johnEmily@gmail.com' } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

        await User.find()
        await controller.login(req, res);
        sinon.assert.calledWith(res.status, 401);
        sinon.assert.calledWith(res.json, { message: 'Login failed, retry your email or password' });
    });

    it('should return an error because user is not a cobaye', async function () {
        const req = { body: { password: 'Johnson', email: 'johnEmily@gmail.com' } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

        await controller.login(req, res);
        sinon.assert.calledWith(res.status, 401);
        sinon.assert.calledWith(res.json, { message: 'You are not authorized to login.' });
    });

    it("should return an error because the test file can't access the env value", async function () {
        const req = { body: { email: "patelaiden@gmail.com", password: "Patel" } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

        await controller.login(req, res);
        sinon.assert.calledWith(res.status, 500);
        sinon.assert.calledWith(res.json, { message: '\nInternal server error' });
    });

    // TODO changer dans la partie dev pour renvoyer status 200, messages d'erreurs, 
    // it('should connect the user', async function () {
    //     const req = { body: { email: "patelaiden@gmail.com", password: "Patel" } };
    //     const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    //     await controller.login(req, res);
    //     // assert.ok(res.json.token);
    //     console.log("machin", process.env.ACCESS_TOKEN_SECRET)
    //     const user = await User.findOne({ email: "patelaiden@gmail.com" });
    //     assert.ok(user);
    //     // assert.equal(res.json.user, user);
    //     // sinon.assert.calledWith(res.status, 200);
    //     // sinon.assert.calledWith(res.json, { message: 'Connected' });
    // });
});

after(async function () {
    await mongoose.connection.db.dropDatabase();
});
