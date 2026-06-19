/* ==========================================================================
   AETHER — Premium Three.js WebGL Architecture
   ==========================================================================
   This standalone ES module orchestrates premium high-fidelity 3D WebGL scenes:
     1. Hero Scene       -> Professional Workstation / 3D Asset via GLTFLoader
     2. Tech Stack Scene -> Mathematical non-overlapping 3D Tech Sphere Matrix
     3. Contact Scene    -> Cinematic Morphing Cyber Mesh Core
   ========================================================================== */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/* ==========================================================================
   GLOBAL UTILITIES & RENDERER FACTORY
   ========================================================================== */

/**
 * Creates an elite WebGLRenderer configured for studio-grade lighting and PBR.
 * @param {HTMLCanvasElement} canvas 
 * @returns {THREE.WebGLRenderer}
 */
function createPremiumRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,              // CRUCIAL: High-end edge smoothing
    alpha: true,                  // Transparent background for seamless website blend
    powerPreference: 'high-performance',
    stencil: false
  });

  // High-fidelity display resolution matching device capability
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  // Advanced Tone Mapping & Industry-standard sRGB Color Space
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // CRUCIAL: Premium Shadow Map Configurations
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  return renderer;
}

/**
 * Automatically adjusts camera projection and DOM canvas bounds on resize.
 * @param {THREE.WebGLRenderer} renderer 
 * @param {THREE.PerspectiveCamera} camera 
 */
function handleSceneResize(renderer, camera) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (canvas.width !== width || canvas.height !== height) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}

/**
 * Injects the exact required cinematic lighting setup into any scene.
 * Rule 1: AmbientLight (0.3, soft blue), DirectionalLight (1.2, white, shadows), PointLight (2.0, neon purple near asset).
 * @param {THREE.Scene} scene 
 */
function setupPremiumLighting(scene, targetPos = new THREE.Vector3(0, 0, 0)) {
  // 1. Soft Cyber Ambient Light
  const ambientLight = new THREE.AmbientLight(0x3b82f6, 0.35); // Soft blue hue
  scene.add(ambientLight);

  // 2. Studio Main Key Directional Light (Casting Soft Shadows from Top-Right)
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.25); // Pure White
  dirLight.position.set(6, 8, 5);
  // Keep casting shadows disabled to avoid additional shader compilation.
  dirLight.castShadow = false;


  // High-res shadow camera parameters for crisp boundaries without artifacting
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 25;
  const d = 5;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.bias = -0.0001;
  scene.add(dirLight);

  // 3. Neon Cyber-Glow PointLight right near central asset
  const neonPointLight = new THREE.PointLight(0x8b5cf6, 2.2, 12); // Neon purple/violet
  neonPointLight.position.set(targetPos.x + 1.2, targetPos.y + 1.5, targetPos.z + 1.2);
  scene.add(neonPointLight);

  // Secondary subtle fill light for beautiful cinematic rim highlights
  const fillLight = new THREE.PointLight(0x06b6d4, 1.0, 15); // Electric cyan
  fillLight.position.set(-5, -2, -3);
  scene.add(fillLight);

  return { dirLight, neonPointLight };
}

/* ==========================================================================
   1. HERO SCENE — Professional Production-Ready GLTFLoader Implementation
   ========================================================================== */
function initHeroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  // Cinematic atmospheric distance fog
  scene.fog = new THREE.FogExp2(0x030712, 0.035);

  const camera = new THREE.PerspectiveCamera(42, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 2.2, 5.8);

  // Renderer init can trigger heavy shader compilation.
  // Keep scene initialization responsive.
  const renderer = createPremiumRenderer(canvas);
  // Disable shadows for reliability/perf (prevents shader compilation stalls on some GPUs/drivers).
  renderer.shadowMap.enabled = false;
  const { neonPointLight } = setupPremiumLighting(scene, new THREE.Vector3(0, 0, 0));


  // Add a premium circular studio shadow catcher floor
  const floorGeo = new THREE.PlaneGeometry(12, 12);
  const floorMat = new THREE.ShadowMaterial({ opacity: 0.4 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.1;
  floor.receiveShadow = true;
  scene.add(floor);

  // Group to host the loaded 3D asset for buttery interactive mouse parallax
  const assetGroup = new THREE.Group();
  scene.add(assetGroup);

  // Subtle floating background particles to enhance cinematic atmosphere
  const partGeo = new THREE.BufferGeometry();
  const partCount = 150;
  const partPos = new Float32Array(partCount * 3);
  for (let i = 0; i < partCount; i++) {
    partPos[i * 3] = (Math.random() - 0.5) * 12;
    partPos[i * 3 + 1] = Math.random() * 6 - 1.5;
    partPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
  const partMat = new THREE.PointsMaterial({ color: 0xa78bfa, size: 0.035, transparent: true, opacity: 0.5 });
  const particles = new THREE.Points(partGeo, partMat);
  scene.add(particles);

  // UI elements for onProgress / onError feedback
  const loaderOverlay = document.getElementById('hero-loader');
  const progressBar = document.getElementById('hero-progress-bar');
  const progressText = document.getElementById('hero-progress-text');

  // Load Model Helper function
  function load3DAsset(url, isFallback = false) {
    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      url,
      // 1. onSuccess callback
      (gltf) => {
        const model = gltf.scene;

        // Center and elegantly scale model based on bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxAxis = Math.max(size.x, size.y, size.z);
        const scale = 2.8 / maxAxis;

        // Put the imported model into a stable wrapper so orbit rotations don't
        // fight any existing transforms coming from the GLTF scene.
        const modelWrapper = new THREE.Group();
        modelWrapper.name = 'setup-model-wrapper';

        // Normalize model transforms.
        model.scale.set(scale, scale, scale);
        model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

        modelWrapper.add(model);
        assetGroup.add(modelWrapper);


        // Ensure shadows but do NOT alter the original material colors/properties.
        model.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });


        // Replace original assetGroup child with wrapped model.
        // (If orbit controls/jumping scale happened before, this guarantees
        // the wrapper remains stable; only orbit/camera moves.)
        assetGroup.add(modelWrapper);


        // Transition out loader overlay beautifully

        if (loaderOverlay) {
          loaderOverlay.classList.add('hidden');
        }
        console.log(`✓ successfully loaded 3D asset from: ${url}`);
      },
      // 2. onProgress callback
      (xhr) => {
        if (xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          if (progressBar) progressBar.style.width = `${percent}%`;
          if (progressText) progressText.textContent = `Loading 3D Setup... ${percent}%`;
        } else {
          if (progressText) progressText.textContent = `Loading 3D Setup... (${Math.round(xhr.loaded / 1024)} KB)`;
        }
      },
      // 3. onError callback
      (error) => {
        console.warn(`⚠ Failed to load 3D model from "${url}":`, error);

        if (!isFallback) {
          console.log('🔄 Initiating seamless fallback to highly reliable premium public CDN asset...');
          if (progressText) progressText.textContent = 'Loading Premium Fallback Asset...';
          // Reliable professional premium model CDN (KhronosGroup Damaged Helmet or similar masterpiece)
          const fallbackUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
          load3DAsset(fallbackUrl, true);
        } else {
          // Ultimate safety placeholder if CDN fails (e.g. offline preview)
          if (loaderOverlay) loaderOverlay.classList.add('hidden');
          console.error('❌ Ultimate fallback failed. Injecting procedural high-fidelity cyber dodecahedron.');

          const fallbackGeo = new THREE.DodecahedronGeometry(1.4, 1);
          const fallbackMat = new THREE.MeshStandardMaterial({
            color: 0x1e1b4b,
            roughness: 0.15,
            metalness: 0.85,
            wireframe: false
          });
          const fallbackMesh = new THREE.Mesh(fallbackGeo, fallbackMat);
          fallbackMesh.castShadow = true;
          fallbackMesh.receiveShadow = true;
          assetGroup.add(fallbackMesh);

          // Add elegant inner floating wireframe core
          const innerGeo = new THREE.IcosahedronGeometry(1.8, 1);
          const innerMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.3 });
          assetGroup.add(new THREE.Mesh(innerGeo, innerMat));
        }
      }
    );
  }

  // Load the provided modern gaming setup model instead of the old cinematic orbit asset.
  // (User added folder: ./modern_gaming_setup)
  load3DAsset('./modern_gaming_setup/setup.gltf', false);



  // Controls for HERO model:
  // - Zoom in/out ONLY via wheel (PC) / pinch (mobile touch)
  // - No zoom via clicking
  // - Left drag rotates (360°)
  // - Right drag pans the camera target (positioning)
  // - After user interaction ends, restore original camera + target after ~2-4 scroll wheel/touch seconds.

  const controls = new OrbitControls(camera, canvas);

  // Zoom only (disable click-based zoom; OrbitControls doesn't zoom on click anyway, but keep explicit).
  controls.enableZoom = true;
  controls.zoomSpeed = 0.7;
  controls.minDistance = 2.5;
  controls.maxDistance = 12;

  // Enable touch pinch zoom.
  controls.enableTouchZoom = true;

  // Disable panning on left; we'll implement right-button drag separately.
  controls.enablePan = false;

  // Rotation settings
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.75;
  controls.minPolarAngle = 0; // allow full 360 around Y without polar clamp
  controls.maxPolarAngle = Math.PI; // allow full vertical range

  // Allow full 360 rotation (no angle limits)
  controls.minAzimuthAngle = -Infinity;
  controls.maxAzimuthAngle = Infinity;

  // Save original camera/target so we can restore later.
  const originalTarget = controls.target.clone();
  const originalCameraPos = camera.position.clone();

  let restoreTimer = null;
  function scheduleRestore() {
    if (restoreTimer) clearTimeout(restoreTimer);
    // 2-4 seconds after the user stops interacting.
    restoreTimer = setTimeout(() => {
      controls.autoRotate = true;
      controls.target.copy(originalTarget);
      camera.position.copy(originalCameraPos);
      controls.update();
    }, 3000);
  }

  // Left-button rotate, right-button reposition (pan-like by moving target).
  let isPointerDown = false;
  let lastX = 0;
  let lastY = 0;

  // Disable default context menu so right-drag works on desktop.
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  canvas.addEventListener('pointerdown', (e) => {
    if (!e.isPrimary) return;
    isPointerDown = true;
    lastX = e.clientX;
    lastY = e.clientY;
    controls.autoRotate = false;

    // Cancel any restore while user is interacting
    if (restoreTimer) clearTimeout(restoreTimer);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    // Button mapping: e.button==0 left, 2 right
    // Left drag: rotate (OrbitControls handles rotation when enableRotate and mouseButtons set).
    // We'll just rotate via controls for left.
    if (e.button === 0) {
      // Use OrbitControls' internal rotation by temporarily setting state.
      // Easiest: manually rotate the camera around target in a stable way.
      const rotSpeed = 0.005;
      const theta = -dx * rotSpeed;
      const phi = -dy * rotSpeed;

      const offset = camera.position.clone().sub(controls.target);
      // rotate around Y for dx
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), theta);
      // rotate around X for dy (clamped by min/max polar)
      const axis = new THREE.Vector3(1, 0, 0).cross(offset).normalize();
      if (axis.lengthSq() > 0) offset.applyAxisAngle(axis, phi);

      camera.position.copy(controls.target).add(offset);
      controls.update();
    }

    // Right drag: reposition by moving target (without zoom)
    if (e.button === 2) {
      const panSpeed = 0.0025;
      const right = new THREE.Vector3().crossVectors(camera.up, camera.getWorldDirection(new THREE.Vector3())).normalize();
      const up = camera.up.clone().normalize();
      controls.target.add(right.multiplyScalar(-dx * panSpeed));
      controls.target.add(up.multiplyScalar(dy * panSpeed));
      controls.update();
    }
  });

  canvas.addEventListener('pointerup', (e) => {
    if (!isPointerDown) return;
    isPointerDown = false;
    scheduleRestore();
  });

  canvas.addEventListener('pointercancel', () => {
    if (!isPointerDown) return;
    isPointerDown = false;
    scheduleRestore();
  });

  // Track cursor for buttery cinematic parallax effect
  const mouseCoords = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
    mouseCoords.x = (e.clientX / window.innerWidth - 0.5) * 0.5;
    mouseCoords.y = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  // Animation Engine Loop
  const clock = new THREE.Clock();
  function animateHero() {
    requestAnimationFrame(animateHero);

    const time = clock.getElapsedTime();
    handleSceneResize(renderer, camera);

    // Apply elegant subtle hover levitation
    assetGroup.position.y = Math.sin(time * 1.8) * 0.08;

    // Smooth cinematic mouse parallax
    camera.position.x += (mouseCoords.x * 1.5 - camera.position.x) * 0.05;
    camera.position.y += (2.2 + mouseCoords.y * 1.0 - camera.position.y) * 0.05;
    camera.lookAt(0, 0.3, 0);

    // Slowly rotate atmospheric background dust
    particles.rotation.y = time * 0.03;

    // Make neon point light orbit gently around the asset for cinematic reflections
    neonPointLight.position.x = Math.cos(time * 1.2) * 2.0;
    neonPointLight.position.z = Math.sin(time * 1.2) * 2.0;

    controls.update(); // CRUCIAL for dampingFactor 0.05
    renderer.render(scene, camera);
  }
  animateHero();
}

/* ==========================================================================
   2. TECH STACK SCENE — Mathematical Non-Overlapping Fixed Floating Spheres
   ========================================================================== */
function initTechStackScene() {
  const canvas = document.getElementById('stack-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 3, 9.5);

  const renderer = createPremiumRenderer(canvas);
  setupPremiumLighting(scene, new THREE.Vector3(0, 0, 0));

  // The 12 professional technologies
  const techData = [
    { name: 'JavaScript', color: '#f7df1e' },
    { name: 'TypeScript', color: '#3178c6' },
    { name: 'Three.js', color: '#8b5cf6' },
    { name: 'WebGL', color: '#06b6d4' },
    { name: 'React', color: '#61dafb' },
    { name: 'Next.js', color: '#ffffff' },
    { name: 'GSAP', color: '#88ce02' },
    { name: 'Tailwind', color: '#38bdf8' },
    { name: 'Node.js', color: '#3c873a' },
    { name: 'Python', color: '#ffd43b' },
    { name: 'Blender', color: '#ea580c' },
    { name: 'Figma', color: '#d946ef' },
  ];

  /**
   * Generates a premium crisp high-resolution CanvasTexture with technology label.
   */
  function createTechTexture(text, accentColor) {
    const width = 512;
    const height = 512;
    const ctxCanvas = document.createElement('canvas');
    ctxCanvas.width = width;
    ctxCanvas.height = height;
    const ctx = ctxCanvas.getContext('2d');

    // Premium dark cyber space background
    const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 250);
    grad.addColorStop(0, '#1e1b4b'); // Deep indigo
    grad.addColorStop(1, '#030712'); // Pure obsidian
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Glowing futuristic border ring
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(256, 256, 226, 0, Math.PI * 2);
    ctx.stroke();

    // Subtle inner glowing ring
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(256, 256, 200, 0, Math.PI * 2);
    ctx.stroke();

    // Crisp Modern Plus Jakarta Sans / JetBrains Typography
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 256);

    const texture = new THREE.CanvasTexture(ctxCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return texture;
  }

  // Container Group for whole universe
  const universeGroup = new THREE.Group();
  scene.add(universeGroup);

  const spheres = [];
  const basePositions = [];

  // Exact Mathematical Offset Matrix to absolutely guarantee NO overlapping
  // We arrange 12 spheres across 2 beautiful 3D concentric elliptical orbits
  const innerCount = 4;
  const outerCount = 8;
  const sphereRadius = 0.65;

  techData.forEach((tech, index) => {
    // Premium THREE.MeshStandardMaterial exactly as requested:
    // 'roughness: 0.2' and 'metalness: 0.8' so they catch studio lights beautifully
    const sphereMat = new THREE.MeshStandardMaterial({
      map: createTechTexture(tech.name, tech.color),
      roughness: 0.2,
      metalness: 0.8,
      emissive: new THREE.Color(tech.color),
      emissiveIntensity: 0.12
    });

    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 64, 64);
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;

    // Mathematical Matrix Calculation
    let x = 0, y = 0, z = 0;
    if (index < innerCount) {
      // Inner Orbit Ring
      const angle = (index / innerCount) * Math.PI * 2;
      const radius = 2.4;
      x = Math.cos(angle) * radius;
      z = Math.sin(angle) * radius;
      y = (index % 2 === 0 ? 0.7 : -0.7);
    } else {
      // Outer Orbit Ring (tilted slightly for gorgeous multi-level depth)
      const subIndex = index - innerCount;
      const angle = (subIndex / outerCount) * Math.PI * 2 + Math.PI / 4;
      const radiusX = 4.4;
      const radiusZ = 3.6;
      x = Math.cos(angle) * radiusX;
      z = Math.sin(angle) * radiusZ;
      y = Math.sin(angle * 2) * 1.5; // Beautiful wavy vertical offset
    }

    const posVector = new THREE.Vector3(x, y, z);
    sphereMesh.position.copy(posVector);
    universeGroup.add(sphereMesh);

    spheres.push(sphereMesh);
    basePositions.push(posVector);
  });

  // Add central premium holographic energy star
  const coreGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    emissive: 0xa855f7,
    emissiveIntensity: 2.5,
    roughness: 0.1,
    metalness: 0.9,
    wireframe: true
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  universeGroup.add(coreMesh);

  // Configure OrbitControls exactly as requested:
  // enableZoom = false, enableDamping = true with dampingFactor: 0.05
  const controls = new OrbitControls(camera, canvas);
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.85;

  const clock = new THREE.Clock();

  function animateTechStack() {
    requestAnimationFrame(animateTechStack);

    const time = clock.getElapsedTime();
    handleSceneResize(renderer, camera);

    // Apply gentle sine-wave bobbing exactly following rule 3: 'Math.sin(time + index)'
    spheres.forEach((sphere, index) => {
      const basePos = basePositions[index];
      // Independent sine wave float
      sphere.position.y = basePos.y + Math.sin(time * 1.5 + index) * 0.28;

      // Beautiful independent planetary self-rotation
      sphere.rotation.y += 0.006;
      sphere.rotation.x += index % 2 === 0 ? 0.003 : -0.003;
    });

    // Make core pulse elegantly
    const coreScale = 1 + Math.sin(time * 3) * 0.12;
    coreMesh.scale.set(coreScale, coreScale, coreScale);
    coreMesh.rotation.y -= 0.01;

    controls.update(); // CRUCIAL for dampingFactor: 0.05
    renderer.render(scene, camera);
  }
  animateTechStack();
}

/* ==========================================================================
   3. CONTACT SCENE — Cinematic Morphing Cyber Mesh Core
   ========================================================================== */
function initContactScene() {
  const canvas = document.getElementById('contact-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 5.5);

  const renderer = createPremiumRenderer(canvas);
  setupPremiumLighting(scene, new THREE.Vector3(0, 0, 0));

  // High-fidelity TorusKnot wireframe mesh for a mesmerizing continuous slow-morph
  const knotGeo = new THREE.TorusKnotGeometry(1.4, 0.45, 128, 32, 2, 3);
  const knotMat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    emissive: 0x3b82f6,
    emissiveIntensity: 0.4,
    roughness: 0.1,
    metalness: 0.9,
    wireframe: true
  });
  const cyberKnot = new THREE.Mesh(knotGeo, knotMat);
  scene.add(cyberKnot);

  // Inner floating smooth energy orb
  const orbGeo = new THREE.SphereGeometry(0.9, 64, 64);
  const orbMat = new THREE.MeshStandardMaterial({
    color: 0xd946ef,
    roughness: 0.1,
    metalness: 0.95,
    transparent: true,
    opacity: 0.25
  });
  const energyOrb = new THREE.Mesh(orbGeo, orbMat);
  scene.add(energyOrb);

  const controls = new OrbitControls(camera, canvas);
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.2;

  const clock = new THREE.Clock();

  function animateContact() {
    requestAnimationFrame(animateContact);

    const time = clock.getElapsedTime();
    handleSceneResize(renderer, camera);

    // Continuous elegant organic morphing
    cyberKnot.rotation.x = time * 0.2;
    cyberKnot.rotation.y = time * 0.3;

    energyOrb.scale.setScalar(1 + Math.sin(time * 2.5) * 0.08);

    // Dynamic cyber chromatic shift
    const hue = (time * 0.05) % 1;
    knotMat.color.setHSL(hue, 0.85, 0.55);
    knotMat.emissive.setHSL((hue + 0.5) % 1, 0.8, 0.2);

    controls.update(); // CRUCIAL for dampingFactor 0.05
    renderer.render(scene, camera);
  }
  animateContact();
}

/* ==========================================================================
   SCENE ORCHESTRATION BOOTSTRAPPER
   ========================================================================== */
export function initializePremium3DScenes() {
  console.log('🚀 Initializing Aether Premium 3D WebGL Web Engine...');
  // HERO scene canvas intentionally removed from DOM.
  // Keep existing WebGL scenes for Tech Stack and Contact.
  try {
    initHeroScene();
  } catch (err) {
    // Fail safely: if #hero-canvas no longer exists, initHeroScene() returns early.
    console.error('❌ Error initializing Hero 3D Scene (expected to be disabled):', err);
  }


  try {
    initTechStackScene();
  } catch (err) {
    console.error('❌ Error initializing Tech Stack 3D Scene:', err);
  }

  try {
    initContactScene();
  } catch (err) {
    console.error('❌ Error initializing Contact 3D Scene:', err);
  }
}
