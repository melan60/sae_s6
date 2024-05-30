const authService = require('../services/front_auth_service');
const jwt = require("jsonwebtoken");
const User = require("../models/user_model");

/**
 * This function is used to login a user
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json({
            message: 'Login successful',
            token: result.token,
            user: result.user,
        });
    } catch (error) {
        console.error('Error in login controller:', error); // Log the error
        res.status(401).json({ message: error.message });
    }
}

/**
 * Function used to get the results of the user
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getResults = async (req, res) => {
    try {
        const token = req.headers.token; //token
        const user = await authService.getResults(token);
        res.status(200).json({
            title: 'User fetched',
            user: user,
        });
    } catch (error) {
        console.error('Error in getResults controller:', error); // Log the error
        res.status(401).json({ title: 'unauthorized', message: error.message });
    }
}

/**
 * This function is used to get the current user
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const getCurrentUser = async (req, res) => {
    try {
        // Get the token from the request headers
        const token = req.headers.authorization.split(' ')[1];
        // Decode the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // Find the user by the decoded user ID
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user data
        res.status(200).json({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            name: user.name,
            typeUser: user.typeUser,
        });
    } catch (error) {
        console.error('Error in getCurrentUser controller : ', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = {
    login,
    getResults,
    getCurrentUser,
}
