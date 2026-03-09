const bcrypt = require('bcryptjs');
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};
const comparePassword = async (password, hashedPathword) => {
    return await bcrypt.compare(password, hashedPathword);
};
module.exports = { hashPassword, comparePassword };