import Resource from '../models/Resource.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';
import path from 'path';

export const uploadResource = async (req, res) => {
  console.log('uploadResource called');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category || !req.file) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!mongoose.isValidObjectId(category)) {
      console.log('Invalid category ID:', category);
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      console.log('Category not found:', category);
      return res.status(400).json({ error: 'Category not found' });
    }

    const resource = new Resource({
      title,
      description,
      category,
      filePath: req.file.path,
      fileName: req.file.filename,
      fileType: req.file.mimetype,
      fileSize: req.file.size, // Set file size
      uploadedBy: req.user?.id || null, // Set to null if no user
    });

    await resource.save();
    console.log('Resource saved:', resource);

    res.status(201).json({
      message: 'Resource uploaded',
      data: resource,
    });
  } catch (err) {
    console.error('Resource POST Error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getResources = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const resources = await Resource.find(query)
      .populate('category', 'name')
      .populate('uploadedBy', 'name');
    res.status(200).json({
      message: category ? 'Resources retrieved for category' : 'All resources retrieved',
      data: resources,
    });
  } catch (err) {
    console.error('Resource GET Error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const searchResources = async (req, res) => {
  try {
    const { query } = req.query;
    const resources = await Resource.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    })
      .populate('category', 'name')
      .populate('uploadedBy', 'name');
    res.status(200).json({
      message: 'Search results retrieved',
      data: resources,
    });
  } catch (err) {
    console.error('Resource Search Error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const downloadResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.download(resource.filePath, resource.fileName);
  } catch (err) {
    console.error('Resource Download Error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    await resource.deleteOne();
    res.status(200).json({ message: 'Resource deleted' });
  } catch (err) {
    console.error('Resource Delete Error:', err);
    res.status(500).json({ error: err.message });
  }
};