const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../resources/postgresql');
const models = {};

fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 &&
    file !== 'index.js' &&
    file !== 'migrations')
  .forEach(file => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    models[model.name] = model;
  });

Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

module.exports = Object.assign({ sequelize }, models);
