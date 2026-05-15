const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

// ============================================================
// CONNECT TO MONGODB
// ============================================================
mongoose.connect("mongodb://localhost:27017/dvagoDB")
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
// START SERVER
// ============================================================
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});