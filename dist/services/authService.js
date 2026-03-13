"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../config/env");
const User_1 = require("../models/User");
exports.authService = {
    // Generate a signed magic link token (short-lived)
    generateMagicToken(email) {
        return jsonwebtoken_1.default.sign({ email }, env_1.env.jwtSecret, { expiresIn: '15m' });
    },
    // Generate a long-lived session JWT
    generateSessionJWT(userId, email) {
        return jsonwebtoken_1.default.sign({ id: userId, email }, env_1.env.jwtSecret, { expiresIn: '7d' });
    },
    // Verify magic link token
    verifyMagicToken(token) {
        return jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
    },
    // Find or create user by email
    async findOrCreateUser(email) {
        let user = await User_1.User.findOne({ email });
        if (!user) {
            const publicKey = `mf_pub_${crypto_1.default.randomBytes(16).toString('hex')}`;
            const privateKey = `mf_priv_${crypto_1.default.randomBytes(32).toString('hex')}`;
            user = await User_1.User.create({ email, publicKey, privateKey });
        }
        else if (!user.publicKey || !user.privateKey) {
            // Backfill keys for existing users
            user.publicKey = `mf_pub_${crypto_1.default.randomBytes(16).toString('hex')}`;
            user.privateKey = `mf_priv_${crypto_1.default.randomBytes(32).toString('hex')}`;
            await user.save();
        }
        return user;
    },
    // Send magic link via system SMTP
    async sendMagicLink(email, token) {
        const magicUrl = `${env_1.env.appUrl}/auth/verify?token=${token}`;
        const transporter = nodemailer_1.default.createTransport({
            host: env_1.env.systemSmtp.host,
            port: env_1.env.systemSmtp.port,
            secure: env_1.env.systemSmtp.port === 465,
            auth: { user: env_1.env.systemSmtp.user, pass: env_1.env.systemSmtp.pass },
        });
        await transporter.sendMail({
            from: env_1.env.systemSmtp.from,
            to: email,
            subject: 'Secure Sign-In to MailFlow',
            html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f4f4f4;border-radius:8px;">
          <div style="background:#1a1a24;padding:20px;border-radius:8px;color:#e0e0e0;text-align:center;">
            <h1 style="font-size:28px;margin-bottom:10px;color:#fff;">Secure Sign-In to MailFlow</h1>
            <p style="color:#a0a0b0;margin-bottom:30px;">Hello,<br><br>You've requested to sign in to your MailFlow account. Click the button below to securely access your account. This link will expire in 15 minutes.</p>
            <a href="${magicUrl}" style="display:inline-block;background:#6c63ff;color:#fff;text-decoration:none;padding:15px 30px;border-radius:8px;font-weight:600;font-size:16px;">Sign In Securely</a>
            <p style="margin-top:30px;font-size:12px;color:#666;">If you didn't request this sign-in, please ignore this email.<br><br>This is an automated message. Please do not reply.<br><br>Best regards,<br>The MailFlow Team</p>
          </div>
        </div>
      `,
        });
        // In dev, log the token to console as a fallback
        if (env_1.env.nodeEnv === 'development') {
            console.log(`\n🔗 Magic Link: ${magicUrl}\n`);
        }
    },
};
//# sourceMappingURL=authService.js.map