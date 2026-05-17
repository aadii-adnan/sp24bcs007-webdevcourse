// We bring in mongoose so we can define a schema
const mongoose = require('mongoose');

// A Schema is the "blueprint" for every product document in MongoDB
// It says: every product MUST have these fields with these types
const ProductSchema = new mongoose.Schema({

    name: {
        type: String,       // must be text
        required: true      // cannot be empty
    },

    description: {
        type: String,
        default: ''         // optional — empty string if not provided
    },

    price: {
        type: Number,       // must be a number
        required: true
    },

    category: {
        type: String,
        required: true
        // This will be things like "Medicine", "Baby Care", "Wellness" etc.
    },

    rating: {
        type: Number,
        default: 0,
        min: 0,             // cannot be less than 0
        max: 5              // cannot be more than 5
    },

    stock: {
        type: Number,
        default: 0          // how many units are available
    },

    image: {
        type: String,
        default: 'https://via.placeholder.com/300x200?text=No+Image'
    }

}, { timestamps: true }); 
// timestamps: true automatically adds createdAt and updatedAt fields


// This line creates the actual Model from the schema and exports it
// "Product" becomes the collection name in MongoDB (stored as "products")
module.exports = mongoose.model('Product', ProductSchema);
