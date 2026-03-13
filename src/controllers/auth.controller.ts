import { Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../models/User';
import { authService } from '../services/authService';
import { success, error } from '../utils/response';
import { AuthRequest } from '../interface';

export const authController = {
  async requestMagicLink(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    if (!email) { error(res, 'Email is required', 400); return; }
    try {
      const token = authService.generateMagicToken(email.toLowerCase().trim());
      await authService.sendMagicLink(email.toLowerCase().trim(), token);
      success(res, {}, 'Magic link sent! Check your inbox.');
    } catch (err) {
      console.error(err);
      error(res, 'Failed to send magic link', 500);
    }
  },

  async verifyMagicLink(req: Request, res: Response): Promise<void> {
    const { token } = req.query;
    if (!token || typeof token !== 'string') { error(res, 'Token required', 400); return; }
    try {
      const { email } = authService.verifyMagicToken(token);
      const user = await authService.findOrCreateUser(email);
      const sessionToken = authService.generateSessionJWT(user._id!.toString(), email);
      success(res, { token: sessionToken, user: { id: user._id, email: user.email, name: user.name } }, 'Authenticated');
    } catch {
      error(res, 'Invalid or expired token', 401);
    }
  },

  async getMe(req: Request, res: Response): Promise<void> {
    const user = await User.findById(req.user!.id);
    if (!user) { error(res, 'User not found', 404); return; }
    // Return full user to frontend including keys
    success(res, {
      id: user._id,
      email: user.email,
      name: user.name,
      publicKey: user.publicKey,
      privateKey: user.privateKey,
      createdAt: user.createdAt,
    });
  },

  async refreshKeys(req: Request, res: Response): Promise<void> {
    const user = await User.findById(req.user!.id);
    if (!user) { error(res, 'User not found', 404); return; }
    
    user.publicKey = `mf_pub_${crypto.randomBytes(16).toString('hex')}`;
    user.privateKey = `mf_priv_${crypto.randomBytes(32).toString('hex')}`;
    await user.save();
    
    success(res, {
      publicKey: user.publicKey,
      privateKey: user.privateKey,
    }, 'Keys refreshed successfully');
  },

  async deleteAccount(req: Request, res: Response): Promise<void> {
    const user = await User.findById(req.user!.id);
    if (!user) { error(res, 'User not found', 404); return; }
    
    // In a prod app, we'd delete referencing EmailLogs, SMTPConfigs, etc.
    await User.findByIdAndDelete(user._id);
    
    success(res, {}, 'Account deleted successfully');
  },

  async googleCallback(req: Request, res: Response): Promise<void> {
    const user = req.user;
    if (!user) {
      error(res, 'Google authentication failed', 401);
      return;
    }

    try {
      const email = user.emails?.[0]?.value || '';
      const sessionToken = authService.generateSessionJWT(user.id, email);
      
      const authData = {
        token: sessionToken,
        user: {
          id: user.id,
          email: email,
          name: user.displayName
        }
      };

      // Professional Popup Flow:
      // Instead of just returning JSON, we send an HTML page that posts a message to the opener
      // and closes itself. This is standard for "Connect with X" popups.
      const htmlResponse = `
        <html>
          <body>
            <script>
              window.opener.postMessage(
                { type: 'GOOGLE_AUTH_SUCCESS', data: ${JSON.stringify(authData)} },
                '*'
              );
              window.close();
            </script>
            <p>Authentication successful. Closing window...</p>
          </body>
        </html>
      `;
      
      res.set('Content-Type', 'text/html');
      res.send(htmlResponse);
    } catch (err) {
      console.error('Google callback error:', err);
      res.status(500).send('Authentication failed');
    }
  },
};
