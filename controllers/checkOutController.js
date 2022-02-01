const { sequelize } = require('../models');
const { getUserOrder } = require('./orderController');

const updateOrder = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    // If payment is success then update
    const order = await getUserOrder(id);
    order.orderItem.forEach(async (element) => {
      try {
        const { amount } = element;
        const { price, quantity } = element.product;

        // Update stock
        element.product.quantity -= amount;
        // Update price in orderItem
        element.price = price;

        await element.product.save({ transaction });
        await element.save({ transaction });
      } catch (err) {
        console.log(err);
      }
    });
    // Update status of order
    order.status = 'PAID';

    await order.save({ transaction });
    await transaction.commit();
    return order;
  } catch (err) {
    console.log(err);
    await transaction.rollback();
  }
};

const omise = require('omise')({
  publicKey: process.env.OMISE_PUBLIC_KEY,
  secretKey: process.env.OMISE_SECRET_KEY,
});

const createCharge = async () => {
  try {
  } catch (error) {}

  console.log('Charge ', charge);
};

exports.checkOutCreditCard = async (req, res, next) => {
  // Get Info from user
  const { email, name, amount, token } = req.body;

  try {
    // Create customer for Omise
    const customer = await omise.customers.create({
      email,
      description: name,
      card: token,
    });
    // Create Charge for Omise
    const charge = await omise.charges.create({
      amount: 2000,
      currency: 'thb',
      customer: customer.id,
    });
    // console.log('Charge ', charge);
    console.log(charge);
    // If payment is not success then send the response
    if (charge.status !== 'successful') {
      console.log({
        amount: charge.amount,
        status: charge.status,
      });
      return res.status(400).json({ message: 'transaction failed' });
    }

    const order = await updateOrder(req.user.id);

    // If updateOrder failed send response
    if (!order) {
      return res.status(400).json({ message: 'transaction failed' });
    }
    res.json({
      message: 'success',
      order,
    });
    // ------------- Consider adding payment info table --------------
  } catch (err) {
    console.log(err);
    next(err);
  }
};

console.log(process.env.OMISE_PUBLIC_KEY);
