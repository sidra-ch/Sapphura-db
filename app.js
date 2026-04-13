require('dotenv').config();
const path = require('path');
const fs = require('fs');
const http = require('http');

process.env.NODE_ENV = 'production';
process.env.HOSTNAME = '0.0.0.0';

// Handle cPanel / Phusion Passenger port (which can be a Unix socket path)
const PORT = process.env.PORT || 3000;
const isUnixSocket = isNaN(PORT) && typeof PORT === 'string';

// Prevent ALL worker/child process spawning to save NPROC on cPanel
process.env.NEXT_PRIVATE_WORKER_THREADS = '0';
process.env.__NEXT_DISABLE_MEMORY_WATCHER = '1';

const logFile = path.join(__dirname, 'startup_error.log');
function log(msg) {
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    try { fs.appendFileSync(logFile, line); } catch (e) {}
    console.log(msg);
}
function logError(err) {
    const line = `[${new Date().toISOString()}] ERROR: ${err.message || err}\n${err.stack || ''}\n`;
    try { fs.appendFileSync(logFile, line); } catch (e) {}
    console.error(line);
}

// Clear old log
try { fs.writeFileSync(logFile, ''); } catch (e) {}
log(`> Starting Sapphura (single-process mode)...`);
log(`> Node ${process.version}, Port ${process.env.PORT}`);

// Try to find server.js and parse standalone config
let nextConfig = {};
let standaloneDir = __dirname;

const possibleServerPaths = [
    path.join(__dirname, 'server.js'),
    path.join(__dirname, '.next', 'standalone', 'server.js')
];

let serverFileFound = false;
for (const sPath of possibleServerPaths) {
    if (fs.existsSync(sPath)) {
        try {
            const sjs = fs.readFileSync(sPath, 'utf8');
            // Next.js standalone server.js contains the config in a JSON.stringify call
            const match = sjs.match(/JSON\.stringify\(({"env":\{[\s\S]*?})\)\s*\n/);
            if (match) {
                nextConfig = JSON.parse(match[1]);
                standaloneDir = path.dirname(sPath);
                log(`> Parsed standalone config from ${path.basename(sPath)}`);
                serverFileFound = true;
                break;
            }
        } catch (e) {
            log(`> Config parse warning for ${sPath}: ${e.message}`);
        }
    }
}

if (!serverFileFound) {
    log('> WARNING: server.js not found or config not parsed. Using default config.');
}

try {
    // Use NextServer directly - NO worker forking, NO startServer
    const NextServer = require('next/dist/server/next-server').default;

    const srv = new NextServer({
        dir: standaloneDir,
        dev: false,
        conf: nextConfig,
        hostname: process.env.HOSTNAME,
        port: isUnixSocket ? 0 : Number(PORT),
        customServer: true,
    });

    const handler = srv.getRequestHandler();

    const server = http.createServer(async (req, res) => {
        try {
            await handler(req, res);
        } catch (err) {
            logError(err);
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
        }
    });

    server.listen(PORT, () => {
        log(`> Sapphura ready on ${isUnixSocket ? 'Unix Socket' : 'http://' + process.env.HOSTNAME + ':' + PORT}`);
    });

    server.on('error', (err) => {
        logError(err);
        process.exit(1);
    });

} catch (err) {
    logError(err);
    process.exit(1);
}