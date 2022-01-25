const { Product, OrderItem } = require('../models');

exports.findProduct = async (productId) => {
  const product = await Product.findByPk(productId);
  return product;
};

// exports.findProduct = (productId) => {};
