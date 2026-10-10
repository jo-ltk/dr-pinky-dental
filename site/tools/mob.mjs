import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
for (const [w,h] of [[390,844],[360,740]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await c.newPage();
  await p.goto("http://localhost:3200/", { waitUntil: "networkidle" }); await p.waitForTimeout(9000);
  await p.screenshot({ path: `/tmp/claude-0/shots/mob-${w}-hero.png` });
  await p.tap("text=Book Your Appointment"); await p.waitForTimeout(1500);
  await p.screenshot({ path: `/tmp/claude-0/shots/mob-${w}-drawer.png` });
  await p.tap("text=Send request on WhatsApp"); await p.waitForTimeout(1200);
  await p.screenshot({ path: `/tmp/claude-0/shots/mob-${w}-err.png` });
  console.log(w, "overflowX", await p.evaluate(() => document.documentElement.scrollWidth - innerWidth));
  // small tap targets
  if (w===390) { await p.keyboard.press("Escape"); await p.waitForTimeout(1200);
    const small = await p.$$eval("a,button,select,input,summary", els => els.filter(e => { const r = e.getBoundingClientRect(); return r.width>0 && r.height>0 && (r.height < 40) && getComputedStyle(e).visibility!=="hidden"; }).map(e => (e.textContent||e.getAttribute("aria-label")||e.tagName).trim().slice(0,30) + " h=" + Math.round(e.getBoundingClientRect().height)));
    console.log("small targets:", small); }
  await c.close();
}
await b.close();
