const {Schema, model} = require('mongoose');

const {passwordService} = require('../services');
const MD = require('./ModelDefinition');
const userRoles = require('../configs/model-name-enum');

const userSchema = new Schema({
    ...MD.NEP,
    role: {
        type: String,
        default: userRoles.USER,
        enum: Object.values(userRoles)
    },
    age: {
        type: Number,
    }
}, MD.gentelmenClub);


// const userSchema = new Schema({
//     name: {
//         type: String,
//         trim: true,
//         required: true
//     },
//
//     email: {
//         type: String,
//         unique: true,
//         trim: true,
//         required: true
//     },
//
//     password: {
//         type: String,
//         trim: true,
//         required: true
//     },
//
//     role: {
//         type: String,
//         trim: true,
//         required: true,
//         default: 'user',
//         enum: [
//             ADMIN,
//             MANAGER,
//             USER
//         ]
//     },
//
//     is_active: {
//         type: Boolean,
//         default: false,
//         required:true
//     }
// });

userSchema.statics = {
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

module.exports = model('user', userSchema);
