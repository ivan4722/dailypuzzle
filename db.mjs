import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: { //will be hash
    type: String,
    required: true,
  },
  bestStreak: {
    type: Number,
    required: true,
  },
  solved: {
    type: Array,
    required: true,
  },
});

mongoose.model('user', user);
//console.log(process.env.DSN);
mongoose.connect(process.env.DSN);
