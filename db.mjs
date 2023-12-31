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
  totalSolved: {
    type: Number,
    required: true,
  },
  solved: {
    type: Array,
    required: true,
  },
});

const suggestionSchema = new mongoose.Schema({
  suggestion: {
    type: String,
    required: true, 
  },
  name: {
    type: String,
    required: false,
  },
});
mongoose.model('user', user);
mongoose.model('suggestion', suggestionSchema);
//console.log(process.env.DSN);
mongoose.connect(process.env.DSN);
