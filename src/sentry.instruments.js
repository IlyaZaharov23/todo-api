const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://4dbc631f8d173ed3604c10c9b7c9a6fd@o4511157006237696.ingest.de.sentry.io/4511157515255888",
  sendDefaultPii: true,
  // debug: true,
  // integrations: [
  //   Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  // ],
  // enableLogs: true,
  // sendDefaultPii: true,
  // tracesSampleRate: 1.0,
});

module.exports = Sentry;
