require('dotenv').config();
const mongoose = require('mongoose');
const Business = require('../src/models/Business'); 
const User = require('../src/models/User'); 
const connectDB = require('../src/config/db');

const seedPendingBusiness = async () => {
    try {
        await connectDB();
        
        // Ensure there is a test owner user
        let user = await User.findOne({ email: 'testowner@business.com' });
        if (!user) {
            user = await User.create({
                name: 'Test Business Owner',
                email: 'testowner@business.com',
                password: 'password123',
                role: 'admin',
                location: {
                    type: 'Point',
                    coordinates: [0, 0]
                }
            });
        }

        // Create the business
        const existingBusiness = await Business.findOne({ ownerId: user._id });
        if (!existingBusiness) {
            const business = await Business.create({
                ownerId: user._id,
                businessName: 'My Awesome Cafe',
                category: 'Restaurant',
                documents: ['https://example.com/license.pdf'],
                isVerified: false
            });
            console.log('Seeded pending business:', business.businessName);
        } else {
            console.log('Pending business already exists.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding business:', error);
        process.exit(1);
    }
};

seedPendingBusiness();
