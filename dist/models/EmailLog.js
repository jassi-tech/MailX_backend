"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailLog = void 0;
const mongoose_1 = require("mongoose");
const emailLogSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    apiKeyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ApiKey', required: true },
    smtpConfigId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'SMTPConfig', required: true },
    to: { type: mongoose_1.Schema.Types.Mixed, required: true },
    subject: { type: String, required: true },
    html: { type: String, required: true },
    status: {
        type: String,
        enum: ['queued', 'sending', 'sent', 'failed'],
        default: 'queued',
    },
    errorMessage: { type: String },
    queuedAt: { type: Date, default: Date.now },
    sentAt: { type: Date },
}, { timestamps: true });
// Index for quick filtering by status
emailLogSchema.index({ userId: 1, status: 1, createdAt: -1 });
exports.EmailLog = (0, mongoose_1.model)('EmailLog', emailLogSchema);
//# sourceMappingURL=EmailLog.js.map