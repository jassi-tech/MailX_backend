"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyAuth = void 0;
const crypto_1 = __importDefault(require("crypto"));
const ApiKey_1 = require("../models/ApiKey");
const response_1 = require("../utils/response");
const apiKeyAuth = async (req, res, next) => {
    const rawKey = req.headers['x-api-key'];
    if (!rawKey) {
        (0, response_1.error)(res, 'API key required', 401);
        return;
    }
    const keyHash = crypto_1.default.createHash('sha256').update(rawKey).digest('hex');
    const apiKey = await ApiKey_1.ApiKey.findOne({ keyHash, isActive: true });
    if (!apiKey) {
        (0, response_1.error)(res, 'Invalid or revoked API key', 401);
        return;
    }
    // Update last used timestamp (non-blocking)
    ApiKey_1.ApiKey.findByIdAndUpdate(apiKey._id, { lastUsedAt: new Date() }).exec();
    req.apiKey = {
        id: String(apiKey._id),
        userId: String(apiKey.userId),
        smtpConfigId: String(apiKey.smtpConfigId),
    };
    next();
};
exports.apiKeyAuth = apiKeyAuth;
//# sourceMappingURL=apiKeyAuth.js.map