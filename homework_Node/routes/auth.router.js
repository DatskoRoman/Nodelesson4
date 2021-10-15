const router = require('express').Router();

const {userValidate, emailExist} = require('../middlewares/auth.middleware');
const {login} = require('../controllers/auth.controller');

router.post('/', userValidate, emailExist, login);

module.exports = router;
