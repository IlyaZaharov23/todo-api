require("./sentry.instruments");
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const YAML = require("yamljs");
const Sentry = require("@sentry/node");
const mainRouter = require("./routes");
const app = express();
const swaggerSpec = YAML.load(path.join(__dirname, "todoDocs.yaml"));
require("dotenv").config();

const PORT = process.env.DEV_PORT;

Sentry.setupExpressErrorHandler(app);
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", mainRouter);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
