import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, "../uploads");

/**
 * Deletes a specific file after processing
 */
export async function deleteUploadedFile(filePath) {
  try {
    await fs.unlink(filePath);
    console.log(`🧹 Deleted temporary upload: ${filePath}`);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(`⚠️ Failed to delete file ${filePath}:`, err.message);
    }
  }
}

/**
 * Removes temporary files older than specified hours
 */
export async function cleanStaleUploads(olderThanHours = 24) {
  try {
    const files = await fs.readdir(UPLOADS_DIR);
    const now = Date.now();
    const maxAgeMs = olderThanHours * 60 * 60 * 1000;

    for (const file of files) {
      if (file === ".gitkeep" || file === ".gitignore") continue;

      const filePath = path.join(UPLOADS_DIR, file);
      const stats = await fs.stat(filePath);

      if (now - stats.mtimeMs > maxAgeMs) {
        await fs.unlink(filePath);
        console.log(`🧹 Cleaned up stale upload: ${file}`);
      }
    }
  } catch (err) {
    console.error("❌ Error cleaning stale uploads:", err.message);
  }
}
