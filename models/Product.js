const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  start_date: { type: DataTypes.DATE, allowNull: false },
  expiry_date: { type: DataTypes.DATE, allowNull: false },
  free_delivery: { type: DataTypes.BOOLEAN, defaultValue: false },
  delivery_amount: { type: DataTypes.DECIMAL(10, 2) },
  imageUrl: {type: DataTypes.STRING, allowNull: false, unique: true},
  old_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  new_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  unique_url: { type: DataTypes.STRING, allowNull: false, unique: true },
  vendor_id: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Product;
