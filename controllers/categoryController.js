const { Category } = require('../models');
const { isValidName } = require('../services/auth/inputValidator');

exports.getAllCategory = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ attributes: ['name', 'id'] });
    res.json(categories);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    // Get value from body
    const { name } = req.body;
    const formattedName = name.trim();
    // Check if name is valid
    if (!isValidName(name)) {
      // Send err to user
      return res.status(400).json({ message: 'name is malformed' });
    }
    // Create new cat in database
    const category = await Category.create({ name: formattedName });
    res.status(201).json({ category });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Validate brand name
    if (!isValidName(name)) {
      res.status(400).json({ message: 'invalid Category name' });
    }
    // Check if brand already exist
    const category = await Category.findOne({ where: { id } });
    if (!category)
      return res.status(400).json({ message: 'item does not exist' });

    category.name = name;
    category.save();

    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Check if brand exist
    const category = await Category.findOne({
      where: { id },
    });
    if (!category) {
      return res.status(400).json({ message: 'item not found' });
    }
    // Delete item
    category.destroy();
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
};
