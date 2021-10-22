const {model, Schema} = require('mongoose');

const {dataBaseName} = require('../configs');

const actionTokenSchema = new Schema({
    token_action: {
        type: String,
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: dataBaseName.USER
    }
}, {timestamps: true, versionKey: false});

module.exports = model(dataBaseName.ACTION_TOKEN, actionTokenSchema);
