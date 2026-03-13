"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const smtp_controller_1 = require("../controllers/smtp.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.post('/test', smtp_controller_1.smtpController.testConnection);
router.post('/', smtp_controller_1.smtpController.saveConfig);
router.get('/', smtp_controller_1.smtpController.listConfigs);
router.put('/:id', smtp_controller_1.smtpController.updateConfig);
router.delete('/:id', smtp_controller_1.smtpController.deleteConfig);
exports.default = router;
//# sourceMappingURL=smtp.routes.js.map