const { Address } = require('../models');

const getAddress = async (userId) => {
  const address = await Address.findAll({ where: { userId } });
  return address;
};

exports.getAddress = getAddress;
