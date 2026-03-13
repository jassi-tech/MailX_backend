"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMTPConfig = void 0;
const mongoose_1 = require("mongoose");
const smtpConfigSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    label: { type: String, required: true, trim: true },
    host: { type: String, required: true },
    port: { type: Number, required: true, default: 587 },
    secure: { type: Boolean, default: false },
    user: { type: String, required: true },
    encryptedPass: {
        iv: { type: String, required: true },
        authTag: { type: String, required: true },
        ciphertext: { type: String, required: true },
    },
    fromName: { type: String, required: true },
    fromEmail: { type: String, required: true, lowercase: true },
    isDefault: { type: Boolean, default: false },
}, { timestamps: true });
exports.SMTPConfig = (0, mongoose_1.model)('SMTPConfig', smtpConfigSchema);
//# sourceMappingURL=SMTPConfig.js.map