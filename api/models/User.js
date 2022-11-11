import mongoose from 'mongoose';
// const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: {
      type: String,
      default:
        'https://res.cloudinary.com/doh3f4dzw/image/upload/v1667749613/defaultavatar_ipxcxq.png',
    },
    bannerImage: {
      type: String,
      default:
        'https://res.cloudinary.com/doh3f4dzw/image/upload/v1667745990/nqxlyyv61omzx3zlxrxd.jpg',
    },
  },
  { timestamps: true },
);

export default mongoose.model('User', UserSchema);
