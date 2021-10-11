const router = require('express').Router();

const {getUsers, createUser, getUserById, updateUser, deleteUser} = require('../controllers/user.controller');
const {
    allUser,
    validateUser,
    checkUniqueEmail,
    user,
    validateUserToUpdate,
} = require('../middlewares/user.middleware');

router.get('/', allUser, getUsers);

router.post('/', validateUser, checkUniqueEmail, createUser);

router.get('/:user_id', user, getUserById);

router.put('/:user_id', validateUserToUpdate, user, updateUser);

router.delete('/:user_id', user, deleteUser);

module.exports = router;
