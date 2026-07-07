/**
 * One-time script to create a test user in MongoDB Atlas.
 * Run with: node create-test-user.js
 */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'admin' },
  refreshTokens: [String]
});

const User = mongoose.model('User', userSchema);

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Remove any previous test user
    await User.deleteOne({ email: 'admin@earthquake.com' });

    const hashedPassword = await bcrypt.hash('Admin1234!', 12);

    const user = await User.create({
      name: 'Admin User',
      email: 'admin@earthquake.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Test admin user created successfully!');
    console.log('   Email   : admin@earthquake.com');
    console.log('   Password: Admin1234!');
    console.log('   Role    : admin');
    console.log('   ID      :', user._id.toString());
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  }
};

run();
