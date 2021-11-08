const {ADMIN} = require('../configs/users-role');
const {User} = require('../dataBase');
const {ADMIN_PASSWORD} = require("../configs/config");
const {passwordService: {hash}} = require('../services');

module.exports = async () => {
    const user = await User.findOne({ role: ADMIN });

    if (!user) {
        const hashPas = await hash(ADMIN_PASSWORD);
        await User.create({
            name: 'Roman',
            email: 'roman.admin@site.com',
            password: hashPas,
            role: ADMIN
        });
    }
};
