const nodemailer = require('nodemailer');
const EmailTemplates = require('email-templates');
const path = require('path');

const {NO_REPLY_EMAIL, NO_REPLY_PASSWORD} = require('../configs/config');
const allTemplates = require('../email-templates');
const {messagesEnum, statusEnum, ErrorHandler: {ErrorHandler}} = require('../errors');

const templateParser = new EmailTemplates({
    views: {
        root: path.join(process.cwd(), 'email-templates')
    }
}
);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: NO_REPLY_EMAIL,
        pass: NO_REPLY_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendEmail = async (userMail, emailAction, context) => {
    const templateInfo = allTemplates[emailAction];

    if (!templateInfo) {
        throw new ErrorHandler(messagesEnum.WRONG_TEMPLATE_NAME, statusEnum.BAD_REQUEST);
    }

    const html = await templateParser.render(templateInfo.templateName, context);

    return transporter.sendMail({
        from: 'no reply',
        to: userMail,
        subject: templateInfo.subject,
        html
    });
};

module.exports = sendEmail;
