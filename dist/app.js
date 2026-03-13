"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_dns_1 = __importDefault(require("node:dns"));
node_dns_1.default.setDefaultResultOrder('ipv4first');
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
require("./config/passport"); // Initialize passport strategy
const env_1 = require("./config/env");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const smtp_routes_1 = __importDefault(require("./routes/smtp.routes"));
const apikey_routes_1 = __importDefault(require("./routes/apikey.routes"));
const mail_routes_1 = __importDefault(require("./routes/mail.routes"));
const template_routes_1 = __importDefault(require("./routes/template.routes"));
const services_routes_1 = __importDefault(require("./routes/services.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
// CORS
app.use((0, cors_1.default)({
    origin: env_1.env.appUrl,
    credentials: true,
}));
app.use(express_1.default.json({ limit: '5mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(passport_1.default.initialize());
// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', env: env_1.env.nodeEnv }));
// Routes
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/auth', auth_routes_1.default); // Support root-level auth for Google callback
app.use('/api/v1/smtp', smtp_routes_1.default);
app.use('/api/v1/keys', apikey_routes_1.default);
app.use('/api/v1', mail_routes_1.default); // /api/v1/send-mail + /api/v1/logs
app.use('/api/v1/templates', template_routes_1.default);
app.use('/api/v1/services', services_routes_1.default);
// Error handlers (must be last)
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map