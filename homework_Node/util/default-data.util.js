const {ADMIN} = require('../configs/users-role');
const {User} = require('../dataBase');

module.exports = async () => {
    const user = await User.findOne({ role: ADMIN });

    if (!user) {
        await User.createUserWithHashPassword({
            name: 'Roman',
            email: 'roman.admin@site.com',
            password: 'Okten!',
            role: ADMIN
        });
    }
};
