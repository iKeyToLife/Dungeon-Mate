const { connect, connection } = require('mongoose');
require('dotenv').config();

connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = connection;
