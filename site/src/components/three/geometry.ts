import * as THREE from "three";

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/**
 * Molar crown built from a smooth lathe-like profile (radius vs height), then
 * squared off in plan and given four cusps with a central fissure on top.
 * Bottom (cervical margin) at y = 0, height ≈ 1.1, max radius ≈ 0.9.
 */
export function crownGeometry(segU = 160, segV = 140) {
  const profile = new THREE.CatmullRomCurve3(
    [
      [0.0, 0.0], [0.38, 0.0], [0.5, 0.04], [0.6, 0.16], [0.74, 0.36], [0.86, 0.6],
      [0.9, 0.78], [0.86, 0.92], [0.7, 1.02], [0.4, 1.06], [0.0, 1.0],
    ].map(([r, y]) => new THREE.Vector3(r, y, 0)),
    false, "centripetal"
  );
  const cusps = [
    [0.4, 0.36], [-0.4, 0.36], [0.4, -0.34], [-0.4, -0.34],
  ];
  const pos: number[] = [];
  const idx: number[] = [];
  const pt = new THREE.Vector3();
  for (let j = 0; j <= segV; j++) {
    profile.getPoint(j / segV, pt);
    const r0 = Math.max(0, pt.x), y0 = pt.y;
    for (let i = 0; i <= segU; i++) {
      const u = (i / segU) * Math.PI * 2;
      const c = Math.cos(u), s = Math.sin(u);
      const n = 3.4;
      const sq = 1 / Math.pow(Math.pow(Math.abs(c), n) + Math.pow(Math.abs(s), n), 1 / n);
      const k = 1 + (sq - 1) * 0.6 * smooth(0.0, 0.5, y0);
      let x = c * r0 * k, z = s * r0 * k * 0.9;
      let y = y0;
      const top = smooth(0.78, 1.0, y0);
      if (top > 0) {
        let h = 0;
        for (const [cx, cz] of cusps) h += 0.17 * Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / 0.07);
        const fis = 0.12 * Math.exp(-(x * x) / 0.01) * Math.exp(-(z * z) / 0.4)
          + 0.08 * Math.exp(-(z * z) / 0.01) * Math.exp(-(x * x) / 0.3);
        y += (h - fis - 0.06) * top;
      }
      pos.push(x, y, z);
    }
  }
  for (let j = 0; j < segV; j++)
    for (let i = 0; i < segU; i++) {
      const a = j * (segU + 1) + i, b = a + segU + 1;
      idx.push(a, a + 1, b, b, a + 1, b + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Threaded implant body (true helical threads), top at y = 0, pointing down. */
export function implantGeometry(length = 2.3, segU = 128, segV = 420) {
  const pitch = 0.16;
  const positions: number[] = [];
  const index: number[] = [];
  const core = (t: number) => {
    // t: 0 (top) → 1 (apex)
    const base = 0.44 - 0.13 * t;
    const apex = Math.sqrt(Math.max(0, 1 - Math.pow(smooth(0.86, 1, t), 2)));
    return base * (t > 0.86 ? 0.25 + 0.75 * apex : 1);
  };
  for (let j = 0; j <= segV; j++) {
    const t = j / segV;
    const y = -t * length;
    for (let i = 0; i <= segU; i++) {
      const u = (i / segU) * Math.PI * 2;
      const phase = (-y / pitch + u / (Math.PI * 2)) % 1;
      const tri = 1 - Math.abs(phase * 2 - 1); // 0..1..0
      const profile = Math.pow(tri, 0.6);
      const depth = 0.09 * smooth(0.04, 0.12, t) * (1 - smooth(0.82, 0.97, t));
      const r = core(t) + depth * profile;
      positions.push(Math.cos(u) * r, y, Math.sin(u) * r);
    }
  }
  for (let j = 0; j < segV; j++) {
    for (let i = 0; i < segU; i++) {
      const a = j * (segU + 1) + i, b = a + segU + 1;
      index.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setIndex(index);
  g.computeVertexNormals();
  return g;
}

/** Abutment / collar profile (lathe). */
export function collarGeometry() {
  const pts = [
    [0.0, 0.0], [0.46, 0.0], [0.48, -0.04], [0.48, -0.16], [0.45, -0.2],
    [0.49, -0.24], [0.49, -0.34], [0.44, -0.38], [0.0, -0.38],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 128);
}

/** A natural root, tapered and gently curved toward the apex. */
export function rootGeometry(length = 1.6, bend = 0.18) {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 48; i++) {
    const t = i / 48;
    const r = 0.36 * Math.pow(1 - t, 0.62) + 0.025;
    pts.push(new THREE.Vector2(r, 0.25 - t * length));
  }
  const g = new THREE.LatheGeometry(pts, 72);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    const t = Math.min(1, Math.max(0, (0.25 - y) / length));
    p.setX(i, p.getX(i) + bend * t * t);
  }
  g.computeVertexNormals();
  return g;
}
