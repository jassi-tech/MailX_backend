import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { env } from '../config/env';
import { User } from '../models/User';

export const authService = {
  // Generate a signed magic link token (short-lived)
  generateMagicToken(email: string): string {
    return jwt.sign({ email }, env.jwtSecret, { expiresIn: '15m' });
  },

  // Generate a long-lived session JWT
  generateSessionJWT(userId: string, email: string): string {
    return jwt.sign({ id: userId, email }, env.jwtSecret, { expiresIn: '7d' });
  },

  // Verify magic link token
  verifyMagicToken(token: string): { email: string } {
    return jwt.verify(token, env.jwtSecret) as { email: string };
  },

  // Find or create user by email
  async findOrCreateUser(email: string): Promise<InstanceType<typeof User>> {
    let user = await User.findOne({ email });
    if (!user) {
      const publicKey = `mf_pub_${crypto.randomBytes(16).toString('hex')}`;
      const privateKey = `mf_priv_${crypto.randomBytes(32).toString('hex')}`;
      user = await User.create({ email, publicKey, privateKey });
    } else if (!user.publicKey || !user.privateKey) {
      // Backfill keys for existing users
      user.publicKey = `mf_pub_${crypto.randomBytes(16).toString('hex')}`;
      user.privateKey = `mf_priv_${crypto.randomBytes(32).toString('hex')}`;
      await user.save();
    }
    return user;
  },

  // Send magic link via system SMTP
  async sendMagicLink(email: string, token: string): Promise<void> {
    const magicUrl = `${env.appUrl}/auth/verify?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: env.systemSmtp.host,
      port: env.systemSmtp.port,
      secure: env.systemSmtp.port === 465,
      auth: { user: env.systemSmtp.user, pass: env.systemSmtp.pass },
    });

    await transporter.sendMail({
      from: env.systemSmtp.from,
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
    if (env.nodeEnv === 'development') {
      console.log(`\n🔗 Magic Link: ${magicUrl}\n`);
    }
  },
};
