import { chromium } from "playwright";
const [,, url, out, w="900", h="900", wait="6000"] = process.argv;
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"] });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
p.on("console", m => { if (m.type()==="error") console.log("ERR", m.text().slice(0,300)); });
p.on("pageerror", e => console.log("PAGEERR", e.message.slice(0,300)));
await p.goto(url, { waitUntil: "networkidle", timeout: 120000 });
await p.waitForTimeout(+wait);
if (process.env.FULL === "1") { const H = await p.evaluate(() => document.body.scrollHeight); for (let y = 0; y < H; y += 500) { await p.evaluate(v => window.scrollTo(0, v), y); await p.waitForTimeout(900); } await p.waitForTimeout(1500); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(800); }
await p.screenshot({ path: out, fullPage: process.env.FULL === "1" });
await b.close();
