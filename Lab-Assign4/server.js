require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer');
const path = require('path');
const Product = require("./models/Product");
const session = require('express-session');
const MongoStore = require('connect-mongo').default || require('connect-mongo');
const flash = require('connect-flash');
const User = require('./models/User');
const apiRoutes = require('./routes/api');

// Multer storage setup
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function(req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

// ============================================================
// SESSION SETUP
// A session is like a wristband — it remembers who is logged in
// We store sessions in MongoDB so they survive server restarts
// ============================================================
app.use(session({
    secret: 'dvago-secret-key-2024',   // used to scramble the session data
    resave: false,                      // do not re-save session if nothing changed
    saveUninitialized: false,           // do not save empty sessions
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/dvagoDB'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24    // session lasts 24 hours (in milliseconds)
    }
}));

// ============================================================
// FLASH MESSAGES
// Flash messages are one-time messages shown after a redirect
// Example: after login, show "Welcome back!"
// ============================================================
app.use(flash());

// ============================================================
// GLOBAL VARIABLES
// This makes certain variables available in EVERY EJS template
// So we do not have to pass them manually to every res.render()
// ============================================================
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;   // who is logged in (or null)
    res.locals.success = req.flash('success');            // success messages array
    res.locals.error = req.flash('error');                // error messages array
    next();
});

// ============================================================
// API ROUTES
// All routes in routes/api.js will be prefixed with /api/v1
// These routes return JSON not HTML
// ============================================================
app.use('/api/v1', apiRoutes);

app.set("view engine", "ejs");

// ============================================================
// MIDDLEWARE: isLoggedIn
// Protects pages that require login (like checkout)
// If the user is not logged in, redirect them to the login page
// ============================================================
function isLoggedIn(req, res, next) {
    if (req.session.user) {
        return next();    // user is logged in, let them through
    }
    req.flash('error', 'You must be logged in to access that page.');
    res.redirect('/login');
}

// ============================================================
// MIDDLEWARE: isAdmin
// Protects the admin panel
// The user must be logged in AND have role = 'admin'
// ============================================================
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();    // user is an admin, let them through
    }
    req.flash('error', 'Access denied. Admins only.');
    res.redirect('/');    // send them back to homepage
}

// ============================================================
// CONNECT TO MONGODB
// ============================================================
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/dvagoDB")
    .then(() => console.log("Connected to MongoDB!"))
    .catch((err) => console.error("MongoDB connection error:", err));


// ============================================================
// HOMEPAGE ROUTE
// ============================================================
app.get("/", (req, res) => {
    res.render("homepage");
});


// ============================================================
// PRODUCTS ROUTE
// Example:
// /products?page=1&search=panadol&category=Medicine&minPrice=100&maxPrice=500
// ============================================================
app.get("/products", async (req, res) => {

    // Query parameters
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || 999999;

    const LIMIT = 8;

    // MongoDB query object
    const queryObject = {};

    // Search filter
    if (search) {
        queryObject.name = {
            $regex: search,
            $options: 'i'
        };
    }

    // Category filter
    if (category) {
        queryObject.category = category;
    }

    // Price filter
    queryObject.price = {
        $gte: minPrice,
        $lte: maxPrice
    };

    // Pagination skip
    const skip = (page - 1) * LIMIT;

    try {

        // Total matching products
        const totalProducts = await Product.countDocuments(queryObject);

        // Total pages
        const totalPages = Math.ceil(totalProducts / LIMIT);

        // Fetch products
        const products = await Product.find(queryObject)
            .skip(skip)
            .limit(LIMIT)
            .lean();

        // Get categories for dropdown
        const categories = await Product.distinct("category");

        // Send data to EJS
        res.render("products", {
            products,
            currentPage: page,
            totalPages,
            totalProducts,
            categories,
            search,
            category,
            minPrice: req.query.minPrice || '',
            maxPrice: req.query.maxPrice || ''
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong fetching products.");
    }
});


// ============================================================
// CONTACT PAGE
// ============================================================
app.get("/contact-us", (req, res) => {
    res.render("contact-us");
});


// ============================================================
// HOBBIES PAGE
// ============================================================
app.get("/hobbies", (req, res) => {
    res.render("hobbies");
});



// ============================================================
// AUTH ROUTES (REGISTER, LOGIN, LOGOUT)
// ============================================================

// ============================================================
// REGISTER — GET: Show the registration form
// ============================================================
app.get('/register', (req, res) => {
    // If already logged in, go to homepage
    if (req.session.user) return res.redirect('/');
    res.render('auth/register');
});

// ============================================================
// REGISTER — POST: Handle the registration form submission
// ============================================================
app.post('/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Check passwords match
        if (password !== confirmPassword) {
            req.flash('error', 'Passwords do not match.');
            return res.redirect('/register');
        }

        // Check password length
        if (password.length < 6) {
            req.flash('error', 'Password must be at least 6 characters.');
            return res.redirect('/register');
        }

        // Check if email is already registered
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            req.flash('error', 'That email is already registered. Please log in.');
            return res.redirect('/register');
        }

        // Create the new user (password gets hashed automatically by the model)
        const newUser = new User({ name, email, password, role: 'customer' });
        await newUser.save();

        // Log them in immediately after registering
        req.session.user = { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role };
        req.flash('success', 'Account created! Welcome to DVAGO, ' + newUser.name + '!');
        res.redirect('/');

    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/register');
    }
});

// ============================================================
// LOGIN — GET: Show the login form
// ============================================================
app.get('/login', (req, res) => {
    // If already logged in, go to homepage
    if (req.session.user) return res.redirect('/');
    res.render('auth/login');
});

// ============================================================
// LOGIN — POST: Handle the login form submission
// ============================================================
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        // Compare the typed password with the hashed one in the database
        const passwordCorrect = await user.comparePassword(password);
        if (!passwordCorrect) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        // Save user info in session (this is what keeps them logged in)
        req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };
        req.flash('success', 'Welcome back, ' + user.name + '!');

        // If admin, go to admin dashboard. Otherwise go to homepage.
        if (user.role === 'admin') {
            return res.redirect('/admin');
        }
        res.redirect('/');

    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/login');
    }
});

// ============================================================
// LOGOUT — clears the session and redirects to homepage
// ============================================================
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error(err);
        res.redirect('/');
    });
});



// ============================================================
// ADMIN ROUTES
// ============================================================

// --- ROUTE 1: Admin Dashboard ---
app.get('/admin', isAdmin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const categories = await Product.distinct('category');
    const totalCategories = categories.length;
    const lowStock = await Product.countDocuments({ stock: { $lt: 30 } });
    const products = await Product.find().lean();
    res.render('admin/dashboard', { products, totalProducts, totalCategories, lowStock });
  } catch (err) {
    console.error(err);
    res.status(500).send('Admin dashboard error');
  }
});

// --- ROUTE 2: Show Add New Product Form ---
app.get('/admin/products/new', isAdmin, (req, res) => {
  res.render('admin/newProduct', { success: null, error: null });
});

// --- ROUTE 3: Handle Add New Product Form Submission ---
app.post('/admin/products/new', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, rating, stock } = req.body;
    if (!name || !price || !category || !stock) {
      return res.render('admin/newProduct', { error: 'Name, price, category and stock are required.', success: null });
    }
    const imagePath = req.file ? '/uploads/' + req.file.filename : '/images/panadol.webp';
    const newProduct = new Product({ name, description, price, category, rating, stock, image: imagePath });
    await newProduct.save();
    res.render('admin/newProduct', { success: true, error: null });
  } catch (err) {
    console.error(err);
    res.render('admin/newProduct', { error: 'Something went wrong. Please try again.', success: null });
  }
});

// --- ROUTE 4: Show Edit Product Form ---
app.get('/admin/products/edit/:id', isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.redirect('/admin');
    res.render('admin/editProduct', { product, success: null, error: null });
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
});

// --- ROUTE 5: Handle Edit Product Form Submission ---
app.post('/admin/products/edit/:id', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, rating, stock } = req.body;
    const updateData = { name, description, price, category, rating, stock };
    if (req.file) {
      updateData.image = '/uploads/' + req.file.filename;
    }
    await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
});

// --- ROUTE 6: Handle Delete Product ---
app.post('/admin/products/delete/:id', isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
});

// ============================================================
// START SERVER
// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});