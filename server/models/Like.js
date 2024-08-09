module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define("Like", {
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Posts', // Ensure this matches the Posts table name
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Ensure this matches the Users table name
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }
    });
  
    Like.associate = (models) => {
      Like.belongsTo(models.Post, {
        foreignKey: 'postId',
        onDelete: 'CASCADE',
      });
  
      Like.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
    };
  
    return Like;
  };  