"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
const templateService_1 = require("./services/templateService");
dotenv.config();
async function verify() {
    await mongoose_1.default.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    const userId = '65f0a0e0e0e0e0e0e0e0e0e0'; // Mock/Test user
    // Test Protection
    try {
        const list = await templateService_1.templateService.list(userId);
        const defaultT = list.find(t => t.isDefault);
        if (defaultT) {
            console.log('Attempting to delete default template:', defaultT.name);
            await templateService_1.templateService.delete(userId, defaultT._id.toString());
            console.log('FAIL: Deleted default template!');
        }
        else {
            console.log('No default template found to test deletion');
        }
    }
    catch (err) {
        console.log('PASS: Deletion prevented with error:', err.message);
    }
    // Test Create (Custom)
    const newT = await templateService_1.templateService.create(userId, {
        name: 'Custom Test',
        subject: 'Test Subject',
        html: '<h1>Test</h1>'
    });
    console.log('New Custom Template ID:', newT.templateId, '| isDefault:', newT.isDefault);
    // Test Delete (Custom)
    try {
        await templateService_1.templateService.delete(userId, newT._id.toString());
        console.log('PASS: Custom template deleted successfully');
    }
    catch (err) {
        console.log('FAIL: Could not delete custom template:', err.message);
    }
    await mongoose_1.default.disconnect();
}
verify().catch(console.error);
//# sourceMappingURL=verify_ids.js.map