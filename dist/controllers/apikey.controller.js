"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyController = void 0;
const crypto_1 = __importDefault(require("crypto"));
const ApiKey_1 = require("../models/ApiKey");
const SMTPConfig_1 = require("../models/SMTPConfig");
const response_1 = require("../utils/response");
const mongoose_1 = require("mongoose");
exports.apiKeyController = {
    async generateKey(req, res) {
        const { label, smtpConfigId } = req.body;
        if (!label || !smtpConfigId) {
            (0, response_1.error)(res, 'label and smtpConfigId required', 400);
            return;
        }
        const configExists = await SMTPConfig_1.SMTPConfig.findOne({ _id: smtpConfigId, userId: req.user.id });
        if (!configExists) {
            (0, response_1.error)(res, 'SMTP config not found', 404);
            return;
        }
        const rawKey = `mf_${crypto_1.default.randomBytes(32).toString('hex')}`;
        const keyHash = crypto_1.default.createHash('sha256').update(rawKey).digest('hex');
        const keyPrefix = rawKey.substring(0, 10);
        const apiKey = await ApiKey_1.ApiKey.create({
            userId: new mongoose_1.Types.ObjectId(req.user.id),
            label,
            keyHash,
            keyPrefix,
            smtpConfigId: new mongoose_1.Types.ObjectId(smtpConfigId),
        });
        // Return raw key once – never stored again
        (0, response_1.success)(res, { ...apiKey.toObject(), rawKey }, 'API key generated – save this key, it won\'t be shown again', 201);
    },
    async listKeys(req, res) {
        const keys = await ApiKey_1.ApiKey.find({ userId: req.user.id }, { keyHash: 0 })
            .populate('smtpConfigId', 'label fromEmail')
            .sort({ createdAt: -1 });
        (0, response_1.success)(res, keys);
    },
    async revokeKey(req, res) {
        const deleted = await ApiKey_1.ApiKey.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!deleted) {
            (0, response_1.error)(res, 'API key not found', 404);
            return;
        }
        (0, response_1.success)(res, {}, 'API key revoked');
    },
};
//# sourceMappingURL=apikey.controller.js.map