const {model, Schema} = require('mongoose');

const {userRole: {ADMIN, MANAGER, USER}} = require('../configs');
const {passwordService} = require('../services');

const User = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },

    email: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },

    password: {
        type: String,
        trim: true,
        required: true
    },

    role: {
        type: String,
        trim: true,
        required: true,
        default: 'user',
        enum: [
            ADMIN,
            MANAGER,
            USER
        ]
    },

    is_active: {
        type: Boolean,
        default: false,
        required:true
    }
});

User.statics = {
    testStatic(msg) {
        console.log('*******************');
        console.log('TEST STATIC', msg);
        console.log('TEST STATIC', msg);
        console.log('*******************');
    },

    async createUserWithHashPassword(userObject) {
        const hashedPassword = await passwordService.hash(userObject.password);

        return this.create({ ...userObject, password: hashedPassword });
    }
};

module.exports = model('user', User);
