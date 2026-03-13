"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const User_1 = require("../models/User");
const response_1 = require("../utils/response");
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            (0, response_1.error)(res, 'Unauthorized – no token', 401);
            return;
        }
        const token = authHeader.split(' ')[1];
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        }
        catch (err) {
            (0, response_1.error)(res, 'Unauthorized – invalid token', 401);
            return;
        }
        const user = await User_1.User.findById(decoded.id);
        if (!user) {
            (0, response_1.error)(res, 'Unauthorized – user not found', 401);
            return;
        }
        req.user = { id: decoded.id, email: decoded.email };
        next();
    }
    catch (err) {
        console.error('🔒 Auth middleware error:', err);
        next(err); // Let errorHandler handle it
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map