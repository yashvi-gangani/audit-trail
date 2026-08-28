const mongoose = require('mongoose');

/**
 * Connect to MongoDB instance using Mongoose.
 */
const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/audit_trail_db';
    const conn = await mongoose.connect(connStr, {
      autoIndex: true, // Ensure compound unique indexes are built automatically
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; //work