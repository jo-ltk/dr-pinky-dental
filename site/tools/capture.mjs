import { chromium } from "playwright";
import fs from "fs";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"] });
const jobs = [["implant",720,960,"implant"],["tooth",640,760,"tooth"],["crown",640,560,"crown"],["aligner",640,760,"aligner"],["screw",560,860,"screw"]];
for (const [v,w,h,name] of jobs) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1.5 });
  await p.goto(`http://localhost:3100/render?v=${v}&z=${v==="crown"?7.2:10}`, { waitUntil: "networkidle" });
  await p.waitForTimeout(7000);
  const data = await p.evaluate(() => document.querySelector("canvas").toDataURL("image/png"));
  fs.writeFileSync(`public/renders/${name}.png`, Buffer.from(data.split(",")[1], "base64"));
  await p.close();
}
await b.close();
