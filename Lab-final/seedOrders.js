const mongoose = require('mongoose');
const Order = require('./models/Order');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/dvagoDB')
    .then(() => console.log('Connected to MongoDB for order seeding...'))
    .catch(err => console.error('Connection failed:', err));

async function seedOrders() {
    try {
        // Get all products so we can reference real product IDs
        const products = await Product.find().lean();

        if (products.length === 0) {
            console.log('No products found. Run node seed.js first.');
            mongoose.connection.close();
            return;
        }

        // Delete existing orders first
        await Order.deleteMany({});
        console.log('Old orders cleared.');

        // Helper to pick a random product
        function randomProduct() {
            return products[Math.floor(Math.random() * products.length)];
        }

        // Helper to get a random number between min and max
        function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // Create 30 sample orders spread over the last 30 days
        const orders = [];
        for (let i = 0; i < 30; i++) {
            const p1 = randomProduct();
            const p2 = randomProduct();
            const qty1 = randomInt(1, 4);
            const qty2 = randomInt(1, 3);
            const total = (p1.price * qty1) + (p2.price * qty2);

            // Create a date somewhere in the last 30 days
            const date = new Date();
            date.setDate(date.getDate() - randomInt(0, 29));

            orders.push({
                user: new mongoose.Types.ObjectId(),  // fake user ID for now
                items: [
                    { product: p1._id, name: p1.name, price: p1.price, quantity: qty1 },
                    { product: p2._id, name: p2.name, price: p2.price, quantity: qty2 }
                ],
                totalAmount: total,
                status: ['pending','confirmed','shipped','delivered'][randomInt(0,3)],
                shippingAddress: 'Lahore, Pakistan',
                createdAt: date
            });
        }

        await Order.insertMany(orders);
        console.log('30 sample orders seeded successfully!');
        mongoose.connection.close();

    } catch (err) {
        console.error('Seeding failed:', err);
        mongoose.connection.close();
    }
}

seedOrders();
