const User = require('../dataBase/User');
const {ADMIN} = require('../configs/users-role');

module.exports = async () => {
    const user = await User.findOne({ role: ADMIN });

    if (!user) {
        await User.create({
            name: 'Roman',
            email: 'roman.admin@site.com',
            password: 'Okten!',
            role: ADMIN
        });
    }
};
