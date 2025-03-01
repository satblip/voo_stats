module.exports = (sequelize, DataTypes) => {
  return sequelize.define('wind', {
    timestamp: {
      type: DataTypes.DATE,
      field: 'timestamp',
      allowNull: false,
      notEmpty: true
    },

    windSpeed: {
      type: DataTypes.FLOAT,
      field: 'wind_speed',
      allowNull: false,
      notEmpty: true
    },

    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },

    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    },

    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: 'wind_timestamp_index',
        unique: true,
        fields: ['timestamp']
      }
    ]
  });
};
