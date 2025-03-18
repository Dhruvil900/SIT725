var express = require("express");
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () =>
  console.log(`App listening to: http://localhost:${port} `)
);
app.get("/add", (req, res) => {
  let num1 = parseFloat(req.query.num1);
  let num2 = parseFloat(req.query.num2);
  let sum = num1 + num2;
  res.send({ result: sum });
});
