const express = require("express");

// Create the express app
const app = express();
app.get("/test", (req, res) => {
  const { id: url } = req.query;

  res.redirect(url);
});

app.listen(4000, () => {});
