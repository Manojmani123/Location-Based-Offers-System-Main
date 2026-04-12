require('dotenv').config();
const mongoose = require('mongoose');
const Business = require('../src/models/Business'); // Adjust path as necessary
const User = require('../src/models/User'); 
const connectDB = require('../src/config/db');

const checkCounts = async () => {
    try {
        await connectDB();
        
        const businessCount = await Business.countDocuments();
        const pendingBusinessCount = await Business.countDocuments({ isVerified: false });
        const userCount = await User.countDocuments();
        const businessList = await Business.find();

        console.log(`Total Users: ${userCount}`);
        console.log(`Total Businesses: ${businessCount}`);
        console.log(`Pending Businesses: ${pendingBusinessCount}`);
        console.log(`All businesses:`, JSON.stringify(businessList, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Error fetching counts:', error);
        process.exit(1);
    }
};

checkCounts();
