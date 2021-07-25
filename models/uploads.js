'use strict';
module.exports = (sequelize, DataTypes) => {
  const Uploads = sequelize.define('Uploads', {
    content: DataTypes.STRING,
    contentId: DataTypes.STRING,
    type: DataTypes.STRING,
    name: DataTypes.STRING,
    data: {
      type: DataTypes.BLOB, 
      allowNull: true,
      get() {
          return this.getDataValue('data') ? this.getDataValue('data').toString('utf8') : null;
      },
    },
  }, {});
  Uploads.associate = function(models) {
    Uploads.belongsTo(models.Products, { foreignKey: 'contentId' });
  };
  return Uploads;
};