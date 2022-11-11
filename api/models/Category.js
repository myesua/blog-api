import mongoose from 'mongoose';

// const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Category', CategorySchema);
