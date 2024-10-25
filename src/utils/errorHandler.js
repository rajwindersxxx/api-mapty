import fs from 'fs';
import path from 'path';

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    const status = err.statusCode || 500;
    const msg = err.message || 'Server error';

    const ErrorObj = {
        success: err.success,
        statusCode: status,
        isOperational: err.isOperational || false,
        request: req.method + " " + req.originalUrl,
        domain: err.domain || undefined,
        message: '🔥Error🔥: ' + msg,
        date: new Date().toGMTString(),
        stack: err.stack,
    };

    // Define the log file path
    const date = new Date();
    const dirname = path.join('log', date.toLocaleDateString().split('/').join('_'));
    const filename = path.join(dirname, date.getUTCHours() + '.log');
    const data = JSON.stringify(ErrorObj, null, 2) + '\r\n\n';

    // Append the error log
    const appendLogger = async () => {
        try {
            await fs.promises.appendFile(filename, data);
        } catch (err) {
            console.log('Error: writing logger', err);
        }
    };

    // Check if directory exists and create if not
    const checkAndCreateDir = async () => {
        try {
            await fs.promises.access(dirname);
            await appendLogger();
        } catch {
            try {
                await fs.promises.mkdir(dirname, { recursive: true });
                await appendLogger();
            } catch (err) {
                console.log('Error creating directory', err);
            }
        }
    };

    checkAndCreateDir();

    // Adjust error response based on environment
    if (process.env.NODE_ENV !== 'development') {
        delete ErrorObj.domain;
        delete ErrorObj.request;
        delete ErrorObj.isOperational;
        delete ErrorObj.stack;
        delete ErrorObj.date;
    }

    res.status(status).json(ErrorObj);
};

export default errorHandler;
