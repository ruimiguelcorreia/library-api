const mongoose = require('mongoose');
const app = require('./src/app');

const APP_PORT = 3000;

mongoose.connect(process.env.DATABASE_CONN, { useNewUrlParser: true }, () => {
  app.listen(APP_PORT, () => {
    console.log('App listening on port 3000');
  });
});
