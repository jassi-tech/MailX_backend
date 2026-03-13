"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const crypto_1 = __importDefault(require("crypto"));
const User_1 = require("../models/User");
const authService_1 = require("../services/authService");
const response_1 = require("../utils/response");
exports.authController = {
    async requestMagicLink(req, res) {
        const { email } = req.body;
        if (!email) {
            (0, response_1.error)(res, 'Email is required', 400);
            return;
        }
        try {
            const token = authService_1.authService.generateMagicToken(email.toLowerCase().trim());
            await authService_1.authService.sendMagicLink(email.toLowerCase().trim(), token);
            (0, response_1.success)(res, {}, 'Magic link sent! Check your inbox.');
        }
        catch (err) {
            console.error(err);
            (0, response_1.error)(res, 'Failed to send magic link', 500);
        }
    },
    async verifyMagicLink(req, res) {
        const { token } = req.query;
        if (!token || typeof token !== 'string') {
            (0, response_1.error)(res, 'Token required', 400);
            return;
        }
        try {
            const { email } = authService_1.authService.verifyMagicToken(token);
            const user = await authService_1.authService.findOrCreateUser(email);
            const sessionToken = authService_1.authService.generateSessionJWT(user._id.toString(), email);
            (0, response_1.success)(res, { token: sessionToken, user: { id: user._id, email: user.email, name: user.name } }, 'Authenticated');
        }
        catch {
            (0, response_1.error)(res, 'Invalid or expired token', 401);
        }
    },
    async getMe(req, res) {
        const user = await User_1.User.findById(req.user.id);
        if (!user) {
            (0, response_1.error)(res, 'User not found', 404);
            return;
        }
        // Return full user to frontend including keys
        (0, response_1.success)(res, {
            id: user._id,
            email: user.email,
            name: user.name,
            publicKey: user.publicKey,
            privateKey: user.privateKey,
            createdAt: user.createdAt,
        });
    },
    async refreshKeys(req, res) {
        const user = await User_1.User.findById(req.user.id);
        if (!user) {
            (0, response_1.error)(res, 'User not found', 404);
            return;
        }
        user.publicKey = `mf_pub_${crypto_1.default.randomBytes(16).toString('hex')}`;
        user.privateKey = `mf_priv_${crypto_1.default.randomBytes(32).toString('hex')}`;
        await user.save();
        (0, response_1.success)(res, {
            publicKey: user.publicKey,
            privateKey: user.privateKey,
        }, 'Keys refreshed successfully');
    },
    async deleteAccount(req, res) {
        const user = await User_1.User.findById(req.user.id);
        if (!user) {
            (0, response_1.error)(res, 'User not found', 404);
            return;
        }
        // In a prod app, we'd delete referencing EmailLogs, SMTPConfigs, etc.
        await User_1.User.findByIdAndDelete(user._id);
        (0, response_1.success)(res, {}, 'Account deleted successfully');
    },
    async googleCallback(req, res) {
        const user = req.user;
        if (!user) {
            (0, response_1.error)(res, 'Google authentication failed', 401);
            return;
        }
        try {
            const email = user.emails?.[0]?.value || '';
            const sessionToken = authService_1.authService.generateSessionJWT(user.id, email);
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
        }
        catch (err) {
            console.error('Google callback error:', err);
            res.status(500).send('Authentication failed');
        }
    },
};
//# sourceMappingURL=auth.controller.js.map