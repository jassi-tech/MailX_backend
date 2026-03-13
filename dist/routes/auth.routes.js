"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const rateLimiter_1 = require("../middleware/rateLimiter");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.post('/magic-link', rateLimiter_1.authRateLimiter, auth_controller_1.authController.requestMagicLink);
router.get('/verify', auth_controller_1.authController.verifyMagicLink);
router.get('/me', auth_1.authMiddleware, auth_controller_1.authController.getMe);
router.delete('/me', auth_1.authMiddleware, auth_controller_1.authController.deleteAccount);
router.post('/keys/refresh', auth_1.authMiddleware, auth_controller_1.authController.refreshKeys);
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { session: false }), auth_controller_1.authController.googleCallback);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map