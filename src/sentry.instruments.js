const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://e3399412d805639978a21352ae914d30@o4511157006237696.ingest.de.sentry.io/4511157013053521",
  debug: true,
  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
  enableLogs: true,
  sendDefaultPii: true,
});

module.exports = Sentry;
