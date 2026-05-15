// seed.js — Run this file ONCE with: node seed.js
// It will wipe your products collection and fill it with 25 sample products

const mongoose = require('mongoose');
const Product = require('./models/Product');

// Connect to your local MongoDB database
// "dvagoDB" is the name of the database — MongoDB creates it automatically
mongoose.connect('mongodb://localhost:27017/dvagoDB')
    .then(() => console.log('Connected to MongoDB for seeding...'))
    .catch(err => console.error('Connection failed:', err));

// These are our 25 sample DVAGO pharmacy products
const products = [
    // --- MEDICINE ---
    {
        name: 'Panadol Extra Tablets 20s',
        description: 'Fast relief from headache, fever and body pain.',
        price: 85,
        category: 'Medicine',
        rating: 4.8,
        stock: 150,
        image: '/images/panadol.webp'
    },
    {
        name: 'Gaviscon Syrup 120ml',
        description: 'Provides fast relief from heartburn and acid reflux.',
        price: 237,
        category: 'Medicine',
        rating: 4.5,
        stock: 80,
        image: '/images/gavisconsyrup.webp'
    },
    {
        name: 'Brufen 400mg Tablets',
        description: 'Ibuprofen for pain and inflammation relief.',
        price: 120,
        category: 'Medicine',
        rating: 4.6,
        stock: 200,
        image: '/images/ibruphen.webp'
    },
    {
        name: 'Redoxon Triple Action',
        description: 'Vitamin C, D and Zinc effervescent tablets.',
        price: 850,
        category: 'Medicine',
        rating: 4.9,
        stock: 60,
        image: '/images/panadol.webp'
    },
    {
        name: 'Septran Tablets',
        description: 'Antibiotic for bacterial infections.',
        price: 95,
        category: 'Medicine',
        rating: 4.2,
        stock: 120,
        image: '/images/_septran.webp'
    },

    // --- BABY CARE ---
    {
        name: 'Pampers Newborn Diapers Size 1',
        description: 'Soft and gentle diapers for newborns.',
        price: 1200,
        category: 'Baby Care',
        rating: 4.9,
        stock: 45,
        image: '/images/baby products.webp'
    },
    {
        name: 'Livity Milk Powder Strawberry 400g',
        description: 'Nutritious milk powder for growing babies.',
        price: 2999,
        category: 'Baby Care',
        rating: 4.7,
        stock: 30,
        image: '/images/milk babies.webp'
    },
    {
        name: 'Johnson Baby Shampoo 200ml',
        description: 'Gentle, tear-free formula for baby hair.',
        price: 450,
        category: 'Baby Care',
        rating: 4.8,
        stock: 90,
        image: '/images/babyjonson.webp'
    },
    {
        name: 'Mustela Bathing Gel 200ml',
        description: 'Dermatologist tested, gentle on baby skin.',
        price: 1850,
        category: 'Baby Care',
        rating: 4.6,
        stock: 25,
        image: '/images/baby products.webp'
    },
    {
        name: 'Cerelac Wheat with Milk 400g',
        description: 'Fortified baby cereal for 6+ months.',
        price: 780,
        category: 'Baby Care',
        rating: 4.5,
        stock: 55,
        image: '/images/baby products.webp'
    },

    // --- WELLNESS ---
    {
        name: 'Ensure Gold Vanilla 400g',
        description: 'Complete nutrition supplement for adults.',
        price: 3200,
        category: 'Wellness',
        rating: 4.7,
        stock: 40,
        image: '/images/wellness.webp'
    },
    {
        name: 'Centrum Multivitamin 30 Tablets',
        description: 'Daily multivitamin for complete nutrition.',
        price: 1500,
        category: 'Wellness',
        rating: 4.6,
        stock: 70,
        image: '/images/wellness.webp'
    },
    {
        name: 'Omega-3 Fish Oil 1000mg',
        description: 'Supports heart, brain and joint health.',
        price: 950,
        category: 'Wellness',
        rating: 4.4,
        stock: 85,
        image: '/images/wellness.webp'
    },
    {
        name: 'Calcium Plus Vitamin D3',
        description: 'For strong bones and teeth.',
        price: 680,
        category: 'Wellness',
        rating: 4.5,
        stock: 100,
        image: '/images/wellness.webp'
    },
    {
        name: 'Glucosamine 500mg Capsules',
        description: 'Joint support supplement.',
        price: 1200,
        category: 'Wellness',
        rating: 4.3,
        stock: 50,
        image: '/images/wellness.webp'
    },

    // --- COSMETICS ---
    {
        name: 'Neutrogena Hydro Boost Water Gel',
        description: 'Hyaluronic acid moisturizer for dry skin.',
        price: 2800,
        category: 'Cosmetics',
        rating: 4.8,
        stock: 35,
        image: '/images/cosmetics.webp'
    },
    {
        name: 'Garnier Micellar Cleansing Water',
        description: 'Removes makeup and cleanses skin.',
        price: 650,
        category: 'Cosmetics',
        rating: 4.6,
        stock: 75,
        image: '/images/cosmetics.webp'
    },
    {
        name: 'Himalaya Neem Face Wash 150ml',
        description: 'Purifying face wash for oily skin.',
        price: 380,
        category: 'Cosmetics',
        rating: 4.5,
        stock: 110,
        image: '/images/cosmetics.webp'
    },
    {
        name: 'Sunblock SPF 50+ Lotion 100ml',
        description: 'Broad spectrum sun protection.',
        price: 750,
        category: 'Cosmetics',
        rating: 4.7,
        stock: 60,
        image: '/images/cosmetics.webp'
    },
    {
        name: 'Fair & Lovely Advanced Multi Vitamin',
        description: 'Daily glow face cream with SPF.',
        price: 280,
        category: 'Cosmetics',
        rating: 4.2,
        stock: 130,
        image: '/images/cosmetics.webp'
    },

    // --- PERSONAL CARE ---
    {
        name: 'Colgate Total Whitening Toothpaste',
        description: 'Antibacterial toothpaste for 12-hour protection.',
        price: 220,
        category: 'Personal Care',
        rating: 4.7,
        stock: 200,
        image: '/images/ramzan.webp'
    },
    {
        name: 'Head & Shoulders Anti-Dandruff 400ml',
        description: 'Clears dandruff and keeps hair fresh.',
        price: 650,
        category: 'Personal Care',
        rating: 4.5,
        stock: 90,
        image: '/images/ramzan.webp'
    },
    {
        name: 'Dettol Antiseptic Liquid 500ml',
        description: 'Multi-use antiseptic for cuts and wounds.',
        price: 480,
        category: 'Personal Care',
        rating: 4.8,
        stock: 120,
        image: '/images/ramzan.webp'
    },
    {
        name: 'Dove Body Wash Moisturizing 250ml',
        description: '1/4 moisturizing cream body wash.',
        price: 850,
        category: 'Personal Care',
        rating: 4.6,
        stock: 65,
        image: '/images/ramzan.webp'
    },
    {
        name: 'Listerine Cool Mint Mouthwash 250ml',
        description: 'Kills 99.9% of germs for fresh breath.',
        price: 420,
        category: 'Personal Care',
        rating: 4.4,
        stock: 80,
        image: '/images/ramzan.webp'
    }
];

// This async function does the actual seeding
async function seedDatabase() {
    try {
        // Step 1: Delete ALL existing products so we start fresh
        await Product.deleteMany({});
        console.log('Old products cleared.');

        // Step 2: Insert all 25 products at once
        await Product.insertMany(products);
        console.log('25 products seeded successfully!');

        // Step 3: Close the database connection
        mongoose.connection.close();
        console.log('Database connection closed.');

    } catch (err) {
        console.error('Seeding failed:', err);
        mongoose.connection.close();
    }
}

// Run the function
seedDatabase();
