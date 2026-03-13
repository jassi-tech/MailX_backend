"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = success;
exports.error = error;
exports.paginated = paginated;
function success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({ success: true, message, data });
}
function error(res, message, statusCode = 500, details) {
    return res.status(statusCode).json({ success: false, message, ...(details ? { details } : {}) });
}
function paginated(res, data, total, page, limit, message = 'Success') {
    return res.status(200).json({
        success: true,
        message,
        data,
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
}
//# sourceMappingURL=response.js.map