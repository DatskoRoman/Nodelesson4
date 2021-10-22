const emailActions = require('../configs/email-action.enum');


module.exports = {
    [emailActions.CHANGE_PASSWORD]: {
        templateName: 'change-password',
        subject: 'Change password!!!'
    },

    [emailActions.FORGOT_PASSWORD]: {
        templateName: 'forgot-password',
        subject: 'Forgot password!!!'
    },

    [emailActions.USER_WAS_DELETED]: {
        templateName: 'user-was-deleted',
        subject: 'Deleted'
    },

    [emailActions.USER_WAS_REGISTERED]: {
        templateName: 'user-was-registered',
        subject: 'Registered'
    }
};
