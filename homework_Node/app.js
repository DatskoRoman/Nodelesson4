const express = require('express');
const {connect} = require('mongoose');
require('dotenv').config();

const {MONGO_CONNECT_URL, PORT} = require('./configs/config');
const userRouter = require('./routes/user.router');
const authRouter = require('./routes/auth.router');

const app = express();

connect(MONGO_CONNECT_URL);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/auth', authRouter);
app.use('/users', userRouter);

app.use('*', (err, req, res) => {
    res
        .status(err.status || 500)
        .json({
            msg: err.message
        });
});

app.listen(PORT, (err) => {
    if (!err) {
        // eslint-disable-next-line no-console
        console.log(`App Listen ${PORT}`);
    }
});