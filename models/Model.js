import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  link: {
    type: String,
    trim: true,
    required: [true, 'A link must be there'],
    unique: true,
  },
  short: {
    type: String,
    required: [true, 'A short URL post be present'],
    unique: true,
  },
});

const Model = mongoose.model('Model', Schema);

export default Model;
