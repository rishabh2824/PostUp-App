module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
      commentBody: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    }, {
      tableName: 'Comments',
      timestamps: true,
    });
  
    Comment.associate = (models) => {
      Comment.belongsTo(models.Post, {
        foreignKey: 'postId',
        onDelete: 'CASCADE',
      });
    };
  
    return Comment;
  };