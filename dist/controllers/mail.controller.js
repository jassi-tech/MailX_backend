"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logController = exports.mailController = void 0;
const mailService_1 = require("../services/mailService");
const response_1 = require("../utils/response");
exports.mailController = {
    async sendMail(req, res) {
        const { to, subject, html } = req.body;
        if (!to || !subject || !html) {
            (0, response_1.error)(res, 'to, subject, html required', 400);
            return;
        }
        try {
            const log = await mailService_1.mailService.queueMail(req.apiKey.userId, req.apiKey.id, {
                to,
                subject,
                html,
                smtpConfigId: req.apiKey.smtpConfigId,
            });
            (0, response_1.success)(res, { logId: log._id, status: log.status }, 'Email queued', 202);
        }
        catch (err) {
            (0, response_1.error)(res, `Failed to queue email: ${err.message}`, 500);
        }
    },
};
exports.logController = {
    async getLogs(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const status = req.query.status;
        const { logs, total } = await mailService_1.mailService.getLogs(req.user.id, page, limit, status);
        (0, response_1.paginated)(res, logs, total, page, limit);
    },
    async getLog(req, res) {
        const log = await mailService_1.mailService.getLogById(req.user.id, req.params.id);
        if (!log) {
            (0, response_1.error)(res, 'Log not found', 404);
            return;
        }
        (0, response_1.success)(res, log);
    },
};
//# sourceMappingURL=mail.controller.js.map