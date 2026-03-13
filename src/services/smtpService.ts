import nodemailer from 'nodemailer';
import { SMTPConfig } from '../models/SMTPConfig';
import { decrypt, encrypt } from '../utils/crypto';
import { Types } from 'mongoose';

import { SMTPInput } from '../interface';

export const smtpService = {
  // Test SMTP connection without saving
  async testConnection(input: Omit<SMTPInput, 'label' | 'fromName' | 'fromEmail' | 'isDefault'>): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: input.host.trim(),
      port: input.port,
      secure: input.secure,
      auth: { user: input.user.trim(), pass: input.password },
    });
    await transporter.verify();
  },

  // Save encrypted SMTP config
  async saveConfig(userId: string, input: SMTPInput) {
    // If isDefault, unset other defaults first
    if (input.isDefault) {
      await SMTPConfig.updateMany({ userId }, { isDefault: false });
    }
    const encryptedPass = encrypt(input.password);
    const config = await SMTPConfig.create({
      userId: new Types.ObjectId(userId),
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
  async getDecryptedPassword(configId: string): Promise<string> {
    const config = await SMTPConfig.findById(configId);
    if (!config) throw new Error('SMTP config not found');
    return decrypt(config.encryptedPass);
  },

  // List all SMTP configs for a user (without exposing encrypted password)
  async listConfigs(userId: string) {
    return SMTPConfig.find({ userId }, { encryptedPass: 0 }).sort({ isDefault: -1, createdAt: -1 });
  },

  async deleteConfig(userId: string, configId: string) {
    return SMTPConfig.findOneAndDelete({ _id: configId, userId });
  },

  async updateConfig(userId: string, configId: string, input: Partial<SMTPInput>) {
    // If isDefault, unset other defaults first
    if (input.isDefault) {
      await SMTPConfig.updateMany({ userId, _id: { $ne: configId } }, { isDefault: false });
    }

    const updateData: any = { ...input };
    if (input.password) {
      updateData.encryptedPass = encrypt(input.password);
      delete updateData.password;
    }

    return SMTPConfig.findOneAndUpdate(
      { _id: configId, userId },
      { $set: updateData },
      { new: true, select: { encryptedPass: 0 } }
    );
  },
};
