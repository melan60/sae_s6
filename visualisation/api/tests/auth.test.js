const mongoose = require('mongoose');
const sinon = require('sinon');

const db = require('../database/db.init');
const controller = require('../controllers/front_auth_controller');


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

    // TODO changer dans la partie dev pour renvoyer status 200, messages d'erreurs, 
    // it('should connect the user', async function () {
    //     const req = { body: { email: "patelaiden@gmail.com", password: "Patel" } };
    //     const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    //     const result = await controller.login(req, res);
    //     await flushPromises();
    //     sinon.assert.calledWith(res.status, 200);
    // });

    it('should return a status 401 because the user is not found', async function () {
        const req = { body: { email: "badEmail@gmail.com", password: "Patel" } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

        await controller.login(req, res);
        await flushPromises(); // TODO vmt utile ?
        sinon.assert.calledWith(res.status, 401);
        sinon.assert.calledWith(res.json, { message: 'Login failed' });
    });

    it('should return an error because of password mismatch', async function () {
        const req = { body: { email: "patelaiden@gmail.com", password: "AidenDu13" } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

        await controller.login(req, res);
        sinon.assert.calledWith(res.status, 401);
        sinon.assert.calledWith(res.json, { message: 'You are not authorized to login.' });
    });
});

after(async function () {
    await mongoose.connection.db.dropDatabase();
});
