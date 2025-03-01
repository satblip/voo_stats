module.exports = (sequelize, DataTypes) => {
  const UPChannels = {};
  [1, 2, 3, 4, 5].forEach(index => {
    UPChannels[`UP_${index}`] = {
      type: DataTypes.JSONB,
      field: `UP_${index}`
    };
  });

  const DOWNChannels = {};
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 162].forEach(index => {
    DOWNChannels[`DOWN_${index}`] = {
      type: DataTypes.JSONB,
      field: `DOWN_${index}`
    };
  });

  return sequelize.define('levels', {
    timestamp: {
      type: DataTypes.DATE,
      field: 'timestamp',
      allowNull: false,
      notEmpty: true
    },

    ...UPChannels,
    ...DOWNChannels,

    rawData: {
      type: DataTypes.JSONB,
      field: 'raw-data'
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
        name: 'levels_timestamp_index',
        fields: ['timestamp']
      }
    ]
  });
};
