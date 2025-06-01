import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// dotenv.config();

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Authentication token is missing' });
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({ success: false, message: 'Invalid authentication token' });
        }

        req.id = decode.userId;
        next();
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export default isAuthenticated;