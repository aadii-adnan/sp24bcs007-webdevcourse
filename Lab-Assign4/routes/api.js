const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const verifyToken = require('../middleware/verifyToken');


// ============================================================
// HELPER: sends a standard success response
// Having one format makes the API predictable for any frontend
// ============================================================
function sendSuccess(res, statusCode, message, data = {}) {
    return res.status(statusCode).json({
        success: true,
        message: message,
        data: data
    });
}

// ============================================================
// HELPER: sends a standard error response
// ============================================================
function sendError(res, statusCode, message) {
    return res.status(statusCode).json({
        success: false,
        message: message
    });
}


// ============================================================
// PUBLIC ROUTE 1: POST /api/v1/auth/login
// The user sends email and password, gets back a JWT token
// ============================================================
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return sendError(res, 400, 'Email and password are required.');
        }

        // Find the user in the database
        const user = await User.findOne({ email: email });
        if (!user) {
            return sendError(res, 401, 'Invalid email or password.');
        }

        // Check if the password is correct
        const passwordCorrect = await user.comparePassword(password);
        if (!passwordCorrect) {
            return sendError(res, 401, 'Invalid email or password.');
        }

        // Create the JWT token
        // jwt.sign() takes 3 things:
        // 1. The payload — data we want to store inside the token
        // 2. The secret key — used to sign/verify the token
        // 3. Options — like when the token expires
        const token = jwt.sign(
            {
                user_id: user._id,   // stored inside the token
                role: user.role      // stored inside the token
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE  // e.g. '1h'
            }
        );

        // Send the token back to the client
        return sendSuccess(res, 200, 'Login successful.', {
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            expiresIn: process.env.JWT_EXPIRE
        });

    } catch (err) {
        console.error(err);
        return sendError(res, 500, 'Server error. Please try again.');
    }
});


// ============================================================
// PUBLIC ROUTE 2: GET /api/v1/products
// Returns a paginated, filterable list of products as JSON
// Supports: ?page=1&search=panadol&category=Medicine&minPrice=100&maxPrice=500
// ============================================================
router.get('/products', async (req, res) => {
    try {
        // Read query parameters (same logic as the EJS products page)
        const page     = parseInt(req.query.page)      || 1;
        const search   = req.query.search               || '';
        const category = req.query.category             || '';
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || 999999;
        const LIMIT    = parseInt(req.query.limit)      || 8;

        // Build the MongoDB filter object
        const queryObject = {};
        if (search)   queryObject.name     = { $regex: search, $options: 'i' };
        if (category) queryObject.category = category;
        queryObject.price = { $gte: minPrice, $lte: maxPrice };

        const skip = (page - 1) * LIMIT;

        // Get total count for pagination info
        const totalProducts = await Product.countDocuments(queryObject);
        const totalPages    = Math.ceil(totalProducts / LIMIT);

        // Fetch the products
        const products = await Product.find(queryObject)
            .skip(skip)
            .limit(LIMIT)
            .lean();

        return sendSuccess(res, 200, 'Products fetched successfully.', {
            products,
            pagination: {
                currentPage:   page,
                totalPages:    totalPages,
                totalProducts: totalProducts,
                limit:         LIMIT,
                hasNextPage:   page < totalPages,
                hasPrevPage:   page > 1
            }
        });

    } catch (err) {
        console.error(err);
        return sendError(res, 500, 'Server error fetching products.');
    }
});


// ============================================================
// PUBLIC ROUTE 3: GET /api/v1/products/:id
// Returns a single product by its MongoDB ID
// ============================================================
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();

        if (!product) {
            return sendError(res, 404, 'Product not found.');
        }

        return sendSuccess(res, 200, 'Product fetched successfully.', { product });

    } catch (err) {
        // If the ID format is invalid MongoDB will throw a CastError
        if (err.name === 'CastError') {
            return sendError(res, 400, 'Invalid product ID format.');
        }
        return sendError(res, 500, 'Server error fetching product.');
    }
});


// ============================================================
// PROTECTED ROUTE 1: GET /api/v1/user/profile
// Returns the logged-in user's profile data
// verifyToken middleware runs first and puts user info in req.user
// ============================================================
router.get('/user/profile', verifyToken, async (req, res) => {
    try {
        // req.user was set by verifyToken middleware
        // We use it to find the full user record from the database
        const user = await User.findById(req.user.user_id)
            .select('-password')   // exclude the password field from the result
            .lean();

        if (!user) {
            return sendError(res, 404, 'User not found.');
        }

        return sendSuccess(res, 200, 'Profile fetched successfully.', { user });

    } catch (err) {
        console.error(err);
        return sendError(res, 500, 'Server error fetching profile.');
    }
});


// ============================================================
// PROTECTED ROUTE 2: POST /api/v1/orders
// Creates a new order for the logged-in user
// Body should contain: items (array), shippingAddress
// ============================================================
router.post('/orders', verifyToken, async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;

        // Validate that items array exists and is not empty
        if (!items || !Array.isArray(items) || items.length === 0) {
            return sendError(res, 400, 'Order must contain at least one item.');
        }

        // Calculate total amount and validate each item
        let totalAmount = 0;
        const validatedItems = [];

        for (const item of items) {
            // Check that product ID and quantity are provided
            if (!item.productId || !item.quantity) {
                return sendError(res, 400, 'Each item needs a productId and quantity.');
            }

            // Look up the product in the database to get the real price
            const product = await Product.findById(item.productId);
            if (!product) {
                return sendError(res, 404, 'Product not found: ' + item.productId);
            }

            // Check if enough stock is available
            if (product.stock < item.quantity) {
                return sendError(res, 400, 'Not enough stock for: ' + product.name);
            }

            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            validatedItems.push({
                product: product._id,
                name: product.name,       // snapshot the name at time of order
                price: product.price,     // snapshot the price at time of order
                quantity: item.quantity
            });
        }

        // Create and save the order
        const newOrder = new Order({
            user: req.user.user_id,   // from the JWT token via verifyToken
            items: validatedItems,
            totalAmount: totalAmount,
            shippingAddress: shippingAddress || ''
        });

        await newOrder.save();

        return sendSuccess(res, 201, 'Order placed successfully.', {
            order: {
                id: newOrder._id,
                totalAmount: newOrder.totalAmount,
                status: newOrder.status,
                itemCount: newOrder.items.length,
                createdAt: newOrder.createdAt
            }
        });

    } catch (err) {
        console.error(err);
        return sendError(res, 500, 'Server error placing order.');
    }
});


module.exports = router;
