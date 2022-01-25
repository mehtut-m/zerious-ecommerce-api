const { Order, OrderItem } = require('../models');
const { findProduct } = require('../services/product');

const getUserOrder = async (userId) => {
  const order = await Order.findOrCreate({
    where: { userId: userId },
    include: [
      {
        model: OrderItem,
        as: 'orderItem',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
  });
  return order;
};

exports.addItemToCart = async (req, res, next) => {
  //
  try {
    const user = req.user;
    const { productId, amount } = req.body;

    //Check if a product with the id does exist
    const product = await findProduct(productId);
    if (!product) {
      res.json({ message: 'productId is invalid' });
    }

    //Find pending order or Create new order if user does not have has a pending order
    const [order] = await getUserOrder(user.id);

    // Check if this product is already in cart
    const findIndexItem = order.orderItem.findIndex(
      (el) => el.productId === productId
    );

    let orderItem;
    // if product is not included created a new order item
    if (order.orderItem === undefined || findIndexItem === -1) {
      orderItem = await OrderItem.create({
        orderId: order.id,
        productId,
        amount,
        price: product.price,
      });

      return res.json({ message: orderItem });
    }

    // if product is already included update a new

    order.orderItem[findIndexItem].amount = amount;
    orderItem = await order.orderItem[findIndexItem].save();
    res.json({ orderItem });
    // orderItem = await OrderItem.create({
    //     orderId: order.id,
    //     productId,
    //     amount,
    //     price: product.price,
    //   });
  } catch (err) {
    next(err);
  }
};
