import puppeteer from "puppeteer";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 4321;
const RESUME_URL = `http://localhost:${PORT}/resume`;
const OUTPUT_PATH = path.join(__dirname, "..", "public", "resume.pdf");

async function waitForServer(url, maxAttempts = 30, delay = 1000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return true;
    } catch {
      // Server not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  return false;
}

async function startDevServer() {
  console.log("🚀 Starting development server...");
  const serverProcess = spawn("pnpm", ["dev"], {
    cwd: path.join(__dirname, ".."),
    stdio: ["ignore", "pipe", "pipe"],
    shell: true,
  });

  serverProcess.stdout.on("data", (data) => {
    if (process.env.DEBUG) {
      console.log(`Server: ${data}`);
    }
  });

  serverProcess.stderr.on("data", (data) => {
    if (process.env.DEBUG) {
      console.error(`Server error: ${data}`);
    }
  });

  return serverProcess;
}

async function generatePDF() {
  let serverProcess = null;
  let browser = null;

  try {
    // Check if server is already running
    const serverAlreadyRunning = await waitForServer(RESUME_URL, 1, 500);

    if (!serverAlreadyRunning) {
      serverProcess = await startDevServer();
      console.log("⏳ Waiting for server to start...");
      const serverReady = await waitForServer(RESUME_URL);
      if (!serverReady) {
        throw new Error("Server failed to start within the timeout period");
      }
      console.log("✅ Server is ready");
    } else {
      console.log("ℹ️  Using existing server");
    }

    console.log("🌐 Launching browser...");
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    console.log(`📄 Navigating to ${RESUME_URL}...`);
    await page.goto(RESUME_URL, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Wait a bit for fonts to load
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("📝 Generating PDF...");
    await page.pdf({
      path: OUTPUT_PATH,
      format: "A4",
      printBackground: true,
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
    });

    console.log(`✅ Resume generated at ${OUTPUT_PATH}`);
  } catch (error) {
    console.error("❌ Error generating PDF:", error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
    if (serverProcess) {
      console.log("🛑 Stopping development server...");
      serverProcess.kill("SIGTERM");
    }
  }
}

generatePDF();
