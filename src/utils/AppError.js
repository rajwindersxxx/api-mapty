class AppError extends Error {
    constructor(msg, statusCode = 500, domain = undefined) {
        super(msg);
        this.statusCode = statusCode;
        this.success = false;
        this.domain = domain;
        this.isOperational = true;

        // Capture stack trace if available
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default AppError;
