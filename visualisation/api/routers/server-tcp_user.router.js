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

/**
 *  @swagger
 *  /user/result/add:
 *    post:
 *      tags:
 *        - USERS
 *      description: Create new result with specified properties to insert the result into a specific user.
 *      parameters:
 *        - in: body
 *          name: result
 *          description: The result to create.
 *          schema:
 *            type: object
 *            required:
 *              - result
 *              - user
 *            properties:
 *              result:
 *                type: object
 *                properties:
 *                  experience:
 *                    type: string
 *                  reactTime:
 *                    type: number
 *                  execTime:
 *                    type: number
 *              user:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                  firstName:
 *                    type: string
 *                  password:
 *                    type: string
 *                  email:
 *                    type: string
 *                  age:
 *                    type: number
 *                  gender:
 *                    type: string
 *                  typeUser:
 *                    type: string
 *                  results:
 *                    type: array
 *            example:
 *              result:
 *                experience: "457870657269656e63652031"
 *                reactTime: 10
 *                execTime: 5
 *              user:
 *                name: John
 *                firstName: Doe
 *                password: mypassword
 *                email: john@example.com
 *                age: 30
 *                gender: Masculin
 *                typeUser: cobaye
 *                results: []
 *      responses:
 *        '200':
 *          description: User created succeffuly
 *        '449':
 *          description: User or email are already registered
 *        '500':
 *          description: Internal server error
 */
router.post("/result/add", controller.addResult);

module.exports = router;