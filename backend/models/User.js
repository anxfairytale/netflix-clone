module.exports = (Sequelize, sequelize) => {
    const User = sequelize.define('user',{
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        role: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'user'
        },

        isVerified: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        dob:{
            type:Sequelize.DATEONLY,
            allowNull:true
        },
        above18:{
            type:Sequelize.BOOLEAN,
            allowNull:false
        },
        passphrase:{
            type:Sequelize.STRING,
            allowNull:true
        }
    });
    return User;
}