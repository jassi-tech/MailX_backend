"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_1 = require("./env");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.env.google.clientId,
    clientSecret: env_1.env.google.clientSecret,
    callbackURL: env_1.env.google.callbackUrl,
}, (accessToken, refreshToken, profile, done) => {
    // Pass the profile through as the user object.
    // Cast to any then to Express.User to satisfy Passport's internal type expectations
    return done(null, profile);
}));
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map