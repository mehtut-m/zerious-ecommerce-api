const { isValidName } = require('../services/auth/inputValidator');
const { Brand } = require('../models');

exports.getAllBrand = async (req, res, next) => {
  try {
    const brands = await Brand.findAll({ attributes: ['name', 'id'] });
    res.json(brands);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
exports.createBrand = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Validate brand name
    if (!isValidName(name)) {
      res.status(400).json({ message: 'invalid brand name' });
    }
    // Check if brand already exist
    const existingBrand = await Brand.findOne({ where: { name: name.trim() } });

    if (existingBrand)
      return res.status(400).json({ message: 'Brand already exist' });

    const brand = await Brand.create({ name: name.trim() });

    res.status(201).json({ brand });
  } catch (err) {
    next(err);
  }
};
exports.updateBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Validate brand name
    if (!isValidName(name)) {
      res.status(400).json({ message: 'invalid brand name' });
    }
    // Check if brand already exist
    const brand = await Brand.findOne({ where: { id } });
    if (!brand) return res.status(400).json({ message: 'item does not exist' });

    brand.name = name;
    brand.save();

    res.status(201).json({ brand });
  } catch (err) {
    next(err);
  }
};
exports.deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Check if brand exist
    const brand = await Brand.findOne({
      where: { id },
    });
    if (!brand) {
      return res.status(400).json({ message: 'item not found' });
    }
    // Delete item
    brand.destroy();
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
};
