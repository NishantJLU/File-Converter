const fs = require('fs');
const path = require('path');

const TEMP_DIR = path.join(__dirname, '../../../temp');
const MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Scan the temporary directory and clean up files older than MAX_AGE_MS.
 */
const cleanTempDirectory = () => {
  if (!fs.existsSync(TEMP_DIR)) {
    return;
  }

  fs.readdir(TEMP_DIR, (err, files) => {
    if (err) {
      console.error('Error reading temp directory:', err);
      return;
    }

    const now = Date.now();
    files.forEach((file) => {
      // Skip hidden files/directories (like .gitignore or .gitkeep)
      if (file.startsWith('.')) {
        return;
      }

      const filePath = path.join(TEMP_DIR, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error statting file ${file}:`, err);
          return;
        }

        // Only delete files (skip directories if any exist)
        if (stats.isFile()) {
          const fileAge = now - stats.mtimeMs;
          if (fileAge > MAX_AGE_MS) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Error deleting file ${file}:`, err);
              } else {
                console.log(`🧹 Background Cleanup: Removed old temp file: ${file}`);
              }
            });
          }
        }
      });
    });
  });
};

/**
 * Start the recurring background cleanup interval.
 * @param {number} intervalMs - The check interval in milliseconds (defaults to 1 minute).
 */
const startCleanupScheduler = (intervalMs = 60000) => {
  setInterval(cleanTempDirectory, intervalMs);
  console.log(`🔄 Background cleanup scheduler initialized (checks temp files every ${intervalMs / 1000}s)`);
};

module.exports = {
  startCleanupScheduler,
  cleanTempDirectory
};
