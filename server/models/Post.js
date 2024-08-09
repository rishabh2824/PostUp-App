module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define("Post", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postText: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    });
  
    Post.associate = (models) => {
        Post.belongsTo(models.User, { 
          foreignKey: 'userId',
          onDelete: 'CASCADE',
        });
        Post.hasMany(models.Comment, {
          foreignKey: 'postId',
          onDelete: 'CASCADE',
        });
        Post.hasMany(models.Like, {
          foreignKey: 'postId',
          onDelete: 'CASCADE',
        });
      };      
  
    return Post;
  };