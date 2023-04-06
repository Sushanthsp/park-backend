const bcrypt = require('bcrypt')
const config = require('../config/config')

module.exports.setPassword = async (password) => {
 const hashedPassword = await bcrypt.hash(password, parseInt(config.SALT_ROUND))
 return hashedPassword
};

module.exports.verifyPassword = async (password, oldHash) => {
    const hash = await bcrypt.compare(password, oldHash)
    return hash
};
