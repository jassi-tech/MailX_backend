"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
async function testConnection(input) {
    console.log('Testing connection with:', JSON.stringify(input, null, 2));
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: input.host,
            port: input.port,
            secure: input.secure,
            auth: { user: input.user, pass: input.password },
        });
        await transporter.verify();
        console.log('✅ Connection successful');
    }
    catch (err) {
        console.error('❌ Connection failed:', err.message);
    }
}
// Case 1: What the user seemingly entered
testConnection({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    user: 'bhurejasleen@gmail.com',
    password: 'somepassword'
});
// Case 2: What if host is empty and user is passed as host?
testConnection({
    host: 'bhurejasleen@gmail.com',
    port: 587,
    secure: false,
    user: 'bhurejasleen@gmail.com',
    password: 'somepassword'
});
//# sourceMappingURL=repro.js.map