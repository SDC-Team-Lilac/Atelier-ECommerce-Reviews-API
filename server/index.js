const express = require('express');
const app = express();
const port = 3000;
const routes = require('./routes.js');

app.use('/', routes);

app.listen(port, () => {
  console.log(`SDC Lilac App listening on port ${port}`)
})