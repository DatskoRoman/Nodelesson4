const router = require('express').Router();

const {authValidator} = require('../validators');
const {authMiddleware, userMiddleware} = require('../middlewares');
const {authController} = require('../controllers');

router.post(
    '/',
    userMiddleware.isBodyValid(authValidator, 1),
    authMiddleware.isEmailExist,
    authMiddleware.isPasswordMatched,
    authController.login
);

router.post(
    '/logout',
    authMiddleware.checkAccessToken,
    authController.logout
);
router.post(
    '/forgot-password',
    userMiddleware.isBodyValid(authValidator, 1),
    authMiddleware.isEmailExist,
    authController.forgotPassword
);
router.post(
    '/refresh',
    authMiddleware.checkRefreshToken,
    authController.refresh
);

router.post(
    '/change-password/:token_action',
    userMiddleware.isBodyValid(authValidator),
    authMiddleware.checkActionToken,
    authController.changePassword
);

module.exports = router;
