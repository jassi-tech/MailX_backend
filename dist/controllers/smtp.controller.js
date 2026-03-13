"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smtpController = void 0;
const smtpService_1 = require("../services/smtpService");
const response_1 = require("../utils/response");
exports.smtpController = {
    async testConnection(req, res) {
        let { host, port, secure, user, password } = req.body;
        if (!host || !port || !user || !password) {
            (0, response_1.error)(res, 'host, port, user, password required', 400);
            return;
        }
        try {
            await smtpService_1.smtpService.testConnection({
                host: host.trim(),
                port,
                secure: !!secure,
                user: user.trim(),
                password
            });
            (0, response_1.success)(res, {}, 'SMTP connection successful ✅');
        }
        catch (err) {
            (0, response_1.error)(res, `SMTP connection failed: ${err.message}`, 400);
        }
    },
    async saveConfig(req, res) {
        const { label, host, port, secure, user, password, fromName, fromEmail, isDefault } = req.body;
        if (!label || !host || !port || !user || !password || !fromName || !fromEmail) {
            (0, response_1.error)(res, 'All fields required', 400);
            return;
        }
        try {
            const config = await smtpService_1.smtpService.saveConfig(req.user.id, { label, host, port, secure, user, password, fromName, fromEmail, isDefault });
            (0, response_1.success)(res, config, 'SMTP config saved', 201);
        }
        catch (err) {
            (0, response_1.error)(res, `Failed to save config: ${err.message}`, 500);
        }
    },
    async listConfigs(req, res) {
        const configs = await smtpService_1.smtpService.listConfigs(req.user.id);
        (0, response_1.success)(res, configs);
    },
    async deleteConfig(req, res) {
        const deleted = await smtpService_1.smtpService.deleteConfig(req.user.id, req.params.id);
        if (!deleted) {
            (0, response_1.error)(res, 'Config not found', 404);
            return;
        }
        (0, response_1.success)(res, {}, 'Config deleted');
    },
    async updateConfig(req, res) {
        try {
            const config = await smtpService_1.smtpService.updateConfig(req.user.id, req.params.id, req.body);
            if (!config) {
                (0, response_1.error)(res, 'Config not found', 404);
                return;
            }
            (0, response_1.success)(res, config, 'SMTP config updated');
        }
        catch (err) {
            (0, response_1.error)(res, `Failed to update config: ${err.message}`, 500);
        }
    },
};
//# sourceMappingURL=smtp.controller.js.map