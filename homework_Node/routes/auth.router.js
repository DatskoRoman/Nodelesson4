const router = require('express').Router();

const {authMiddleware, userMiddleware} = require('../middlewares');
const {authController} = require('../controllers');
const {ADMIN, USER} = require('../configs/user-roles.enum');
const {passwordService} = require('../service');

router.post('/', authMiddleware.userValidate, authMiddleware.emailExist, authController.login);

router.post(
    '/',
    userMiddleware.checkUniqueEmail,
    userMiddleware.checkUserRole([
        ADMIN,
        USER
    ]),
    passwordService.isPasswordsMatched,
    authController.login
);
router.post('/logout', authController.logout);
router.post('/refresh', authMiddleware.checkRefreshToken, authController.login);


module.exports = router;
