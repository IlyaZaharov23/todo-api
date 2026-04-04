require("dotenv").config();
require("./sentry.instruments");
const Sentry = require("@sentry/node");
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const YAML = require("yamljs");
const mainRouter = require("./routes");
const app = express();
const swaggerSpec = YAML.load(path.join(__dirname, "todoDocs.yaml"));

const PORT = process.env.DEV_PORT;

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", mainRouter);

Sentry.setupExpressErrorHandler(app);

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
