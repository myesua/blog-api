import mongoose from 'mongoose';

const TipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    content: {
      type: {},
      required: true,
    },
    categories: { type: Array, required: false },
    readingTime: {
      type: String,
      required: true,
    },
    visits: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Tip', TipSchema);
