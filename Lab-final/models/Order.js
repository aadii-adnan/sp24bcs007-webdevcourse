const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({

    // Which user placed this order
    user: {
        type: mongoose.Schema.Types.ObjectId,  // stores a reference to the User
        ref: 'User',                            // links to the User model
        required: true
    },

    // List of products in the order
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'      // links to the Product model
            },
            name: String,           // product name saved at time of order
            price: Number,          // price saved at time of order
            quantity: {
                type: Number,
                default: 1,
                min: 1
            }
        }
    ],

    // Total price of the whole order
    totalAmount: {
        type: Number,
        required: true
    },

    // Current status of the order
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },

    // Delivery address
    shippingAddress: {
        type: String,
        default: ''
    }

}, { timestamps: true });  // automatically adds createdAt and updatedAt


module.exports = mongoose.model('Order', OrderSchema);
