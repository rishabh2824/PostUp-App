module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define("Comments", {
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
        },
    });

    Comments.associate = (models) => {
        Comments.belongsTo(models.Posts, {
            foreignKey: 'postId',
            onDelete: 'CASCADE'
        });
    };

    return Comments;
};