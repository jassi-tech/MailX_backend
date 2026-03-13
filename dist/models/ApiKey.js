"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKey = void 0;
const mongoose_1 = require("mongoose");
const crypto_1 = __importDefault(require("crypto"));
const apiKeySchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    label: { type: String, required: true, trim: true },
    keyHash: { type: String, required: true, unique: true },
    keyPrefix: { type: String, required: true },
    smtpConfigId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'SMTPConfig', required: true },
    isActive: { type: Boolean, default: true },
    lastUsedAt: { type: Date },
}, { timestamps: true });
// Static method to generate a new raw API key
apiKeySchema.statics.generateKey = () => {
    return `mf_${crypto_1.default.randomBytes(32).toString('hex')}`;
};
// Static method to hash a raw key for storage
apiKeySchema.statics.hashKey = (rawKey) => {
    return crypto_1.default.createHash('sha256').update(rawKey).digest('hex');
};
exports.ApiKey = (0, mongoose_1.model)('ApiKey', apiKeySchema);
//# sourceMappingURL=ApiKey.js.map