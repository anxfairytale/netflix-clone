module.exports = (Sequelize, sequelize) => {
  const Image = sequelize.define('image', {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },

    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    imageURL: {
      type: Sequelize.STRING,
      allowNull: true
    },
    videoURL: {
      type: Sequelize.STRING,
      allowNull: true
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },

    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  })

  return Image
}