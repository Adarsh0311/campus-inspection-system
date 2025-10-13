const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            req.user = decodedToken; //this contains userId, role

            next();

        } catch (error) {
            return res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return  res.status(401).json({ error: 'Not authorized, no token' });
    }

}


function adminMiddleware(req, res, next) {
    if (req.user && req.user.role === 'ADMIN') {
        next();

    } else {

        res.status(403).json({ error: 'User lacks necessary permissions to perform this action' });
    }
}




module.exports = {authMiddleware, adminMiddleware};