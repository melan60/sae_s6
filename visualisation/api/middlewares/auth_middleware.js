const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate JWT token
 * @param req
 * @param res
 * @param next
 */
exports.authenticateJWT = (req, res, next) => {
    console.log('passage middleware');
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.error('JWT Verification Error:', err);
                return res.status(403).json({ error: 'Invalid or expired token' });
            }
            req.user = user;
            next();
        });

        console.log("passage middleware fin")
    } else {
        res.status(401).json({ error: 'jwt must be provided' });
    }
};
