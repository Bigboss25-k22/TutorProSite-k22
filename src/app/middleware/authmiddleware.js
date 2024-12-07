const jwt = require('jsonwebtoken');
const config = require('../../config/auth.config'); // Adjust the path as necessary

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(400).json({ message: 'Invalid token.' });
        }
       // console.log(decoded);
        req.user = decoded;
        next();
    });
};

// Middleware to authorize roles
const authorizeRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        console.log(roles);
        return res.status(403).json({ message: 'Access denied.' });
    }
    next();
};

module.exports = { authenticateToken, authorizeRoles };