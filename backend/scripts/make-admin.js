const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load env from one level up
dotenv.config({ path: path.join(__dirname, '../.env') });

const makeAdmin = async (email) => {
  if (!email) {
    console.error('❌ Please provide an email address.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      console.error(`❌ User with email ${email} not found.`);
    } else {
      console.log(`🚀 Success! User ${user.name} (${user.email}) is now an ADMIN.`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

const emailArg = process.argv[2];
makeAdmin(emailArg);
