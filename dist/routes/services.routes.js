"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const services_1 = require("../data/services");
const response_1 = require("../utils/response");
const router = (0, express_1.Router)();
// GET /api/v1/services — public, no auth needed (static catalogue)
router.get('/', (_req, res) => {
    (0, response_1.success)(res, services_1.SERVICES);
});
exports.default = router;
//# sourceMappingURL=services.routes.js.map