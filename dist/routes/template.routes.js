"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const template_controller_1 = require("../controllers/template.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.post('/', template_controller_1.templateController.create);
router.get('/', template_controller_1.templateController.list);
router.get('/:id', template_controller_1.templateController.getById);
router.put('/:id', template_controller_1.templateController.update);
router.delete('/:id', template_controller_1.templateController.delete);
exports.default = router;
//# sourceMappingURL=template.routes.js.map