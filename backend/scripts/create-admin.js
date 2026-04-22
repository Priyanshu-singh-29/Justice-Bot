const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
  const name = "Admin User";
  const email = "admin@example.com";
  const password = "admin123"; // You can change this

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    let user = await User.findOne({ email });

    if (user) {
      user.role = 'admin';
      await user.save();
      console.log(`🚀 User already existed. Updated ${email} to ADMIN.`);
    } else {
      user = new User({
        name,
        email,
        password,
        role: 'admin'
      });
      await user.save();
      console.log(`🚀 Created NEW Admin account:`);
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
