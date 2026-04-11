require('dotenv').config();
const http = require('http');
const next = require('next');

const port = Number(process.env.PORT || 3000);
const hostname = process.env.HOSTNAME || '0.0.0.0';
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    http
      .createServer((req, res) => handle(req, res))
      .listen(port, hostname, () => {
        console.log(`> Sapphura Next.js server ready on http://${hostname}:${port}`);
        console.log(`> Environment: ${process.env.NODE_ENV}`);
      });
  })
  .catch((error) => {
    console.error('FATAL ERROR: Failed to start Next.js application');
    console.error(error);
    
    // Provide diagnostic hints in logs
    if (error.code === 'ECONNREFUSED' || error.message.includes('Can\'t reach database')) {
      console.error('HINT: Check your DATABASE_URL in .env or cPanel variables');
    }
    
    process.exit(1);
  });