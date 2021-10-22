const router = require('express').Router();

const {userValidator} = require('../validators');
const {authMiddleware, userMiddleware} = require('../middlewares');
const {userRoles} = require('../configs/index');
const {userController} = require('../controllers');

router.get('/', userController.getUsers);

router.post(
    '/',
    userMiddleware.isBodyValid(userValidator),
    userMiddleware.isUserEmailExist,
    userController.createUser
);

router.get(
    '/:userId',
    userMiddleware.isUserExist,
    userController.getUserById
);
router.put(
    '/:userId',
    userMiddleware.isBodyValid(userValidator),
    authMiddleware.checkAccessToken,
    userMiddleware.isUserExist,
    userController.updateUser
);
router.delete(
    '/:userId',
    authMiddleware.checkAccessToken,
    userMiddleware.isUserRolesChecked([userRoles.ADMIN]),
    userController.deleteUser
);

module.exports = router;
