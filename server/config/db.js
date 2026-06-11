import mongoose from 'mongoose';

const memoryStore = {
  users: [],
  incomes: [],
  expenses: []
};

export const memoryMode = { current: false };

export function getMemoryStore() {
  return memoryStore;
}

export async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cashtrack';

  try {
    await mongoose.connect(uri, { autoIndex: true });
    memoryMode.current = false;
    console.log('MongoDB connected');
    return true;
  } catch (error) {
    memoryMode.current = true;
    console.warn('MongoDB unavailable, using demo in-memory mode:', error.message);
    return false;
  }
}
