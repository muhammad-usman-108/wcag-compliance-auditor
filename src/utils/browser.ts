import puppeteer, { Browser } from "puppeteer";

export async function launchBrowser(): Promise<Browser> {
  return await puppeteer.launch({
    headless: true,
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--no-zygote",
    ],
    timeout: 30000, // 30 seconds timeout
  });
}
