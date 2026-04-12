require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User'); // Adjust path as necessary
const connectDB = require('../src/config/db');

const seedSuperAdmin = async () => {
    try {
        await connectDB();
        
        const superAdminEmail = 'superadmin@example.com';
        
        const existingSuperAdmin = await User.findOne({ email: superAdminEmail });
        
        if (existingSuperAdmin) {
            console.log('Superadmin already exists. Skipping insertion.');
            process.exit(0);
        }

        const superAdmin = await User.create({
            name: 'System Super Admin',
            email: superAdminEmail,
            password: 'superpassword123', // Remember to change or use env variable
            role: 'superadmin',
            isApproved: true,
            location: {
                type: 'Point',
                coordinates: [0, 0] // Default coordinates
            }
        });

        console.log('Superadmin created successfully:', superAdmin.email);
        process.exit(0);
    } catch (error) {
        console.error('Error creating superadmin:', error);
        process.exit(1);
    }
};

seedSuperAdmin();
