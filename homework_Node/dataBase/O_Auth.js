const {model, Schema} = require('mongoose');

const oAuth = new Schema({
    access_token: {
        type: String,
        trim: true,
        required: true
    },

    refresh_token: {
        type: String,
        trim: true,
        required: true
    },

    user_id: {
        type: Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'user'
    },
},
    {
        timestamps: true
    });

module.exports = model('o_auth', oAuth);
