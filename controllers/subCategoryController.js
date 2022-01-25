const { Category, SubCategory } = require('../models');
const { isValidName } = require('../services/auth/inputValidator');

exports.getAllSubCategory = async (req, res, next) => {
  try {
    const subCategories = await SubCategory.findAll({
      attributes: ['name', 'id'],
    });

    res.json(subCategories);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.createSubCategory = async (req, res, next) => {
  try {
    // Get value from body
    const { categoryId, name } = req.body;
    const formattedName = name.trim();
    // Check if name is valid
    if (!isValidName(name)) {
      // Send err to user
      return res.status(400).json({ message: 'name is invalid' });
    }

    // Check if the category provided is exist
    const category = await Category.findByPk(categoryId); // Create new cat in database
    if (!category) {
      return res.status(400).json({ message: 'categoryId is invalid' });
    }
    // Check if the subcategory provided is already exist
    const existSubCategory = await SubCategory.findOne({
      where: { name: formattedName, categoryId },
    });
    if (existSubCategory) {
      return res.status(400).json({ message: 'sub-category is already exist' });
    }

    const subCategory = await SubCategory.create({
      name: formattedName,
      categoryId,
    });

    res.status(201).json({ subCategory });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.updateSubCategory = async (req, res, next) => {
  //   try {
  //     const { id } = req.params;
  //     const { name } = req.body;
  //     // Validate brand name
  //     if (!isValidName(name)) {
  //       res.status(400).json({ message: 'invalid Category name' });
  //     }
  //     // Check if brand already exist
  //     const category = await Category.findOne({ where: { id } });
  //     if (!category)
  //       return res.status(400).json({ message: 'item does not exist' });
  //     category.name = name;
  //     category.save();
  //     res.status(201).json({ category });
  //   } catch (err) {
  //     next(err);
  //   }
};

exports.deleteSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Check if ID is not provided
    if (id.trim() === '') {
      return res.status(400).json({ message: 'id is required' });
    }
    // Check if brand exist
    const subCategory = await SubCategory.findByPk(id);
    if (!subCategory) {
      return res.status(400).json({ message: 'item not found' });
    }
    // Delete item
    subCategory.destroy();
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
};
