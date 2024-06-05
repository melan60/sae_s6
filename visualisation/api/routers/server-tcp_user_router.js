const express = require("express");
const controller = require("../controllers/server_tcp_user_controller");
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
 *                type: string
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
 *                age: Adulte
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
 *                  error:
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
 *                    type: string
 *                  gender:
 *                    type: string
 *                  results:
 *                    type: array
 *            example:
 *              result:
 *                experience: "457870657269656e63652031"
 *                reactTime: 10
 *                execTime: 5
 *                error: 2
 *              user:
 *                name: Johnson
 *                firstName: Emily
 *                password: mypassword
 *                email: johnEmily@gmail.com
 *                age: Adulte
 *                gender: Féminin
 *                results: []
 *      responses:
 *        '200':
 *          description: User created successfully
 *        '449':
 *          description: User or email are already registered
 *        '500':
 *          description: Internal server error
 */
router.post("/result/add", controller.addResult);

/**
 *  @swagger
 *  /user/users:
 *    get:
 *      tags:
 *        - USERS
 *      description: Get all users
 *      responses:
 *        '200':
 *          description: Get all users successful
 *        '400':
 *          description: Bad request
 *        '500':
 *          description: Internal server error
 */
router.get("/users", controller.getAllUsers);

/**
 *  @swagger
 *  /user/cobayes:
 *    get:
 *      tags:
 *        - USERS
 *      description: Get all cobayes
 *      responses:
 *        '200':
 *          description: Get all cobayes successful
 *        '400':
 *          description: Bad request
 *        '500':
 *          description: Internal server error
 */
router.get('/cobayes', controller.getAllCobayes);

/**
 * @swagger
 * /user/cobayes:
 *  delete:
 *      tags:
 *          - USERS
 *      description: Delete all cobayes
 *      responses:
 *      '200':
 *          description: Delete all cobayes successful
 *      '500':
 *          description: Internal server error
 *      '400':
 *          description: Bad request
 */
router.delete('/cobayes', controller.deleteAllCobayes)

/**
 * @swagger
 * /user/users:
 *  delete:
 *      tags:
 *          - USERS
 *      description: Delete all users
 *      responses:
 *      '200':
 *          description: Delete all users successful
 *      '500':
 *          description: Internal server error
 *      '400':
 *          description: Bad request
 */
router.delete('/users', controller.deleteAllUsers)

/**
 *  @swagger
 *  /user:
 *    delete:
 *      tags:
 *        - USERS
 *      description: Delete a user by ID
 *      parameters:
 *        - in: query
 *          name: id
 *          type: integer
 *          required: true
 *          description: ID of the user
 *      responses:
 *        '200':
 *          description: Delete user successful
 *        '400':
 *          description: Bad request
 *        '500':
 *          description: Internal server error
 */
router.delete('/user/:id', controller.deleteUser)

module.exports = router;
