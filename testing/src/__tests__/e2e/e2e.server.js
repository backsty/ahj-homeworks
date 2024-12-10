import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../../../webpack.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = new WebpackDevServer({
  // static: './dist',
  static: {
    directory: path.join(__dirname, '../../../dist'),
  },
  port: 9000,
  host: 'localhost',
  open: false,
  hot: true,
  client: {
    overlay: true,
  },
}, webpack(config));

try {
  await server.start();
  console.log('Dev server started on port 9000');
  
  if (process.send) {
    process.send('ok');
  }
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}

// Обработка завершения процесса
process.on('SIGTERM', async () => {
  try {
    console.log('Stopping dev server...');
    await server.stop();
    process.exit(0);
  } catch (err) {
    console.error('Error stopping server:', err);
    process.exit(1);
  }
});