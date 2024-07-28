import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';
import ensureUploadsDirectory from './utils/ensureUploadsDirectory';


dotenv.config();

ensureUploadsDirectory();

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));
