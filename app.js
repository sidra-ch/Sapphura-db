require('dotenv').config();
const path = require('path');
const fs = require('fs');

// Standard standalone entry for Phusion Passenger (cPanel)
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || 3000;
process.env.HOSTNAME = process.env.HOSTNAME || '127.0.0.1';

console.log(`> Starting Sapphura Standalone Server...`);
console.log(`> Environment: ${process.env.NODE_ENV}`);
console.log(`> Port: ${process.env.PORT}`);

// Emergency logging for cPanel debugging
const logFile = path.join(__dirname, 'startup_error.log');
function logError(err) {
    const message = `[${new Date().toISOString()}] FATAL STARTUP ERROR: ${err.message || err}\n${err.stack || ''}\n`;
    try {
        fs.appendFileSync(logFile, message);
    } catch (e) {
        console.error('Failed to write to log file:', e);
    }
    console.error(message);
}

// Try to find server.js in common standalone locations
const pathsToTry = [
    path.join(__dirname, 'server.js'), // If extracted directly to root
    path.join(__dirname, '.next', 'standalone', 'server.js'), // If copied as a folder
];

let standalonePath = null;
for (const p of pathsToTry) {
    if (fs.existsSync(p)) {
        standalonePath = p;
        break;
    }
}

try {
    if (standalonePath) {
        console.log(`> Found standalone server at: ${standalonePath}`);
        require(standalonePath);
    } else {
        console.warn('WARNING: Standalone server.js not found. Falling back to Next server...');
        const next = require('next');
        const http = require('http');
        const app = next({ dev: false, hostname: process.env.HOSTNAME, port: Number(process.env.PORT) });
        const handle = app.getRequestHandler();
        
        app.prepare().then(() => {
            http.createServer((req, res) => handle(req, res)).listen(process.env.PORT, () => {
                console.log(`> Fallback server ready on http://${process.env.HOSTNAME}:${process.env.PORT}`);
            });
        }).catch(logError);
    }
} catch (err) {
    logError(err);
    // On cPanel, we want to keep the process alive long enough for Passenger to see the error? 
    // Actually, exiting is better so Passenger shows the 503/error page.
    setTimeout(() => process.exit(1), 1000); 
}