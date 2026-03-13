"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mail_controller_1 = require("../controllers/mail.controller");
const apiKeyAuth_1 = require("../middleware/apiKeyAuth");
const auth_1 = require("../middleware/auth");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
// Send mail – API key auth + rate limit
router.post('/send-mail', apiKeyAuth_1.apiKeyAuth, rateLimiter_1.apiKeyRateLimiter, mail_controller_1.mailController.sendMail);
// Logs – JWT auth
router.get('/logs', auth_1.authMiddleware, mail_controller_1.logController.getLogs);
router.get('/logs/:id', auth_1.authMiddleware, mail_controller_1.logController.getLog);
exports.default = router;
//# sourceMappingURL=mail.routes.js.map