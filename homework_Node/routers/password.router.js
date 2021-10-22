const router = require('express').Router();

const {actionMiddleware} = require('../middlewares');
const {passwordConroller} = require('../controllers');

router.post('/forgot',
    actionMiddleware.checkExistUserByEmail,
    passwordConroller.forgot
);

router.post('/set',
    actionMiddleware.isPasswordValid,
    actionMiddleware.checkActionToken,
    passwordConroller.setPassword
);

module.exports = router;
