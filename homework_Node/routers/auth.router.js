const router = require('express').Router();

const {authMiddleware} = require('../middlewares');
const {authContollers} = require('../controllers');

router.post('/login',
    authMiddleware.isAuthValid,
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

module.exports = router;
