const jwt = require('jsonwebtoken');

// ============================================================
// verifyToken middleware
//
// How JWT authentication works:
// 1. User logs in via POST /api/v1/auth/login
// 2. Server creates a token and sends it back
// 3. User stores this token (in a mobile app or React app)
// 4. For every protected request, user sends the token in the header like:
//    Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
// 5. This middleware reads that header, checks the token, and if valid
//    attaches the user info to req.user so the route can use it
// ============================================================

function verifyToken(req, res, next) {

    // Step 1: Read the Authorization header
    // It looks like: "Bearer eyJhbGciOiJIUzI1NiIs..."
    const authHeader = req.headers['authorization'];

    // Step 2: Check if the header exists at all
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided. Please log in first.'
        });
    }

    // Step 3: The header has two parts: "Bearer" and the actual token
    // We split by space and take the second part (index 1)
    const token = authHeader.split(' ')[1];

    // Step 4: Check if the token part exists after splitting
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. Token format should be: Bearer <token>'
        });
    }

    // Step 5: Verify the token using our secret key
    // If the token was tampered with or expired, jwt.verify will throw an error
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Step 6: Attach the decoded user info to req.user
        // Now any route that uses this middleware can access req.user
        req.user = decoded;

        // Step 7: Call next() to continue to the actual route
        next();

    } catch (err) {

        // Token is invalid or expired
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired. Please log in again.'
            });
        }

        return res.status(403).json({
            success: false,
            message: 'Invalid token. Access forbidden.'
        });
    }
}

module.exports = verifyToken;
