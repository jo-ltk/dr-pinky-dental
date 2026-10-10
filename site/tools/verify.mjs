import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on("pageerror", e => errs.push(e.message)); p.on("console", m => m.type()==="error" && errs.push(m.text().slice(0,150)));
await p.goto("http://localhost:3200/", { waitUntil: "networkidle" });
await p.waitForTimeout(3000);
const links = await p.$$eval("a", as => as.map(a => ({ t: a.textContent.trim().slice(0,40), h: a.getAttribute("href") })));
const wa = links.filter(l => l.h?.startsWith("https://wa.me/"));
console.log("total links", links.length, "whatsapp links", wa.length);
for (const l of wa) console.log(" -", l.t.padEnd(40), "|", decodeURIComponent(l.h.split("text=")[1]).slice(0,80));
console.log("non-wa links:", links.filter(l => !l.h?.startsWith("https://wa.me/")).map(l => l.h).join(" "));
// modal flow
await p.evaluate(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return {}; }; });
await p.click("text=Book Your Appointment");
await p.waitForTimeout(800);
await p.click("button[type=submit]");
await p.waitForTimeout(300);
console.log("errors shown:", await p.$$eval("[aria-invalid=true]", e => e.map(x => x.name)));
console.log("focused:", await p.evaluate(() => document.activeElement.name));
const d = new Date(Date.now() + 3*864e5).toISOString().slice(0,10);
await p.click("summary"); await p.waitForTimeout(300);
await p.fill("[name=name]", "Asha Verma");
await p.fill("[name=phone]", "+91 98765 43210");
await p.selectOption("[name=treatment]", "Teeth Whitening");
await p.click("button[aria-label^=Tmrw]");
await p.click("text=4:00 PM");
await p.fill("[name=notes]", "Sensitive teeth & prefer evening?");
await p.click("button[type=submit]");
await p.waitForTimeout(400);
const op = await p.evaluate(() => window.__opened);
console.log("opened url:", op[0]?.slice(0, 60));
console.log(decodeURIComponent(op[0].split("text=")[1]));
await p.keyboard.press("Escape"); await p.waitForTimeout(2000);
console.log("dialog after esc:", await p.$$eval("[role=dialog]", e => e.length));
// service card preselect via modal from team CTA
await p.click("text=Ask About a Consultation"); await p.waitForTimeout(700);
console.log("team preselect:", await p.$eval("[name=treatment]", s => s.value));
await p.keyboard.press("Escape"); await p.waitForTimeout(500);
for (const w of [360, 390, 768, 1024, 1280, 1920]) {
  await p.setViewportSize({ width: w, height: 900 }); await p.waitForTimeout(400);
  console.log("w", w, "overflowX", await p.evaluate(() => document.documentElement.scrollWidth - innerWidth));
}
console.log("errors:", errs.filter(e=>!e.includes("WebGL")));
await b.close();
