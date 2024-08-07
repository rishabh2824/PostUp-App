module.exports = (sequelize, DataTypes) => {
    const Likes = sequelize.define("Likes", {
        PostId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    Likes.associate = (models) => {
        Likes.belongsTo(models.Posts, {  // Add this line
            foreignKey: 'PostId',
            onDelete: 'CASCADE'
        });
    };

    return Likes;
};