"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
const mongoose_1 = require("mongoose");
const templateSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    templateId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    subject: { type: String, required: true },
    html: { type: String, required: true },
    variables: [{ type: String }],
    isDefault: { type: Boolean, default: false },
}, { timestamps: true });
exports.Template = (0, mongoose_1.model)('Template', templateSchema);
//# sourceMappingURL=Template.js.map