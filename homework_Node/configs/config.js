module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'dev',

    ADMIN_PASSWORD:'qwerty12345%',

    MONGO_CONNECT_URL: process.env.MONGO_CONNECT_URL || 'mongodb://localhost:27017/june-2021',
    PORT: process.env.PORT || '5000',

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'accessSecretWord',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refreshSecretWord',
    JWT_ACTION_SECRET: process.env.JWT_ACTION_SECRET || 'actionSecretWord',


    NO_REPLY_EMAIL: process.env.NO_REPLY_EMAIL || 'email@gmail.com',
    NO_REPLY_PASSWORD: process.env.NO_REPLY_PASSWORD || '1234567890',

    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',

};
