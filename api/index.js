import express from 'express';
const app = express();
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';

import authRoute from './routes/auth.js';
import userRoute from './routes/users.js';
import postRoute from './routes/posts.js';
import categoryRoute from './routes/categories.js';
import tipRoute from './routes/tips.js';

// CORS
app.use(cors({
  origin: 'https://blog-client-bay.vercel.app'
}));

app.disable('x-powered-by')

dotenv.config();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

if (!process.env.URI) {
  throw new Error('No connection string available on environment variable');
}

mongoose
  .connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// HELMET HEADER SECURITY
app.use(helmet());

app.use('/api/posts', postRoute);
app.use('/api/tips', tipRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);

app.listen(process.env.PORT, () => {
  console.log('Backend is running');
});
