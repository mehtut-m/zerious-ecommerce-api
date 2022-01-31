module.exports = (sequelize, DataTypes) => {
  const PromoRedeem = sequelize.define(
    'PromoRedeem',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      validFrom: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {},
      },
      validUntil: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      totalLimit: {
        type: DataTypes.INTEGER,
      },
      limitPerUser: {
        type: DataTypes.INTEGER,
      },
    },
    { underscored: true }
  );

  PromoRedeem.associate = (models) => {
    PromoRedeem.belongsTo(models.PromoCode, {
      foreignKey: { name: 'promoId', allowNull: false },
    });
    PromoRedeem.belongsTo(models.Order, {
      foreignKey: { name: 'orderId', allowNull: false },
    });
  };

  return PromoRedeem;
};
