const express = require('express');
const controller = require('../controllers/front_auth.controller');
const router = express.Router();

/**
 * @swagger
 * /auth:
 *   get:
 *      description: Get results for one people
 *      tags:
 *          - AUTHENTIFICATION
 *      parameters:
 *          - in: query
 *            name: email
 *            type: string
 *            required: true
 *            description: Email of the user
 *          - in: query
 *            name: password
 *            type: string
 *            required: true
 *            description: Password of the user
 *      responses:
 *          '200':
 *              description: Results gotten successfully
 *          '404':
 *              description: Not found
 *          '500':
 *              description: Internal server error
 */
router.get("/", controller.connectToFront);

module.exports = router;