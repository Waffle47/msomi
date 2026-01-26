import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ message: categories.length ? 'Categories retrieved successfully' : 'No categories found', data: categories });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json({ message: 'Category created successfully', data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Category already exists' });
    }
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category retrieved successfully', data: category });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};