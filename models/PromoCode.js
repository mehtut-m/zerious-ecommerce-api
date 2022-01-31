module.exports = (sequelize, DataTypes) => {
  const PromoCode = sequelize.define(
    'PromoCode',
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
      discountType: {
        type: DataTypes.ENUM('PERCENTAGE', 'AMOUNT'),
        allowNull: false,
        defaultValue: 'AMOUNT',
        validate: {
          isIn: [['PERCENTAGE', 'AMOUNT']],
        },
      },
      minimumEligible: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      minDiscount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      maxDiscount: {
        type: DataTypes.DECIMAL(10, 2),
      },
    },
    { underscored: true }
  );

  PromoCode.associate = (models) => {
    PromoCode.hasMany(models.PromoRedeem, {
      as: 'promo_code',
      foreignKey: { name: 'promoId', allowNull: false },
    });
  };

  return PromoCode;
};
