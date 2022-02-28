const {
  Order,
  OrderItem,
  Product,
  ProductImage,
  sequelize,
} = require('../models');
const { findProduct } = require('../services/product');
const { getAllComplete, getItemStatus } = require('../services/emsTracking');
const { Op } = require('sequelize');

const updateOrderStatus = async () => {
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzZWN1cmUtYXBpIiwiYXVkIjoic2VjdXJlLWFwcCIsInN1YiI6IkF1dGhvcml6YXRpb24iLCJleHAiOjE2NDYwNjYwMjYsInJvbCI6WyJST0xFX1VTRVIiXSwiZCpzaWciOnsicCI6InpXNzB4IiwicyI6bnVsbCwidSI6ImMyYWIyZWRkODAwZDU1M2Y0OWNiNzQ4NmU4N2E5OGU0IiwiZiI6InhzeiM5In19.auKbkiFc9TVwjrD26menf4uN2Vp_RIRwbfbQ3ULFD7VPJ6PhWiW_fePFS2GxrXwUmj3Wd6dX-dI5-IBlt2J22g';
  const order = await Order.findAll({ where: { status: 'SHIPPED' } });
  const tracking = {};
  // loop over array to get tracking no.
  order.forEach((el) => {
    tracking[el.tracking] = el.id;
  });

  // sent request to EMS API
  if (order.length <= 0) {
    return;
  }
  const response = await getAllComplete(Object.keys(tracking), token);
  const completedTracking = Object.keys(response);
  await Order.update(
    { status: 'COMPLETED' },
    { where: { tracking: completedTracking } }
  );
};

updateOrderStatus();

const subTotal = (order) =>
  order.orderItem.reduce((acc, curr) => curr.price * curr.amount + acc, 0);

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

// exports.getCart = async (req, res, next) => {
//   const { orderId } = req.params;
//   const cart = await getUserOrderItems(orderId);
//   res.status(200).json({ cart });
// };

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
        include: {
          model: ProductImage,
          as: 'productImg',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      },
    });
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
          include: {
            model: ProductImage,
            as: 'productImg',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
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

exports.getCart = async (req, res, next) => {
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
          include: {
            model: ProductImage,
            as: 'productImg',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        },
      },
    ],
  });

  res.json({ order });
};

exports.getMyOrder = async (req, res, next) => {
  const { id: userId } = req.user;

  const order = await Order.findAll({
    where: { userId: userId, status: { [Op.ne]: 'PENDING' } },
    order: [['id', 'desc']],
    include: [
      {
        model: OrderItem,
        as: 'orderItem',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: {
          model: Product,
          as: 'product',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: {
            model: ProductImage,
            as: 'productImg',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        },
      },
    ],
  });

  res.json({ order });
};
exports.getMyOrderById = async (req, res, next) => {
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzZWN1cmUtYXBpIiwiYXVkIjoic2VjdXJlLWFwcCIsInN1YiI6IkF1dGhvcml6YXRpb24iLCJleHAiOjE2NDYwNjYwMjYsInJvbCI6WyJST0xFX1VTRVIiXSwiZCpzaWciOnsicCI6InpXNzB4IiwicyI6bnVsbCwidSI6ImMyYWIyZWRkODAwZDU1M2Y0OWNiNzQ4NmU4N2E5OGU0IiwiZiI6InhzeiM5In19.auKbkiFc9TVwjrD26menf4uN2Vp_RIRwbfbQ3ULFD7VPJ6PhWiW_fePFS2GxrXwUmj3Wd6dX-dI5-IBlt2J22g';
  const { id: userId } = req.user;
  const { id } = req.params;
  const order = await Order.findOne({
    where: {
      id,
      userId: userId,
      status: { [Op.ne]: 'PENDING' },
    },
    include: [
      {
        model: OrderItem,
        as: 'orderItem',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: {
          model: Product,
          as: 'product',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: {
            model: ProductImage,
            as: 'productImg',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        },
      },
    ],
  });
  if (!order) {
    return res.json({ order: null });
  }
  const subTotal = order.orderItem.reduce(
    (acc, curr) => curr.price * curr.amount + acc,
    0
  );

  let trackingInfo = null;
  if (order.tracking) {
    trackingInfo = await getItemStatus(order.tracking, token);
  }
  console.log('--------------->', trackingInfo);
  res.json({ order, subTotal, trackingInfo: trackingInfo });
};

exports.getUserOrder = getUserOrder;
