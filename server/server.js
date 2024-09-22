const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('../client/dist'));

// client/public/folder
app.use('/static', express.static(path.join(__dirname, '../client/public')));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('./routes/htmlRoutes.js')(app);

app.listen(PORT, function () {
  console.log(`Now listening on port: http://localhost:${PORT}`);
});
