const { Address } = require('../models');

const getAddress = async (userId) => {
  const address = await Address.findAll({ where: { userId } });
  return address;
};

exports.createAddress = async (req, res, next) => {
  const { id: userId } = req.user;
  const { name, address, telephoneNo } = req.body;

  // Pending Verify Input
  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ messge: 'name is invalid' });
  }
  if (typeof address !== 'string' || address.trim() === '') {
    return res.status(400).json({ messge: 'address is invalid' });
  }
  if (typeof telephoneNo !== 'string' || telephoneNo.trim() === '') {
    return res.status(400).json({ messge: 'telephoneNo is invalid' });
  }
  const newAddress = await Address.create({
    userId,
    name,
    address,
    telephoneNo,
  });

  return res.json({ address: newAddress });
};

exports.getAddress = getAddress;
