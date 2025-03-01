module.exports = (sequelize, DataTypes) => {
  return sequelize.define('logs', {
    timestamp: {
      type: DataTypes.DATE,
      field: 'timestamp',
      allowNull: false,
      notEmpty: true
    },

    level: {
      type: DataTypes.INTEGER,
      field: 'level',
      allowNull: false,
      notEmpty: true
    },

    message: {
      type: DataTypes.TEXT,
      field: 'message',
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
        name: 'logs_timestamp_index',
        unique: true,
        fields: ['timestamp']
      }
    ]
  });
};
