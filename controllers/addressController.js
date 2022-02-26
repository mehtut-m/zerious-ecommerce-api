const { Address } = require('../models');

const getAddress = async (userId) => {
  const address = await Address.findAll({ where: { userId } });
  return address;
};

exports.createAddress = async (req, res, next) => {
  try {
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
  } catch (err) {
    console.log(err);
    next(err);
  }
};
exports.updateAddress = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;
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
    const newAddress = await Address.update(
      {
        name,
        address,
        telephoneNo,
      },
      { where: { id, userId } }
    );

    return res.json({ address: newAddress });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getAddress = getAddress;
