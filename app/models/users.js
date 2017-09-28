const bcrypt = require('bcrypt'),
      salt = bcrypt.genSaltSync(10);

module.exports = function (sequelize, DataTypes) {
    
      var users = sequelize.define('users', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
              isEmail: true,
              notEmpty: true
            }
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false
          },
          firstName:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: true
            }
          },
          lastName:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: true
            }
          },
          avatar:{
            type: DataTypes.STRING
          },
          // 0 = простой смертный
          // 1 = админ
          // 2 = дементор
          roleId:{
            type: DataTypes.INTEGER,
            defaultValue: 0
          }
      }, {
        classMethods: {
          associate: function (models) {
            // example on how to add relations
            // Article.hasMany(models.Comments);
          },
          isPassword: (password, cryptedPass) => {
              return bcrypt.compareSync(password, cryptedPass);
          },
          publicFields: ["id","email", "firstName", "lastName", "avatar", "roleId", "createdAt", "updatedAt"]
        }
      });
    
    users.hook('beforeCreate', user=>{
        user.password = bcrypt.hashSync(user.password, salt)
    });
    users.hook('beforeUpdate', (user)=>{
        if (user.password != null) {
            user.password = bcrypt.hashSync(user.password, salt);
        }
    });

      return users;
    };