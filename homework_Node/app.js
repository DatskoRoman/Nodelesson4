const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const {MONGO_CONNECT_URL, PORT} = require('./configs/config');
const {authRouter, userRouter,passwordRouter} = require('./routers');
const {GENERIC_ERROR}=require('./errors/status-enum');

mongoose.connect(MONGO_CONNECT_URL);

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/password', passwordRouter);
// eslint-disable-next-line no-unused-vars
app.use('*', (err, req, res, next) => {
    res
        .status(err.status || GENERIC_ERROR)
        .json({message: err.message});
});

app.listen(PORT, () => {
    console.log(`App listen ${PORT}`);
});
