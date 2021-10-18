const router = require('express')
    .Router();

const userMiddleware = require('../middlewares/user.middleware');
const {userRoles} = require('../configs');
const {userController} = require('../controllers');

router.get('/', userController.getUsers);

router.post('/', userMiddleware.validateUser, userMiddleware.checkUniqueEmail, userController.createUser);

router.get('/:user_id', userMiddleware.userById, userController.getUserById);

router.put('/:user_id', userMiddleware.validateUserToUpdate, userMiddleware.userById, userController.updateUser);

router.delete('/:user_id', userMiddleware.userById, userController.deleteUser,
    userMiddleware.checkUserRole([
        userRoles.USER,
        userRoles.ADMIN
    ]));

module.exports = router;
