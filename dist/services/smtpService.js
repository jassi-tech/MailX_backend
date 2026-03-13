"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smtpService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const SMTPConfig_1 = require("../models/SMTPConfig");
const crypto_1 = require("../utils/crypto");
const mongoose_1 = require("mongoose");
exports.smtpService = {
    // Test SMTP connection without saving
    async testConnection(input) {
        const transporter = nodemailer_1.default.createTransport({
            host: input.host.trim(),
            port: input.port,
            secure: input.secure,
            auth: { user: input.user.trim(), pass: input.password },
        });
        await transporter.verify();
    },
    // Save encrypted SMTP config
    async saveConfig(userId, input) {
        // If isDefault, unset other defaults first
        if (input.isDefault) {
            await SMTPConfig_1.SMTPConfig.updateMany({ userId }, { isDefault: false });
        }
        const encryptedPass = (0, crypto_1.encrypt)(input.password);
        const config = await SMTPConfig_1.SMTPConfig.create({
            userId: new mongoose_1.Types.ObjectId(userId),
            label: input.label,
            host: input.host,
            port: input.port,
            secure: input.secure,
            user: input.user,
            encryptedPass,
            fromName: input.fromName,
            fromEmail: input.fromEmail,
            isDefault: input.isDefault || false,
        });
        return config;
    },
    // Get decrypted password for a config (used by mail worker)
    async getDecryptedPassword(configId) {
        const config = await SMTPConfig_1.SMTPConfig.findById(configId);
        if (!config)
            throw new Error('SMTP config not found');
        return (0, crypto_1.decrypt)(config.encryptedPass);
    },
    // List all SMTP configs for a user (without exposing encrypted password)
    async listConfigs(userId) {
        return SMTPConfig_1.SMTPConfig.find({ userId }, { encryptedPass: 0 }).sort({ isDefault: -1, createdAt: -1 });
    },
    async deleteConfig(userId, configId) {
        return SMTPConfig_1.SMTPConfig.findOneAndDelete({ _id: configId, userId });
    },
    async updateConfig(userId, configId, input) {
        // If isDefault, unset other defaults first
        if (input.isDefault) {
            await SMTPConfig_1.SMTPConfig.updateMany({ userId, _id: { $ne: configId } }, { isDefault: false });
        }
        const updateData = { ...input };
        if (input.password) {
            updateData.encryptedPass = (0, crypto_1.encrypt)(input.password);
            delete updateData.password;
        }
        return SMTPConfig_1.SMTPConfig.findOneAndUpdate({ _id: configId, userId }, { $set: updateData }, { new: true, select: { encryptedPass: 0 } });
    },
};
//# sourceMappingURL=smtpService.js.map