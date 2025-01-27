const sequelize = require("../dbConection")
const { DataTypes, Op } = require("sequelize")

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  diskSpace: { type: DataTypes.BIGINT, defaultValue: 1024 ** 3 * 10 },
  usedSpace: { type: DataTypes.BIGINT, defaultValue: 0 },
  avatarImg: { type: DataTypes.STRING },
  secret: { type: DataTypes.STRING, defaultValue: null },
  tempSecret: { type: DataTypes.STRING, defaultValue: null },
  tempSecretExpires: { type: DataTypes.DATE, defaultValue: null }
})

const File = sequelize.define("file", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  size: { type: DataTypes.INTEGER, defaultValue: 0 },
  path: { type: DataTypes.STRING, defaultValue: '' },
  parentId: { type: DataTypes.INTEGER, defaultValue: 0 }
})

User.beforeFind(async (options) => {
  await User.update(
    { tempSecret: null, tempSecretExpires: null },
    { where: { tempSecretExpires: { [Op.lt]: new Date() } } }
  )
})

User.hasMany(File)
File.belongsTo(User)

module.exports = {
  User,
  File
}