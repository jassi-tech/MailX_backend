"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apikey_controller_1 = require("../controllers/apikey.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.post('/', apikey_controller_1.apiKeyController.generateKey);
router.get('/', apikey_controller_1.apiKeyController.listKeys);
router.delete('/:id', apikey_controller_1.apiKeyController.revokeKey);
exports.default = router;
//# sourceMappingURL=apikey.routes.js.map