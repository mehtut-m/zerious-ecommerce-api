const { Order, OrderItem, Product, sequelize } = require('../models');
const { findProduct } = require('../services/product');

const createOrder = async (userId) => {
  return await Order.create({ userId });
};
const getCartItemById = async (orderItemId, userId) => {
  return await OrderItem.findOne({
    where: { id: orderItemId },
    include: {
      model: Order,
      as: 'order',
      where: { userId, status: 'PENDING' },
    },
  });
};

const getCartItems = async (orderId, userId) => {
  return await OrderItem.findAll({
    where: { orderId },
    include: {
      model: Order,
      as: 'order',
      where: { userId, status: 'PENDING' },
    },
  });
};

const clearCart = async (orderId, userId) => {};

const deleteCartItem = async (orderId, userId) => {
  const cartItem = await getCartItemById(orderId, userId);
  if (cartItem) {
    await cartItem.destroy();
    return true;
  }
  return false;
};

const getUserOrder = async (userId) => {
  const order = await Order.findOne({
    where: { userId: userId, status: 'PENDING' },
    include: [
      {
        model: OrderItem,
        as: 'orderItem',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: {
          model: Product,
          as: 'product',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      },
    ],
  });
  return order;
};

const getUserOrderItems = async (orderId) => {
  return await Order.findAll({
    where: { id: orderId },
    include: {
      model: OrderItem,
      as: 'orderItem',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: Product,
        as: 'product',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    },
  });
};

// Export function

exports.getCart = async (req, res, next) => {
  const { orderId } = req.params;
  const cart = await getUserOrderItems(orderId);
  res.status(200).json({ cart });
};

exports.updateCart = async (req, res, next) => {
  try {
    const user = req.user;
    const { productId } = req.body;
    let { amount } = req.body;
    //Check if a product with the id does exist
    const product = await findProduct(productId);
    if (!product) {
      return res.status(400).json({ message: 'productId is invalid' });
    }

    if (product.quantity < amount) {
      amount = product.quantity;
    }

    //Find pending order
    let order = await getUserOrder(user.id);

    // Create new order if user does not have has a pending order
    if (!order) {
      order = await createOrder(user.id);
    }
    let orderItem = await OrderItem.findOne({
      where: { orderId: order.id, productId },
      include: {
        model: Product,
        as: 'product',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    });
    console.log(order.id);
    console.log(orderItem);
    // if amount user sent is 0 delete the item
    if (!orderItem && amount === 0) {
      return res.status(204).json({});
    } else if (orderItem && amount === 0) {
      deleteCartItem(orderItem.id, user.id);
      return res.status(204).json({});
    }
    // if product is already included update the order item
    else if (orderItem) {
      orderItem.amount = amount;
      orderItem.save();
    } else {
      // if product is not included created a new order item
      let newItem = await OrderItem.create({
        orderId: order.id,
        amount,
        productId,
        price: product.price,
      });

      orderItem = await OrderItem.findByPk(newItem.id, {
        include: {
          model: Product,
          as: 'product',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      });
    }

    console.log(orderItem);
    return res.json({ orderItem });
  } catch (err) {
    next(err);
  }
};

exports.removeCartItemById = async (req, res, next) => {
  const { orderItemId } = req.params;
  const { id: userId } = req.user;
  try {
    await deleteCartItem(orderItemId, userId);
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { orderId } = req.params;
    const { id: userId } = req.user;
    // Check if order item is send be client
    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }
    const order = await Order.findOne({ where: { userId, status: 'PENDING' } });
    console.log(order);
    if (!order) {
      return res.status(400).json({ message: 'orderId is not found' });
    }

    await OrderItem.destroy({ where: { orderId } }, { transaction });
    await Order.destroy({ where: { id: orderId } }, { transaction });
    await transaction.commit();

    res.status(204).json({});
  } catch (error) {
    next(error);
  }
};

exports.getMyOrder = async (req, res, next) => {
  const { id: userId } = req.user;
  const [order] = await Order.findOrCreate({
    where: { userId: userId, status: 'PENDING' },
    include: [
      {
        model: OrderItem,
        as: 'orderItem',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: {
          model: Product,
          as: 'product',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      },
    ],
  });

  res.json({ order });
};

exports.getUserOrder = getUserOrder;
