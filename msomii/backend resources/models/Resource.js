import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  filePath: {
    type: String,
    required: [true, 'File path is required'],
  },
  fileType: {
    type: String,
    required: [true, 'File type is required'],
  },
  fileSize: {
    type: Number,
    required: false, // Changed to optional
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Changed to optional for testing
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Resource', resourceSchema);

