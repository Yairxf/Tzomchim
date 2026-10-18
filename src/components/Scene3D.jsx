import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const BAR_COLORS = ['#FFD3C4', '#FFB49E', '#FF9277', '#FF6B4A', '#E8653F', '#7BC4A2', '#2E8B5E', '#1C6B45', '#0F5132'];

function coinTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(100, 90, 20, 128, 128, 128);
  grad.addColorStop(0, '#FDE68A'); grad.addColorStop(1, '#E2A00E');
  g.fillStyle = grad; g.fillRect(0, 0, 256, 256);
  g.strokeStyle = '#B7780A'; g.lineWidth = 14; g.beginPath(); g.arc(128, 128, 104, 0, Math.PI * 2); g.stroke();
  g.fillStyle = '#9A5F05'; g.font = 'bold 140px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('₪', 128, 136);
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 4;
  return t;
}

/** Fallback drawing for browsers without WebGL. */
function StaticGarden() {
  const hs = [18, 26, 36, 50, 68, 90, 118, 150, 190];
  return (
    <svg viewBox="0 0 420 300" className="w-full h-full" role="img" aria-label="עמודות צומחות עם נבט – המחשה לצמיחת השקעה לאורך זמן">
      <ellipse cx="210" cy="262" rx="190" ry="26" fill="#D8F3E6" />
      {hs.map((h, i) => (
        <rect key={i} x={40 + i * 38} y={250 - h} width="26" height={h} rx="7" fill={BAR_COLORS[i]} />
      ))}
      <path d="M53 228 C 140 220, 250 170, 357 58" stroke="#0F5132" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M357 60 Q357 40 368 26" stroke="#2E8B5E" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M366 28 q14 -14 28 0 q-14 14 -28 0z" fill="#2E8B5E" />
      <path d="M360 40 q-12 -12 -24 0 q12 12 24 0z" fill="#7BC4A2" />
    </svg>
  );
}

export default function Scene3D({ className = '' }) {
  const mount = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    if (!THREE || !THREE.WebGLRenderer) { setFailed(true); return; }
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) { setFailed(true); return; }

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('a11y-still');
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-hidden', 'true');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 5.2, 13.5);
    camera.lookAt(0, 2.3, 0);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8f3e6, 1.0));
    const sun = new THREE.DirectionalLight(0xffffff, 0.9);
    sun.position.set(-5, 9, 7);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0xffd3c4, 0.45);
    rim.position.set(6, 3, -4);
    scene.add(rim);

    const world = new THREE.Group();
    scene.add(world);

    // ground disc + grid
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 6.2, 0.18, 64), new THREE.MeshStandardMaterial({ color: 0xd8f3e6, roughness: 0.9 }));
    disc.position.y = -0.09;
    world.add(disc);
    const grid = new THREE.GridHelper(11, 22, 0x7bc4a2, 0xbfe6d1);
    grid.position.y = 0.01;
    grid.material.transparent = true; grid.material.opacity = 0.55;
    world.add(grid);

    // bars along an arc, compound growth heights
    const bars = [];
    const N = BAR_COLORS.length;
    const tops = [];
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const h = 0.45 + (Math.exp(2.35 * t) - 1) / (Math.exp(2.35) - 1) * 5.0;
      const a = (t - 0.5) * 1.55;
      const x = Math.sin(a) * 4.4, z = -Math.cos(a) * 1.6 + 1.2;
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1, 0.62), new THREE.MeshStandardMaterial({ color: BAR_COLORS[i], roughness: 0.45, metalness: 0.05 }));
      m.position.set(x, 0, z);
      m.userData = { h, delay: i * 0.09 };
      m.scale.y = still ? h : 0.001;
      m.position.y = (still ? h : 0.001) / 2;
      world.add(m);
      bars.push(m);
      tops.push(new THREE.Vector3(x, h + 0.25, z));
    }

    // growth line through the tops
    const curve = new THREE.CatmullRomCurve3(tops);
    const lineMat = new THREE.MeshStandardMaterial({ color: 0x0f5132, roughness: 0.3, emissive: 0x0f5132, emissiveIntensity: 0.25 });
    const line = new THREE.Mesh(new THREE.TubeGeometry(curve, 120, 0.055, 10, false), lineMat);
    world.add(line);
    const tip = tops[tops.length - 1];

    // sprout on the tallest bar
    const sprout = new THREE.Group();
    const stemCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.05, 0.45, 0), new THREE.Vector3(0.25, 0.9, 0.05)]);
    sprout.add(new THREE.Mesh(new THREE.TubeGeometry(stemCurve, 24, 0.045, 8, false), new THREE.MeshStandardMaterial({ color: 0x2e8b5e, roughness: 0.5 })));
    const leafGeo = new THREE.SphereGeometry(0.32, 20, 12);
    leafGeo.scale(1, 0.18, 0.55);
    const leaf1 = new THREE.Mesh(leafGeo, new THREE.MeshStandardMaterial({ color: 0x2e8b5e, roughness: 0.5 }));
    leaf1.position.set(0.48, 0.95, 0.05); leaf1.rotation.z = 0.55;
    const leaf2 = new THREE.Mesh(leafGeo, new THREE.MeshStandardMaterial({ color: 0x7bc4a2, roughness: 0.5 }));
    leaf2.position.set(-0.22, 0.62, 0); leaf2.rotation.z = -0.6; leaf2.scale.setScalar(0.8);
    sprout.add(leaf1, leaf2);
    sprout.position.set(tip.x, tip.y - 0.25, tip.z);
    sprout.scale.setScalar(still ? 1 : 0.001);
    world.add(sprout);

    // orbiting shekel coins
    const tex = coinTexture();
    const coinGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.07, 40);
    const edge = new THREE.MeshStandardMaterial({ color: 0xd9940f, roughness: 0.35, metalness: 0.6 });
    const face = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.4, metalness: 0.35 });
    const coins = [];
    for (let i = 0; i < 7; i++) {
      const c = new THREE.Mesh(coinGeo, [edge, face, face]);
      c.userData = { r: 3.2 + (i % 3) * 1.1, y: 1.4 + (i * 0.7) % 3.6, sp: 0.18 + (i % 4) * 0.05, ph: i * 0.9, spin: 0.6 + (i % 3) * 0.4 };
      c.rotation.x = Math.PI / 2;
      world.add(c);
      coins.push(c);
    }

    // rising particles (seeds)
    const P = 90;
    const pos = new Float32Array(P * 3);
    for (let i = 0; i < P; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 11;
      pos[i * 3 + 1] = Math.random() * 7;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x2e8b5e, size: 0.07, transparent: true, opacity: 0.55 }));
    world.add(pts);

    // sizing
    const resize = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      camera.aspect = w / h;
      camera.position.z = w / h < 0.9 ? 17 : 13.5;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // pointer parallax
    let tx = 0, ty = 0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5);
      ty = ((e.clientY - r.top) / r.height - 0.5);
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0.01 });
    io.observe(el);

    const clock = new THREE.Clock();
    let raf = 0;
    const ease = (x) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = clock.getElapsedTime();
      if (!still) {
        bars.forEach((b) => {
          const k = ease((t - 0.2 - b.userData.delay) / 0.9);
          const hh = Math.max(0.001, b.userData.h * k);
          b.scale.y = hh; b.position.y = hh / 2;
        });
        sprout.scale.setScalar(ease((t - 1.4) / 0.7) || 0.001);
        sprout.rotation.z = Math.sin(t * 1.6) * 0.06;
        lineMat.opacity = 1;
        coins.forEach((c) => {
          const u = c.userData, a = u.ph + t * u.sp;
          c.position.set(Math.cos(a) * u.r, u.y + Math.sin(t * 0.9 + u.ph) * 0.25, Math.sin(a) * u.r * 0.55);
          c.rotation.z = t * u.spin;
        });
        const arr = pGeo.attributes.position.array;
        for (let i = 0; i < P; i++) {
          arr[i * 3 + 1] += 0.006 + (i % 5) * 0.001;
          if (arr[i * 3 + 1] > 7) arr[i * 3 + 1] = 0;
        }
        pGeo.attributes.position.needsUpdate = true;
        world.rotation.y += ((tx * 0.35) - world.rotation.y) * 0.04 + 0.0;
        world.rotation.x += ((ty * 0.08) - world.rotation.x) * 0.04;
      } else {
        coins.forEach((c) => {
          const u = c.userData;
          c.position.set(Math.cos(u.ph) * u.r, u.y, Math.sin(u.ph) * u.r * 0.55);
        });
      }
      renderer.render(scene, camera);
      if (still) cancelAnimationFrame(raf);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      window.removeEventListener('pointermove', onMove);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
      });
      tex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mount} className={`relative ${className}`}>
      {failed && <StaticGarden />}
    </div>
  );
}
