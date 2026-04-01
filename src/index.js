const express = require("express");
const app = express();
const mainRouter = require("./routes");
require("dotenv").config();

const PORT = process.env.DEV_PORT;

app.use(express.json());
app.use("/api", mainRouter);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
