import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
  try {
    const con = await mongoose.connect(ENV.MONGO_URI);
    console.log('MongoDB connected successfully:', con.connection.host);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
