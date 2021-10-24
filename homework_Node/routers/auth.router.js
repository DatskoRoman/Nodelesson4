const router = require('express').Router();

const {authMiddleware} = require('../middlewares');
const {authContollers} = require('../controllers');
const {passwordValidator, mailValidator, authValidators} = require('../validators');
const {ACTIVATE_USER, FORGOT_PASSWORD} = require('../configs/action-token-type');


router.post('/login',
    authMiddleware.isAuthValid(authValidators.authValidator),
    authMiddleware.checkLogin,
    authContollers.login
);

router.post('/logout',
    authMiddleware.checkAccessToken,
    authContollers.logout
);

router.post('/refresh',
    authMiddleware.checkRefreshToken,
    authContollers.refresh
);

router.post('/activate',
    authMiddleware.checkActionToken(ACTIVATE_USER),
    authContollers.activate
);


router.post('/password/forgot',
    authMiddleware.isAuthValid(mailValidator.mailValidator),
    authMiddleware.checkExistUserByEmail,
    authContollers.forgotPassword
);

router.patch('/password/forgot',
    authMiddleware.isAuthValid(passwordValidator.passwordValidator),
    authMiddleware.checkActionToken(FORGOT_PASSWORD),
    authContollers.setPassword
);

module.exports = router;
