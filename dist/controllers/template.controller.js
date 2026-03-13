"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateController = void 0;
const templateService_1 = require("../services/templateService");
const response_1 = require("../utils/response");
exports.templateController = {
    async create(req, res) {
        const { name, subject, html } = req.body;
        if (!name || !subject || !html) {
            (0, response_1.error)(res, 'name, subject, html required', 400);
            return;
        }
        const template = await templateService_1.templateService.create(req.user.id, { name, subject, html });
        (0, response_1.success)(res, template, 'Template created', 201);
    },
    async list(req, res) {
        const templates = await templateService_1.templateService.list(req.user.id);
        (0, response_1.success)(res, templates);
    },
    async getById(req, res) {
        const template = await templateService_1.templateService.getById(req.user.id, req.params.id);
        if (!template) {
            (0, response_1.error)(res, 'Template not found', 404);
            return;
        }
        (0, response_1.success)(res, template);
    },
    async update(req, res) {
        const template = await templateService_1.templateService.update(req.user.id, req.params.id, req.body);
        if (!template) {
            (0, response_1.error)(res, 'Template not found', 404);
            return;
        }
        (0, response_1.success)(res, template, 'Template updated');
    },
    async delete(req, res) {
        const deleted = await templateService_1.templateService.delete(req.user.id, req.params.id);
        if (!deleted) {
            (0, response_1.error)(res, 'Template not found', 404);
            return;
        }
        (0, response_1.success)(res, {}, 'Template deleted');
    },
};
//# sourceMappingURL=template.controller.js.map