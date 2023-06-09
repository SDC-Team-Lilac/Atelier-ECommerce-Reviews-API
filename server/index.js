const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const port = 3001 || 8080;
const routes = require('./routes.js');

app.use(express.json());
app.use('/', routes);

/*
app.get('/reviews', (req, res) => {
  console.log(req.query)
  res.send({})
})
*/

app.listen(port, () => {
  console.log(`SDC Lilac App listening on port ${port}`)
})

//export default app;