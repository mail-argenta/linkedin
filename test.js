const express = require("express");
const puppeteer = require("puppeteer");
const { default: PQueue } = require("p-queue");
const fs = require("fs-extra");
const path = require("path");

const app = express();
const PORT = 3000;

const COOKIES_DIR = path.join(__dirname, "cookies");
fs.ensureDirSync(COOKIES_DIR);

// You can tweak this depending on your server capacity
const MAX_CONCURRENCY = 100;
const queue = new PQueue({ concurrency: MAX_CONCURRENCY });

// 🧠 Main task — 1 browser per request
async function handleTask(reqData) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  try {
    await page.goto("https://example.com/login", { waitUntil: "domcontentloaded" });

    // 🔓 Fake login flow (replace with actual logic)
    await page.type("#username", reqData.username || "demo");
    await page.type("#password", reqData.password || "password");
    await page.click("#submit");

    await page.waitForNavigation({ waitUntil: "networkidle2" });

    // 🍪 Grab cookies after login
    const cookies = await page.cookies();

    const sessionId = Date.now().toString();
    const cookiePath = path.join(COOKIES_DIR, `cookies-${sessionId}.json`);
    await fs.writeJson(cookiePath, cookies, { spaces: 2 });

    await browser.close();

    return {
      sessionId,
      cookies,
      cookieFile: cookiePath,
    };
  } catch (err) {
    await browser.close();
    throw err;
  }
}

// 🌐 Endpoint
app.get("/login", async (req, res) => {
  queue
    .add(() => handleTask(req.query))
    .then((result) => res.json({ success: true, ...result }))
    .catch((err) => res.status(500).json({ success: false, error: err.message }));
});

// 🧹 Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Graceful shutdown");
  await queue.onIdle();
  process.exit();
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
