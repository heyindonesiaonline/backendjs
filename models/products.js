'use strict';
module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define('Products', {
    name: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT,
    images: DataTypes.STRING,
    status: DataTypes.SMALLINT
  });
  Products.associate = function(models) {
    Products.belongsTo(models.Categories, { foreignKey: 'categoryId' });
    Products.hasMany(models.Uploads,{as: 'productImages'});
  };

  Products.prototype.toWeb = function () {
    let json = this.toJSON();
    return json;
  };

  return Products;
};