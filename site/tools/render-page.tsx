"use client";
// DEV TOOL — renders the 3D variants for poster/fallback images. Removed from production build.
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const ToothScene = dynamic(() => import("@/components/three/ToothScene"), { ssr: false });

export default function RenderPage() {
  const [variant, setVariant] = useState<any>(null);
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setVariant(p.get("v") || "implant");
    document.body.style.background = p.get("bg") || "transparent";
  }, []);
  if (!variant) return null;
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ToothScene variant={variant} animate={false} interactive={false} preserve camZ={Number(new URLSearchParams(location.search).get("z") || 10)}
        onReady={(gl) => { (window as any).__gl = gl; }} />
    </div>
  );
}
