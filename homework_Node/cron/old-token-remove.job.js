const dayJs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayJs.extend(utc);

const {OAuth} = require("../dataBase");

module.exports = async () => {
    const previousMonth = dayJs.utc().subtract(1, 'month');

    console.log(previousMonth);

    await OAuth.deleteMany({
        createdAt:{$lt:previousMonth}
    });
};
