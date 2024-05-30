const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user_model');

/**
 * This function is used to generate a token for the login
 * @param user
 * @returns {*}
 */
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}

/**
 * This function is used to login a user
 * @param email
 * @param password
 * @returns {Promise<{user: *, token: string}>}
 */
const login = async (email, password) => {
    const user = await User.findOne({ email }).exec();

    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch && (user.typeUser === 'cobaye' || user.typeUser === 'admin')) {
        const token = generateAccessToken({ userId: user._id, typeUser: user.typeUser });
        return {
            token: token,
            user: user,
        };
    } else if (!isMatch) {
        throw new Error('Login failed, retry your email or password.');
    } else {
        throw new Error('You are not authorized to login.');
    }
}

/**
 * Function used to get the results of the user
 * @param token
 * @returns {Promise<{email: *, name: *}>}
 */
const getResults = async (token) => {
    return new Promise((resolve, reject) => {
        // Verify the token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                reject(new Error('Token verification error'));
            } else {
                // Find the user
                User.findOne({ _id: decoded.userId }, (err, user) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            email: user.email,
                            name: user.name,
                        });
                    }
                });
            }
        });
    });
}


module.exports = {
    login,
    getResults,
};
