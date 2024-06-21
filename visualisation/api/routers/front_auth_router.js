const express = require('express');
const controller = require('../controllers/front_auth_controller');
const middleware = require("../middlewares/auth_middleware");
const router = express.Router();


router.post('/login', controller.login);

/**
 * @swagger
 * /api/results:
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
router.get("/results", controller.getUserInfoFromToken);

/**
 * Get the current user logged to identify the user when reloading the page
 */
router.get('/me', middleware.authenticateJWT, controller.getCurrentUser);

module.exports = router;