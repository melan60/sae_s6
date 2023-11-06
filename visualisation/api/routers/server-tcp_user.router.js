const express = require('express');
const controller = require('../controllers/server-tcp_user.controller');
const router = express.Router();

/**
 *  @swagger
 *  /user/add:
 *    post:
 *      tags:
 *        - USERS
 *      description: Create a new user with the specified properties.
 *      parameters:
 *        - in: body
 *          name: user
 *          description: The user to create.
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - firstName
 *              - password
 *              - email
 *              - age
 *              - gender
 *              - typeUser
 *            properties:
 *              name:
 *                type: string
 *              firstName:
 *                type: string
 *              password:
 *                type: string
 *              email:
 *                type: string
 *              age:
 *                type: number
 *              gender:
 *                type: string
 *              typeUser:
 *                type: string
 *            example:
 *              user:
 *                name: John
 *                firstName: Doe
 *                password: mypassword
 *                email: john@example.com
 *                age: 30
 *                gender: Masculin
 *                typeUser: cobaye
 *      responses:
 *        '200':
 *          description: User created succeffuly
 *        '449':
 *          description: User or email are already registered
 *        '500':
 *          description: Internal server error
 */
router.post("/add", controller.createUser);

module.exports = router;