const USER = require('../dataBase/User');

module.exports = {
    findUser: () => USER.find(),

    findUserById: (user_id) => USER.findById(user_id),

    findByEmail: (email) => USER.findOne({email}),

    createUser: (user) => USER.create(user),

    deleteUser: async (user_id) => {
        await USER.deleteOne({_id: user_id});
    },

    updateUser: (user_id, dataToUpdate) => USER.findByIdAndUpdate(user_id, dataToUpdate),

};
