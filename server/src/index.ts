/**
 * Server Entry Point
 *
 * 1. Import dotenv.config()
 * 2. Import connectDB từ config/database
 * 3. Import app từ app.ts
 * 4. Kết nối MongoDB → app.listen(PORT)
 * 5. Bắt unhandled errors
 */
import { setServers } from "node:dns/promises";

setServers(["1.1.1.1", "8.8.8.8"]);
import { env } from './config/env';
import { connectDB } from './config/database';
import app from './app';
// them moi
import { setServers } from 'node:dns/promises';

// them moi
setServers(['1.1.1.1', '8.8.8.8']);
const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`http://localhost:${env.PORT}`);
    });
  } catch (errors) {
    console.log('Failed to start: ', errors);
    process.exit(1);
  }
};

startServer();
