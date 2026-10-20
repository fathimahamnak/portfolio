// ========================================================
// 10D Three.js Spatial Warp Universe & Continuous Z-Axis Flight
// ========================================================

class Universe3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.particlePositions = null;
    this.particleOriginalZ = null;
    this.warpLines = null;
    this.waypointRings = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;

    // Camera flight trajectory
    this.camCurrent = { x: 0, y: 0, z: 800, rotX: 0, rotY: 0, rotZ: 0 };
    this.camTarget = { x: 0, y: 0, z: 800, rotX: 0, rotY: 0, rotZ: 0 };
    this.velocity = 0;
    this.currentTheme = 'solaris';

    this.themeColors = {
      solaris: [0xf59e0b, 0xfbbf24, 0xf97316, 0xffedd5, 0xc084fc],
      amethyst: [0xa855f7, 0xec4899, 0x6366f1, 0xe0e7ff, 0x38bdf8],
      emerald: [0x10b981, 0x00ffc4, 0x06b6d4, 0xd1fae5, 0x3b82f6]
    };

    this.init();
  }

  init() {
    if (!this.canvas) return;

    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded, using fallback');
      this.initFallback2D();
      return;
    }

    try {
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x05050a, 0.0006);

      this.camera = new THREE.PerspectiveCamera(
        65,
        window.innerWidth / window.innerHeight,
        1,
        15000
      );
      this.camera.position.set(0, 0, 800);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 1. Create 3D Deep Space Warp Tunnel
      this.createWarpTunnel();

      // 2. Create Floating Waypoint Rings at Sector Intervals
      this.createWaypointRings();

      // 3. Event Listeners
      window.addEventListener('resize', () => this.onWindowResize(), false);
      window.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
      window.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: true });

      this.animate();
    } catch (err) {
      console.error('WebGL init error, using fallback:', err);
      this.initFallback2D();
    }
  }

  createWarpTunnel() {
    const particleCount = 2600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    this.particleOriginalZ = new Float32Array(particleCount);

    const palette = this.themeColors[this.currentTheme].map(c => new THREE.Color(c));

    for (let i = 0; i < particleCount; i++) {
      // Cylinder tunnel distribution along Z-axis
      const radius = 180 + Math.random() * 1600;
      const angle = Math.random() * Math.PI * 2;
      const zPos = 1200 - Math.random() * 11000; // Deep depth

      positions[i * 3] = radius * Math.cos(angle);
      positions[i * 3 + 1] = radius * Math.sin(angle);
      positions[i * 3 + 2] = zPos;

      this.particleOriginalZ[i] = zPos;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Dynamic radial glow star texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.25, 'rgba(251,191,36,0.9)');
    grad.addColorStop(0.65, 'rgba(249,115,22,0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 16,
      vertexColors: true,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
    this.particlePositions = positions;
  }

  createWaypointRings() {
    // Holographic Torus Portals stationed at the 6 Sector Waypoints
    const waypointDepths = [
      { z: 0, color: 0xf59e0b, radius: 450 },     // Sector 1: Hero
      { z: -1600, color: 0xf97316, radius: 520 }, // Sector 2: Skills
      { z: -3200, color: 0xfbbf24, radius: 480 }, // Sector 3: Collab-Hub
      { z: -4800, color: 0xc084fc, radius: 500 }, // Sector 4: Trendrove
      { z: -6400, color: 0xf59e0b, radius: 460 }, // Sector 5: Journey
      { z: -8000, color: 0x10b981, radius: 550 }  // Sector 6: Command
    ];

    waypointDepths.forEach((wp) => {
      const geom = new THREE.TorusGeometry(wp.radius, 4, 16, 80);
      const mat = new THREE.MeshBasicMaterial({
        color: wp.color,
        wireframe: true,
        transparent: true,
        opacity: 0.35
      });
      const ring = new THREE.Mesh(geom, mat);
      ring.position.set(0, 0, wp.z);
      ring.userData = { rotSpeed: 0.003 + Math.random() * 0.004, baseZ: wp.z };
      this.scene.add(ring);
      this.waypointRings.push(ring);
    });
  }

  // Update theme colors across all 3D particles & rings
  setTheme(themeName) {
    if (!this.themeColors[themeName]) return;
    this.currentTheme = themeName;
    const palette = this.themeColors[themeName].map(c => new THREE.Color(c));

    if (this.particles) {
      const colors = this.particles.geometry.attributes.color.array;
      for (let i = 0; i < colors.length / 3; i++) {
        const col = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
      }
      this.particles.geometry.attributes.color.needsUpdate = true;
    }

    this.waypointRings.forEach((ring, idx) => {
      const col = palette[idx % palette.length];
      ring.material.color.set(col);
    });
  }

  onMouseMove(e) {
    this.targetMouseX = (e.clientX - this.windowHalfX) * 0.5;
    this.targetMouseY = (e.clientY - this.windowHalfY) * 0.5;
  }

  onTouchMove(e) {
    if (e.touches.length > 0) {
      this.targetMouseX = (e.touches[0].clientX - this.windowHalfX) * 0.4;
      this.targetMouseY = (e.touches[0].clientY - this.windowHalfY) * 0.4;
    }
  }

  onWindowResize() {
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  // Update Flight Trajectory & Depth from Flight Controller
  setFlightState(state) {
    this.camTarget.x = state.x || 0;
    this.camTarget.y = state.y || 0;
    this.camTarget.z = state.z || 0;
    this.camTarget.rotX = state.rotX || 0;
    this.camTarget.rotY = state.rotY || 0;
    this.camTarget.rotZ = state.rotZ || 0;
    this.velocity = state.velocity || 0;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Mouse parallax lerping
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // Smooth lerp camera translation
    this.camCurrent.x += (this.camTarget.x + this.mouseX * 0.6 - this.camCurrent.x) * 0.08;
    this.camCurrent.y += (this.camTarget.y - this.mouseY * 0.6 - this.camCurrent.y) * 0.08;
    this.camCurrent.z += (this.camTarget.z - this.camCurrent.z) * 0.08;

    // Camera rotation & banking
    this.camCurrent.rotX += (this.camTarget.rotX - this.camCurrent.rotX) * 0.08;
    this.camCurrent.rotY += (this.camTarget.rotY - this.camCurrent.rotY) * 0.08;
    this.camCurrent.rotZ += (this.camTarget.rotZ - this.camCurrent.rotZ) * 0.08;

    this.camera.position.set(this.camCurrent.x, this.camCurrent.y, this.camCurrent.z);
    this.camera.rotation.set(
      this.camCurrent.rotX - this.mouseY * 0.0003,
      this.camCurrent.rotY - this.mouseX * 0.0003,
      this.camCurrent.rotZ
    );

    // Dynamic Starfield Warp Effect
    if (this.particles) {
      this.particles.rotation.z += 0.0004;
    }

    // Animate Waypoint Portal Rings
    this.waypointRings.forEach(ring => {
      ring.rotation.z += ring.userData.rotSpeed;
      ring.rotation.x += ring.userData.rotSpeed * 0.5;
    });

    this.renderer.render(this.scene, this.camera);
  }

  initFallback2D() {
    const ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    const stars = [];
    for (let i = 0; i < 180; i++) {
      stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 2,
        speed: 0.3 + Math.random() * 0.6
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = '#05050a';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        s.y -= s.speed;
        if (s.y < 0) s.y = this.canvas.height;
      });
      requestAnimationFrame(draw);
    };
    draw();
  }
}

window.Universe3D = Universe3D;
