"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateServiceId = generateServiceId;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generates a unique service ID in the format: service_xxxxxxx
 * @param length Length of the random suffix (default 7)
 */
function generateServiceId(length = 7) {
    const random = crypto_1.default.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
    return `service_${random}`;
}
//# sourceMappingURL=ids.js.map