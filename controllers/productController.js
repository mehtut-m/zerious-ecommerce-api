const { isValidName } = require('../services/auth/inputValidator');
const { Product, Brand, Category, Hobby } = require('../models');
const { Op } = require('sequelize');

const validatePrice = (price) => !isNaN(price) && price >= 0;

exports.searchProduct = async (req, res, next) => {
  try {
    const { searchText } = req.query;
    if (searchText.trim() === '') {
      return res.status(400).json({ message: 'please enter a search text' });
    }
    const products = await Product.findAll({
      include: [
        {
          model: Brand,
          as: 'brand',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: Category,
          as: 'category',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: {
            as: 'hobby',
            model: Hobby,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        },
      ],
      where: {
        [Op.or]: {
          name: { [Op.substring]: searchText },
          '$category.name$': { [Op.substring]: searchText },
          '$brand.name$': { [Op.substring]: searchText },
        },
      },
    });
    //
    res.json({ products });
  } catch (err) {
    next(err);
  }
};

exports.getAllProduct = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Brand,
          as: 'brand',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: Category,
          as: 'category',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: {
            as: 'hobby',
            model: Hobby,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        },
      ],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    res.json({ products });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({
    where: { id },
    include: [
      {
        model: Brand,
        as: 'brand',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: Category,
        as: 'category',
        attributes: { exclude: ['createdAt', 'updatedAt', 'hobbyId'] },
        include: {
          as: 'hobby',
          model: Hobby,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      },
    ],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  res.json({ product });
};

exports.getProductByHobby = async (req, res, next) => {
  const { hobbyId } = req.params;
  try {
    const product = await Product.findAll({
      include: [
        {
          model: Brand,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: Category,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: {
            model: Hobby,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { id: hobbyId },
          },
        },
      ],
    });
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

exports.getProductByCategory = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  const { name, price, categoryId, brandId, description, quantity } = req.body;
  console.log(req.file);

  // Validate given product name
  if (!isValidName(name)) {
    return res.status(400).json({ message: 'name is invalid' });
  }

  // Validate given product price
  if (!validatePrice(price)) {
    return res
      .status(400)
      .json({ message: 'price must be a number and not less than 0' });
  }
  // Check if category id is not given
  if (!categoryId) {
    return res.status(400).json({ message: 'category id is require' });
  }
  // Check if brand id is not given
  if (!brandId) {
    return res.status(400).json({ message: 'brand id is require' });
  }

  // Check if category id is exist
  const inputCategory = await Category.findByPk(categoryId);
  if (!inputCategory) {
    return res.status(400).json({ message: 'invalid category id' });
  }

  // Check if brand id is exist
  const inputBrand = await Category.findByPk(brandId);
  if (!inputBrand) {
    return res.status(400).json({ message: 'invalid brand id' });
  }

  //Upload img

  const prevProduct = await Product.findOne({ where: { name } });
  // Check if a product is already exist

  if (prevProduct) {
    return res
      .status(400)
      .json({ message: 'Product with the given name was already exist' });
  }
  // upload picture

  // Create a new product
  const product = await Product.create({
    name,
    price,
    categoryId,
    brandId,
    description,
    quantity,
  });

  // Response to client with created product
  res.status(201).json(product);
};
