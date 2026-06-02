import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { CARDS, drawCardBack, drawCardFront } from '../data/cards';

const CARD_W = 2.4;
const CARD_H = 3.6;
const ORBIT_R = 5.5;
const CARD_COUNT = 12;

export default function Scene3D({
  speedMultiplier,
  onCardFacing,
  revealedCard,
  onRevealDone,
  openPalmDuration,
}) {
  const containerRef = useRef(null);
  const cleanupRef = useRef(null);
  const speedRef = useRef(1);
  const cardsRef = useRef([]);
  const orbRef = useRef(null);
  const revealRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => { speedRef.current = speedMultiplier; }, [speedMultiplier]);

  useEffect(() => {
    if (revealedCard !== null && cardsRef.current.length > 0) {
      const idx = revealedCard;
      const cardObj = cardsRef.current[idx];
      if (cardObj && !revealRef.current) {
        revealRef.current = { cardIndex: idx, cardObj, phase: 'freeze', progress: 0 };
      }
    }
  }, [revealedCard]);

  useEffect(() => {
    if (revealedCard === null && revealRef.current) {
      revealRef.current = null;
      refreshCardTextures();
    }
  }, [revealedCard]);

  function createCardTexture(seed) {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    drawCardBack(ctx, canvas.width, canvas.height, seed);
    return new THREE.CanvasTexture(canvas);
  }

  function createFrontTexture(seed) {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    drawCardFront(ctx, canvas.width, canvas.height, seed);
    return new THREE.CanvasTexture(canvas);
  }

  function refreshCardTextures() {
    cardsRef.current.forEach(cardObj => {
      cardObj.material.map = cardObj.userData.backTex;
      cardObj.material.needsUpdate = true;
      cardObj.visible = true;
    });
  }

  // ─── Crystal Orb Shader ───
  const orbVertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const orbFragmentShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uIntensity;

    // Simplex-like noise
    float hash(vec3 p) {
      float h = dot(p, vec3(127.1, 311.7, 74.7));
      return fract(sin(h) * 43758.5453);
    }

    float noise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
            mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
            mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
    }

    float fbm(vec3 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      // Fresnel
      vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
      float fresnel = 1.0 - abs(dot(vNormal, viewDir));
      fresnel = pow(fresnel, 2.5);

      // Nebula pattern
      vec3 p = vPosition * 3.0 + uTime * 0.15;
      float nebula = fbm(p + vec3(0.0, uTime * 0.1, 0.0));
      float nebula2 = fbm(p * 1.5 + vec3(uTime * 0.08, 0.0, 0.0));

      // Colors
      vec3 deepPurple = vec3(0.18, 0.0, 0.31);   // #2E004F
      vec3 indigo = vec3(0.29, 0.0, 0.51);        // #4B0082
      vec3 violet = vec3(0.48, 0.24, 1.0);        // #7A3CFF
      vec3 lavender = vec3(0.72, 0.58, 0.96);     // #B794F4

      vec3 nebulaColor = mix(deepPurple, violet, nebula * 1.2);
      nebulaColor = mix(nebulaColor, lavender, nebula2 * 0.6);

      // Edge glow
      vec3 edgeColor = mix(violet, lavender, fresnel);
      vec3 finalColor = mix(nebulaColor, edgeColor, fresnel * 0.7 + 0.15);

      // Intensity pulse
      float pulse = uIntensity * (1.0 + 0.15 * sin(uTime * 2.0));
      finalColor *= 0.6 + pulse * 0.4;

      // Alpha — semi-transparent crystal
      float alpha = 0.55 + fresnel * 0.45;
      alpha *= 0.7 + pulse * 0.3;

      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  // ─── Init Scene ───
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050010');
    scene.fog = new THREE.FogExp2('#050010', 0.00025);

    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.3, 30);
    camera.position.set(0, 2.0, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ─── Lighting ───
    const ambient = new THREE.AmbientLight('#3a1a5e', 1.8);
    scene.add(ambient);
    const point1 = new THREE.PointLight('#c9a0ff', 15, 10);
    point1.position.set(0, 3, 3);
    scene.add(point1);
    const point2 = new THREE.PointLight('#7b4fbf', 8, 8);
    point2.position.set(3, 0, -2);
    scene.add(point2);

    // ─── Starfield ───
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 30;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 16;
      const c = new THREE.Color().setHSL(0.75 + Math.random() * 0.15, 0.6, 0.5 + Math.random() * 0.5);
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.025, vertexColors: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ─── Crystal Orb ───
    const orbGeo = new THREE.SphereGeometry(0.55, 64, 64);
    const orbMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uIntensity: { value: 0.5 } },
      vertexShader: orbVertexShader,
      fragmentShader: orbFragmentShader,
      transparent: true,
      depthWrite: false,
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.y = 0.1;
    scene.add(orb);
    orbRef.current = orb;

    // Orb outer glow (additive sphere)
    const orbGlowGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const orbGlowMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uIntensity: { value: 0.5 } },
      vertexShader: `varying vec3 vNormal; varying vec3 vPosition; void main() { vNormal = normalize(normalMatrix * normal); vPosition = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `varying vec3 vNormal; varying vec3 vPosition; uniform float uTime; uniform float uIntensity;
        void main() {
          vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
          float f = 1.0 - abs(dot(vNormal, viewDir));
          f = pow(f, 3.5);
          float pulse = uIntensity * (1.0 + 0.2 * sin(uTime * 2.5));
          gl_FragColor = vec4(0.48, 0.24, 1.0, f * 0.35 * pulse);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const orbGlow = new THREE.Mesh(orbGlowGeo, orbGlowMat);
    orbGlow.position.copy(orb.position);
    scene.add(orbGlow);

    // ─── Orb floating particles ───
    const orbParticlesGroup = new THREE.Group();
    const orbPartCount = 80;
    const orbPartGeo = new THREE.BufferGeometry();
    const orbPartPositions = new Float32Array(orbPartCount * 3);
    const orbPartData = [];
    for (let i = 0; i < orbPartCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 0.6 + Math.random() * 0.5;
      orbPartPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      orbPartPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) + 0.1;
      orbPartPositions[i * 3 + 2] = r * Math.cos(phi);
      orbPartData.push({ baseR: r, theta, phi, speed: 0.3 + Math.random() * 0.7 });
    }
    orbPartGeo.setAttribute('position', new THREE.BufferAttribute(orbPartPositions, 3));
    const orbPartMat = new THREE.PointsMaterial({ color: '#c9a0ff', size: 0.025, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false });
    const orbParticles = new THREE.Points(orbPartGeo, orbPartMat);
    orbParticles.position.copy(orb.position);
    scene.add(orbParticles);
    particlesRef.current = orbPartData;

    // ─── Ground glow ───
    const groundGeo = new THREE.PlaneGeometry(14, 14);
    const groundMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uIntensity: { value: 0.5 } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `varying vec2 vUv; uniform float uTime; uniform float uIntensity;
        void main() {
          float d = length(vUv - 0.5) * 2.0;
          float a = smoothstep(1.0, 0.15, d) * 0.12 * uIntensity;
          a *= 0.7 + 0.3 * sin(uTime * 0.8);
          gl_FragColor = vec4(0.35, 0.12, 0.65, a);
        }`,
      transparent: true,
      depthWrite: false,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3.2;
    scene.add(ground);

    // ─── Light pillar ───
    const pillarGeo = new THREE.CylinderGeometry(0.04, 0.04, 5, 16, 1, true);
    const pillarMat = new THREE.MeshBasicMaterial({ color: '#c9a0ff', transparent: true, opacity: 0.1, depthWrite: false });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.y = 2.5;
    scene.add(pillar);

    // ─── 12 Orbiting Cards ───
    const cardGeo = new THREE.PlaneGeometry(CARD_W, CARD_H);
    const cards = [];

    for (let i = 0; i < CARD_COUNT; i++) {
      const baseAngle = (i / CARD_COUNT) * Math.PI * 2;
      const yOffset = (i / CARD_COUNT) * 3.5 - 1.75;

      const texture = createCardTexture(i);
      const frontTex = createFrontTexture(i);
      // MeshBasicMaterial — 纹理不受场景灯光影响，画什么显示什么
      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });

      const card = new THREE.Mesh(cardGeo, mat);
      card.position.x = Math.cos(baseAngle) * ORBIT_R;
      card.position.y = yOffset;
      card.position.z = Math.sin(baseAngle) * ORBIT_R;
      card.lookAt(0, yOffset, 0);
      card.userData = {
        index: i,
        baseAngle,
        baseY: yOffset,
        backTex: texture,
        frontTex: frontTex,
        selfRotSpeed: 0.1 + Math.random() * 0.2,
        floatOffset: Math.random() * Math.PI * 2,
        tiltX: (Math.random() - 0.5) * 0.12,
        tiltZ: (Math.random() - 0.5) * 0.08,
      };
      scene.add(card);
      cards.push(card);
    }
    cardsRef.current = cards;

    // ─── Particle rings (3 rings at different heights) ───
    const rings = [];
    for (let ringIdx = 0; ringIdx < 3; ringIdx++) {
      const ringGeo = new THREE.BufferGeometry();
      const ringCount = 180;
      const ringPos = new Float32Array(ringCount * 3);
      const r = ORBIT_R + 0.4 + ringIdx * 0.3;
      for (let j = 0; j < ringCount; j++) {
        const a = (j / ringCount) * Math.PI * 2;
        ringPos[j * 3] = Math.cos(a) * (r + (Math.random() - 0.5) * 0.3);
        ringPos[j * 3 + 1] = (Math.random() - 0.5) * (4.5 - ringIdx);
        ringPos[j * 3 + 2] = Math.sin(a) * (r + (Math.random() - 0.5) * 0.3);
      }
      ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
      const ringMat = new THREE.PointsMaterial({
        color: new THREE.Color().setHSL(0.7 + ringIdx * 0.06, 0.6, 0.5 + ringIdx * 0.15),
        size: 0.03 + ringIdx * 0.01,
        transparent: true,
        opacity: 0.35 - ringIdx * 0.08,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ring = new THREE.Points(ringGeo, ringMat);
      ring.userData = { rotSpeed: 0.001 + ringIdx * 0.0005, tilt: ringIdx * 0.08 };
      ring.rotation.x = ring.userData.tilt;
      scene.add(ring);
      rings.push(ring);
    }

    const refs = { scene, camera, renderer, stars, orbMat, orbGlowMat, groundMat, rings, pillar, orb, orbGlow, orbParticles };
    cleanupRef.current = refs;

    // ─── Animation Loop ───
    let disposed = false;

    function animate() {
      if (disposed) return;
      requestAnimationFrame(animate);
      const ref = cleanupRef.current;
      if (!ref) return;

      const time = performance.now() * 0.001;
      const speed = speedRef.current;

      // Dynamic rotation speed — faster when open palm held longer
      const baseSpeed = 0.12;
      const rotSpeed = baseSpeed + (speed - 1) * 2.0;
      const orbIntensity = 0.5 + (speed - 1) * 0.4;

      // Update uniforms
      ref.orbMat.uniforms.uTime.value = time;
      ref.orbMat.uniforms.uIntensity.value = orbIntensity;
      ref.orbGlowMat.uniforms.uTime.value = time;
      ref.orbGlowMat.uniforms.uIntensity.value = orbIntensity;
      ref.groundMat.uniforms.uTime.value = time;
      ref.groundMat.uniforms.uIntensity.value = orbIntensity;

      // Stars rotation
      ref.stars.rotation.y += 0.00025 * speed;
      ref.stars.rotation.x += 0.00012 * speed;

      // Crystal orb float
      const orbFloat = Math.sin(time * 1.2) * 0.1;
      ref.orb.position.y = 0.1 + orbFloat;
      ref.orbGlow.position.y = 0.1 + orbFloat;
      ref.orbParticles.position.y = 0.1 + orbFloat;

      // Orb spin
      ref.orb.rotation.y += 0.003 * speed;
      ref.orb.rotation.x += 0.001 * speed;

      // Orb floating particles
      const opData = particlesRef.current;
      if (opData.length > 0) {
        const posArr = ref.orbParticles.geometry.attributes.position.array;
        for (let i = 0; i < opData.length; i++) {
          const pd = opData[i];
          const r = pd.baseR + Math.sin(time * pd.speed * 2) * 0.08;
          posArr[i * 3] = r * Math.sin(pd.phi) * Math.cos(pd.theta + time * 0.3);
          posArr[i * 3 + 1] = r * Math.sin(pd.phi) * Math.sin(pd.theta + time * 0.2);
          posArr[i * 3 + 2] = r * Math.cos(pd.phi);
        }
        ref.orbParticles.geometry.attributes.position.needsUpdate = true;
      }

      // Ground glow pulse
      ref.pillar.material.opacity = 0.08 + orbIntensity * 0.12;

      // Rings
      ref.rings.forEach(r => {
        r.rotation.y += r.userData.rotSpeed * speed;
      });

      // ─── Cards orbit ───
      let facingCardIndex = -1;
      let bestFacingDot = -1;

      for (let i = 0; i < CARD_COUNT; i++) {
        const card = cards[i];
        const { baseAngle, baseY, selfRotSpeed, floatOffset, tiltX, tiltZ } = card.userData;

        // Skip if being revealed
        if (revealRef.current && revealRef.current.cardIndex === i) continue;

        const newAngle = baseAngle + time * rotSpeed;
        card.position.x = Math.cos(newAngle) * ORBIT_R;
        card.position.z = Math.sin(newAngle) * ORBIT_R;
        // Float
        card.position.y = baseY + Math.sin(time * 1.5 + floatOffset) * 0.15;
        card.lookAt(0, baseY, 0);
        // Tilt
        card.rotation.z += tiltX * 0.01;
        card.rotation.x += tiltZ * 0.01;
        // Self rotation (very subtle)
        card.rotation.y += selfRotSpeed * 0.015;

        const dot = card.position.z;
        if (dot > bestFacingDot) {
          bestFacingDot = dot;
          facingCardIndex = i;
        }
      }

      if (facingCardIndex >= 0 && onCardFacing) {
        onCardFacing(facingCardIndex);
      }

      // ─── Card Reveal Animation ───
      const rv = revealRef.current;
      if (rv) {
        if (rv.phase === 'freeze') {
          // Time-slowing freeze effect — card stops, glow builds
          rv.progress += 0.02;
          if (rv.progress >= 1) {
            rv.phase = 'fly';
            rv.progress = 0;
            rv.startPos = rv.cardObj.position.clone();
            rv.startQuat = rv.cardObj.quaternion.clone();
          }
        } else if (rv.phase === 'fly') {
          rv.progress = Math.min(1, rv.progress + 0.025);
          const t = easeOutCubic(rv.progress);
          // Fly toward camera
          const target = new THREE.Vector3(0, 0.3, 3.5);
          rv.cardObj.position.lerpVectors(rv.startPos, target, t);
          // Scale up
          const s = 1 + t * 1.5;
          rv.cardObj.scale.setScalar(s);
          if (rv.progress >= 1) {
            rv.phase = 'flip';
            rv.progress = 0;
          }
        } else if (rv.phase === 'flip') {
          rv.progress = Math.min(1, rv.progress + 0.03);
          const t = easeInOutCubic(rv.progress);
          rv.cardObj.rotation.y = t * Math.PI;
          // Swap texture at halfway
          if (t > 0.5 && rv.cardObj.material.map !== rv.cardObj.userData.frontTex) {
            rv.cardObj.material.map = rv.cardObj.userData.frontTex;
            rv.cardObj.material.needsUpdate = true;
          }
          if (rv.progress >= 1) {
            rv.phase = 'done';
            if (onRevealDone) onRevealDone();
          }
        }
      }

      // Camera breath
      ref.camera.position.x = Math.sin(time * 0.13) * 0.4;
      ref.camera.position.y = 2.0 + Math.cos(time * 0.18) * 0.18;
      ref.camera.lookAt(0, 0.15, 0);

      ref.renderer.render(ref.scene, ref.camera);
    }
    animate();

    function onResize() {
      if (disposed || !cleanupRef.current) return;
      const { camera, renderer } = cleanupRef.current;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (obj.material.uniforms) {
            Object.values(obj.material.uniforms).forEach(u => {
              if (u.value && u.value.isTexture) u.value.dispose();
            });
          }
          if (obj.material.map) obj.material.map.dispose();
          obj.material.dispose();
        }
      });
      cleanupRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="scene-container" />;
}

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
