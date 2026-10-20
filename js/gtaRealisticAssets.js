// ========================================================
// GTA 5 REALISTIC ASSET & TEXTURE GENERATOR
// Procedural High-Resolution Textures for Photorealistic 3D Rendering:
// Asphalt Highways, Skyscraper Facades, Collegiate Brick, PBR Shaders,
// Carbon Fiber, Brake Rotors, Alloy Rims & Atmospheric Sky
// ========================================================

const GTATextures = {
  // 1. High-Resolution Asphalt Highway with Lane Markings
  createHighwayAsphalt(lanes = 4) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Base Asphalt Noise & Grain
    ctx.fillStyle = '#1c222b';
    ctx.fillRect(0, 0, 1024, 1024);

    // Fast micro-aggregate speckle texture (scaled 256x256 for instant startup)
    const nCanvas = document.createElement('canvas');
    nCanvas.width = 256;
    nCanvas.height = 256;
    const nCtx = nCanvas.getContext('2d');
    const nImg = nCtx.createImageData(256, 256);
    const nd = nImg.data;
    for (let i = 0; i < nd.length; i += 4) {
      const noise = (Math.random() - 0.5) * 24;
      nd[i] = Math.min(255, Math.max(0, 32 + noise));
      nd[i + 1] = Math.min(255, Math.max(0, 38 + noise));
      nd[i + 2] = Math.min(255, Math.max(0, 48 + noise));
      nd[i + 3] = 45;
    }
    nCtx.putImageData(nImg, 0, 0);
    ctx.drawImage(nCanvas, 0, 0, 1024, 1024);

    // Road Wear & Tar Streaks
    ctx.fillStyle = 'rgba(10, 14, 20, 0.4)';
    ctx.fillRect(180, 0, 160, 1024);
    ctx.fillRect(680, 0, 160, 1024);

    // Outer Solid White Road Shoulder Lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(40, 0); ctx.lineTo(40, 1024);
    ctx.moveTo(984, 0); ctx.lineTo(984, 1024);
    ctx.stroke();

    // Double Continuous Yellow Center Divider Lines (GTA / US Interstate Standard)
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(502, 0); ctx.lineTo(502, 1024);
    ctx.moveTo(522, 0); ctx.lineTo(522, 1024);
    ctx.stroke();

    // Dashed White Lane Dividers
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.setLineDash([48, 48]);
    ctx.beginPath();
    ctx.moveTo(270, 0); ctx.lineTo(270, 1024);
    ctx.moveTo(754, 0); ctx.lineTo(754, 1024);
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // Drainage Grate on curbside
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(52, 200, 32, 64);
    ctx.fillStyle = '#475569';
    for (let y = 206; y < 260; y += 8) {
      ctx.fillRect(54, y, 28, 3);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // 2. Crossway / Intersection Asphalt with Pedestrian Zebra Crosswalks
  createCrosswayAsphalt() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Asphalt Grain (Fast 256x256 scaled)
    ctx.fillStyle = '#1c222b';
    ctx.fillRect(0, 0, 1024, 1024);
    const nCanvas2 = document.createElement('canvas');
    nCanvas2.width = 256;
    nCanvas2.height = 256;
    const nCtx2 = nCanvas2.getContext('2d');
    const nImg2 = nCtx2.createImageData(256, 256);
    const nd2 = nImg2.data;
    for (let i = 0; i < nd2.length; i += 4) {
      const n = (Math.random() - 0.5) * 24;
      nd2[i] = Math.min(255, Math.max(0, 32 + n));
      nd2[i + 1] = Math.min(255, Math.max(0, 38 + n));
      nd2[i + 2] = Math.min(255, Math.max(0, 48 + n));
      nd2[i + 3] = 45;
    }
    nCtx2.putImageData(nImg2, 0, 0);
    ctx.drawImage(nCanvas2, 0, 0, 1024, 1024);

    // Crosswalk Zebra Stripes along Top and Bottom
    ctx.fillStyle = '#f8fafc';
    for (let x = 60; x < 964; x += 55) {
      ctx.fillRect(x, 40, 35, 120);
      ctx.fillRect(x, 864, 35, 120);
    }

    // Stop Lines
    ctx.fillRect(60, 180, 904, 14);
    ctx.fillRect(60, 830, 904, 14);

    // Dashed White Lane Divider along Center
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.setLineDash([40, 40]);
    ctx.beginPath();
    ctx.moveTo(512, 220); ctx.lineTo(512, 800);
    ctx.stroke();
    ctx.setLineDash([]);

    // Turn Arrows
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⬆', 300, 520);
    ctx.fillText('⬆', 724, 520);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // 3. Realistic Concrete Sidewalk Paver Texture
  createSidewalkPaver() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Concrete base
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 0, 512, 512);

    // Paving Slabs Grid (Square slabs with beveled grout lines)
    const slabSize = 64;
    for (let x = 0; x < 512; x += slabSize) {
      for (let y = 0; y < 512; y += slabSize) {
        const shade = 140 + Math.floor(Math.random() * 25);
        ctx.fillStyle = `rgb(${shade}, ${shade + 2}, ${shade + 5})`;
        ctx.fillRect(x + 2, y + 2, slabSize - 4, slabSize - 4);

        // Subtle slab noise
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(x + 4, y + 4, slabSize - 8, slabSize - 8);
      }
    }

    // Grout lines
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    for (let p = 0; p <= 512; p += slabSize) {
      ctx.beginPath();
      ctx.moveTo(p, 0); ctx.lineTo(p, 512);
      ctx.moveTo(0, p); ctx.lineTo(512, p);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // 4. Photorealistic Grass & Turf Texture
  createLushGrass() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep rich lawn green
    ctx.fillStyle = '#15803d';
    ctx.fillRect(0, 0, 512, 512);

    // Thousands of multi-shaded grass blades
    const shades = ['#166534', '#15803d', '#22c55e', '#14532d', '#4ade80', '#1e3a1e'];
    for (let i = 0; i < 24000; i++) {
      const gx = Math.random() * 512;
      const gy = Math.random() * 512;
      const len = 3 + Math.random() * 6;
      ctx.strokeStyle = shades[Math.floor(Math.random() * shades.length)];
      ctx.lineWidth = 1 + Math.random();
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + (Math.random() - 0.5) * 3, gy - len);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // 5. Photorealistic Modern Skyscraper Glass Curtain Wall Facade
  createSkyscraperFacade(tint = 'azure') {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Base curtain-wall background
    const isGold = tint === 'gold';
    ctx.fillStyle = isGold ? '#0a0d14' : '#040b17';
    ctx.fillRect(0, 0, 1024, 1024);

    // Architectural Window Grid (Rows & Columns of modern commercial glass)
    const cols = 16;
    const rows = 24;
    const w = 1024 / cols;
    const h = 1024 / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * w;
        const y = r * h;

        // Window Glass Gradient (Sky reflection + office depth)
        const winGrad = ctx.createLinearGradient(x, y, x, y + h);
        if (isGold) {
          winGrad.addColorStop(0, '#fef08a');
          winGrad.addColorStop(0.3, '#f59e0b');
          winGrad.addColorStop(1, '#78350f');
        } else {
          // Reflective cyan / deep navy glass with lit interior variations
          const isLit = (c + r * 3) % 4 === 0 || Math.random() < 0.28;
          if (isLit) {
            winGrad.addColorStop(0, '#bae6fd');
            winGrad.addColorStop(0.4, '#38bdf8');
            winGrad.addColorStop(1, '#0284c7');
          } else {
            winGrad.addColorStop(0, '#0c4a6e');
            winGrad.addColorStop(0.5, '#082f49');
            winGrad.addColorStop(1, '#020617');
          }
        }
        ctx.fillStyle = winGrad;
        ctx.fillRect(x + 3, y + 3, w - 6, h - 6);

        // Blinds / Window Mullion accents
        if (Math.random() < 0.4) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.fillRect(x + 4, y + 4, w - 8, (h - 8) * 0.4);
        }

        // Window Frame (Silver Aluminum Mullion)
        ctx.strokeStyle = isGold ? '#d97706' : '#475569';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
      }

      // Horizontal Spandrel Beam between floors
      ctx.fillStyle = isGold ? '#b45309' : '#1e293b';
      ctx.fillRect(0, r * h, 1024, 3);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // 6. Collegiate Ivy-League Red Brick Wall Texture
  createCollegiateBrick() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Mortar grey base
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, 0, 512, 512);

    const bW = 64;
    const bH = 24;
    const brickTones = ['#7c2d12', '#991b1b', '#b91c1c', '#78350f', '#9a3412'];

    let row = 0;
    for (let y = 0; y < 512; y += bH) {
      const offsetX = (row % 2 === 0) ? 0 : -bW / 2;
      for (let x = offsetX; x < 512 + bW; x += bW) {
        ctx.fillStyle = brickTones[Math.floor(Math.random() * brickTones.length)];
        ctx.fillRect(x + 2, y + 2, bW - 4, bH - 4);

        // Brick surface noise
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(x + 4, y + 4, bW - 8, bH - 8);
      }
      row++;
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // 7. Woven Carbon Fiber Texture (for GT Supercar splitter, wing, diffuser & roof)
  createCarbonFiber() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 128, 128);

    const step = 8;
    for (let x = 0; x < 128; x += step) {
      for (let y = 0; y < 128; y += step) {
        const isDiag = ((x / step) + (y / step)) % 2 === 0;
        ctx.fillStyle = isDiag ? '#1e293b' : '#09090b';
        ctx.fillRect(x, y, step, step);

        // Woven specular diagonal highlight
        ctx.strokeStyle = isDiag ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + step, y + step);
        ctx.stroke();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8);
    return tex;
  },

  // 8. Cross-Drilled Brembo Brake Rotor / Disc Texture
  createBrakeRotor() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Outer disc circular metal
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, Math.PI * 2);
    ctx.fill();

    // Radial brushed concentric rings
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    for (let r = 50; r < 118; r += 5) {
      ctx.beginPath();
      ctx.arc(128, 128, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Drilled cross-ventilation ventilation holes
    ctx.fillStyle = '#0f172a';
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      for (let rad = 65; rad < 110; rad += 15) {
        const hx = 128 + Math.cos(a + rad * 0.02) * rad;
        const hy = 128 + Math.sin(a + rad * 0.02) * rad;
        ctx.beginPath();
        ctx.arc(hx, hy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Center Bell / Hub
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(128, 128, 45, 0, Math.PI * 2);
    ctx.fill();

    // Wheel Lug Nuts
    ctx.fillStyle = '#f8fafc';
    for (let i = 0; i < 5; i++) {
      const la = (i / 5) * Math.PI * 2;
      const lx = 128 + Math.cos(la) * 26;
      const ly = 128 + Math.sin(la) * 26;
      ctx.beginPath();
      ctx.arc(lx, ly, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  },

  // 9. Directional Performance Tire Tread Texture
  createTireTread() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Deep matte rubber black
    ctx.fillStyle = '#111317';
    ctx.fillRect(0, 0, 256, 256);

    // Tread groove channels
    ctx.fillStyle = '#050608';
    ctx.fillRect(60, 0, 14, 256);
    ctx.fillRect(182, 0, 14, 256);

    // Diagonal water displacement sipes
    ctx.strokeStyle = '#050608';
    ctx.lineWidth = 5;
    for (let y = -20; y < 276; y += 24) {
      ctx.beginPath();
      ctx.moveTo(10, y); ctx.lineTo(55, y + 16);
      ctx.moveTo(246, y); ctx.lineTo(201, y + 16);
      ctx.moveTo(80, y + 10); ctx.lineTo(128, y);
      ctx.moveTo(176, y + 10); ctx.lineTo(128, y);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 16);
    return tex;
  },

  // 10. Realistic Atmospheric Sky Dome Gradient (GTA 5 Los Santos Daylight)
  createAtmosphericSkyDome() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Sky gradient: Zenith deep cobalt -> Sky blue -> Warm horizon glow
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#0369a1');   // High altitude azure
    grad.addColorStop(0.35, '#38bdf8'); // Mid sky
    grad.addColorStop(0.7, '#7dd3fc');  // Low sky
    grad.addColorStop(0.92, '#fed7aa'); // Horizon warm haze
    grad.addColorStop(1, '#ffedd5');    // Sunset warm glow line
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Soft Cumulus Cloud Bands
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let i = 0; i < 16; i++) {
      const cx = (i * 72 + Math.random() * 40) % 1024;
      const cy = 240 + Math.random() * 90;
      const rw = 120 + Math.random() * 160;
      const rh = 18 + Math.random() * 24;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rw, rh, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // High Bright Sun Flare Disc
    const sunGrad = ctx.createRadialGradient(380, 120, 10, 380, 120, 140);
    sunGrad.addColorStop(0, '#ffffff');
    sunGrad.addColorStop(0.2, 'rgba(254, 240, 138, 0.8)');
    sunGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.25)');
    sunGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(380, 120, 140, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  },

  // 11. Hamna's Real Face Texture with Radial Skin-Tone Blending for 3D Head Mesh
  createHamnaFaceTexture(imageSrc, callback) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Base skin tone
      ctx.fillStyle = '#f5d0b5';
      ctx.fillRect(0, 0, 512, 512);

      // Draw portrait in center
      const s = 340;
      const ox = (512 - s) / 2;
      const oy = (512 - s) / 2;
      ctx.drawImage(img, ox, oy, s, s);

      // Radial vignette blend into skin tone
      const radGrad = ctx.createRadialGradient(256, 256, 120, 256, 256, 245);
      radGrad.addColorStop(0, 'rgba(245, 208, 181, 0)');
      radGrad.addColorStop(0.8, 'rgba(245, 208, 181, 0.65)');
      radGrad.addColorStop(1, 'rgba(245, 208, 181, 1)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, 512, 512);

      const tex = new THREE.CanvasTexture(canvas);
      if (callback) callback(tex);
    };
    img.src = imageSrc;
  },

  // 11b. Photorealistic Golden Beach Sand Texture
  createBeachSand() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Warm golden sand base
    ctx.fillStyle = '#dfbc85';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle organic sand grain
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 16;
      d[i] = Math.min(255, Math.max(0, d[i] + n));
      d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n * 0.9));
      d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n * 0.7));
    }
    ctx.putImageData(imgData, 0, 0);

    // Gentle wave ripple lines
    ctx.strokeStyle = 'rgba(194, 154, 98, 0.3)';
    ctx.lineWidth = 2.5;
    for (let y = 16; y < 512; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= 512; x += 32) {
        ctx.lineTo(x, y + Math.sin(x * 0.05) * 3);
      }
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // 12. Real Photographic Asset Loader & Cache
  realAssetMap: {
    citySkyline: 'assets/city_skyline.jpg',
    universityCampus: 'assets/university_campus.jpg',
    realmTown: 'assets/realm_town.jpg',
    realmNature: 'assets/realm_nature.jpg',
    realmEarth: 'assets/realm_earth.jpg',
    realmStudio: 'assets/realm_studio.jpg',
    realmFashion: 'assets/realm_fashion.jpg',
    supercarStreet: 'assets/supercar_street.jpg',
    executiveSuite: 'assets/executive_suite.jpg',
    collabhub: 'assets/collabhub.jpg',
    trendrove: 'assets/trendrove.jpg',
    securityArrest: 'assets/security_arrest.jpg',
    hamnaReal: 'assets/hamna_real.jpg',
    avatar: 'assets/avatar.jpg',
    img1: 'assets/img1.jpg',
    img2: 'assets/img2.jpg'
  },
  _cachedTextures: {},

  getRealAssetTexture(key, repeatX = 1, repeatY = 1) {
    const cacheKey = `${key}_${repeatX}_${repeatY}`;
    if (this._cachedTextures[cacheKey]) {
      return this._cachedTextures[cacheKey];
    }

    const path = this.realAssetMap[key] || key;
    if (typeof THREE !== 'undefined' && THREE.TextureLoader) {
      const loader = new THREE.TextureLoader();
      const tex = loader.load(path);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeatX, repeatY);
      if (tex.anisotropy) tex.anisotropy = 8;
      this._cachedTextures[cacheKey] = tex;
      return tex;
    }
    return null;
  },

  // 13. GTA 5 Interactive Ground Waypoint Decal Ring Texture
  createWaypointRingTexture(primaryColor = '#f59e0b', icon = '★') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 512, 512);

    // Glowing Radial Aura
    const rad = ctx.createRadialGradient(256, 256, 60, 256, 256, 240);
    rad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    rad.addColorStop(0.5, `${primaryColor}22`);
    rad.addColorStop(0.85, `${primaryColor}66`);
    rad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rad;
    ctx.beginPath();
    ctx.arc(256, 256, 240, 0, Math.PI * 2);
    ctx.fill();

    // Outer Thin Tracking Ring
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(256, 256, 220, 0, Math.PI * 2);
    ctx.stroke();

    // Dashed Concentric Inner Ring
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.setLineDash([16, 12]);
    ctx.beginPath();
    ctx.arc(256, 256, 195, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Solid Inner Glow Circle
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(256, 256, 150, 0, Math.PI * 2);
    ctx.stroke();

    // 4 Cardinal Direction Chevron Marks
    ctx.fillStyle = primaryColor;
    const chevrons = [
      [256, 35, 0],
      [477, 256, Math.PI / 2],
      [256, 477, Math.PI],
      [35, 256, -Math.PI / 2]
    ];
    chevrons.forEach(([cx, cy, rot]) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(12, 8);
      ctx.lineTo(-12, 8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    // Center Icon
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 18;
    ctx.fillText(icon, 256, 256);
    ctx.shadowBlur = 0;

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  },

  // 14. Modern Architectural Facade & Totem Signage Texture
  createSignageTexture(title, subtitle = '', badge = '', theme = 'gold') {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const themes = {
      gold: { bg: '#0b0f19', border: '#f59e0b', text: '#ffffff', sub: '#fbbf24', badgeBg: '#d97706' },
      azure: { bg: '#081120', border: '#0284c7', text: '#ffffff', sub: '#38bdf8', badgeBg: '#0369a1' },
      emerald: { bg: '#061a14', border: '#10b981', text: '#ffffff', sub: '#34d399', badgeBg: '#059669' },
      rose: { bg: '#1c0d16', border: '#f43f5e', text: '#ffffff', sub: '#fb7185', badgeBg: '#e11d48' },
      purple: { bg: '#130d22', border: '#a855f7', text: '#ffffff', sub: '#c084fc', badgeBg: '#7e22ce' }
    };
    const t = themes[theme] || themes.gold;

    // Dark sleek monolith background
    ctx.fillStyle = t.bg;
    ctx.fillRect(0, 0, 1024, 256);

    // Subtle brushed horizontal carbon texture lines
    ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
    for (let y = 0; y < 256; y += 4) {
      ctx.fillRect(0, y, 1024, 2);
    }

    // Glowing architectural border frame
    ctx.strokeStyle = t.border;
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, 1008, 240);

    // Corner decorative metal brackets
    ctx.fillStyle = t.border;
    const bracketSize = 24;
    ctx.fillRect(8, 8, bracketSize, 6);
    ctx.fillRect(8, 8, 6, bracketSize);
    ctx.fillRect(1016 - bracketSize, 8, bracketSize, 6);
    ctx.fillRect(1010, 8, 6, bracketSize);
    ctx.fillRect(8, 242, bracketSize, 6);
    ctx.fillRect(8, 248 - bracketSize, 6, bracketSize);
    ctx.fillRect(1016 - bracketSize, 242, bracketSize, 6);
    ctx.fillRect(1010, 248 - bracketSize, 6, bracketSize);

    // Optional badge in top-left
    if (badge) {
      ctx.fillStyle = t.badgeBg;
      ctx.fillRect(36, 26, 220, 36);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badge.toUpperCase(), 146, 44);
    }

    // Main Title Typography
    ctx.font = '900 52px sans-serif';
    ctx.fillStyle = t.text;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = t.border;
    ctx.shadowBlur = 14;
    ctx.fillText(title.toUpperCase(), 40, badge ? 116 : 100);
    ctx.shadowBlur = 0;

    // Subtitle / Architectural Details
    if (subtitle) {
      ctx.font = '600 24px sans-serif';
      ctx.fillStyle = t.sub;
      ctx.fillText(subtitle.toUpperCase(), 42, badge ? 186 : 175);
    }

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  },

  // 15. Ocean Water Wave & Normal Caustic Texture
  createOceanWaterTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep Pacific Ocean Azure Base
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(0, 0, 512, 512);

    // Sine-wave foam ripples
    for (let i = 0; i < 48; i++) {
      const y = (i * 12 + Math.random() * 6) % 512;
      const x = Math.random() * 512;
      const w = 40 + Math.random() * 80;
      const grad = ctx.createRadialGradient(x, y, 2, x, y, w);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      grad.addColorStop(0.6, 'rgba(56, 189, 248, 0.2)');
      grad.addColorStop(1, 'rgba(3, 105, 161, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(x, y, w, 8, Math.sin(i) * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(16, 16);
    return tex;
  },

  // 16. Airport Runway Markings Texture
  createRunwayTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Dark Aviation Asphalt Base
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 1024);

    // Outer Solid White Runway Boundary Lines
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, 472, 984);

    // Runway Number Designation (24L)
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 110px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('24L', 256, 180);

    // Center Dashed Yellow Guidance Line
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 10;
    ctx.setLineDash([48, 48]);
    ctx.beginPath();
    ctx.moveTo(256, 240);
    ctx.lineTo(256, 960);
    ctx.stroke();
    ctx.setLineDash([]);

    // Touchdown Zone White Piano Keys
    ctx.fillStyle = '#ffffff';
    for (let x = 60; x <= 452; x += 40) {
      if (Math.abs(x - 256) > 30) {
        ctx.fillRect(x, 260, 20, 140);
        ctx.fillRect(x, 740, 20, 140);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // 17. Photorealistic Natural Tree Bark Texture
  createTreeBarkTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep woody brown base
    ctx.fillStyle = '#27170a';
    ctx.fillRect(0, 0, 512, 512);

    // Deep vertical furrow lines and organic bark ridges
    for (let x = 0; x < 512; x += 4) {
      const shade = 35 + Math.floor(Math.sin(x * 0.15) * 15 + Math.random() * 25);
      ctx.fillStyle = `rgb(${shade + 15}, ${shade + 5}, ${shade - 5})`;
      ctx.fillRect(x, 0, 3, 512);

      // Random dark crevices
      if (Math.random() < 0.35) {
        ctx.fillStyle = '#0f0804';
        ctx.fillRect(x, Math.random() * 512, 2, 40 + Math.random() * 80);
      }
    }

    // Moss highlights
    ctx.fillStyle = 'rgba(34, 197, 94, 0.12)';
    for (let i = 0; i < 40; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 12, 35);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // 18. Photorealistic Palm Trunk Texture (Segmented fibrous bark)
  createPalmTrunkTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Sandy wood base
    ctx.fillStyle = '#5c4033';
    ctx.fillRect(0, 0, 256, 512);

    // Horizontal fibrous ring segments
    for (let y = 0; y < 512; y += 18) {
      ctx.fillStyle = '#3e2723';
      ctx.fillRect(0, y, 256, 4);

      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(0, y + 4, 256, 6);

      // Fiber hatching
      ctx.strokeStyle = '#271510';
      ctx.lineWidth = 1;
      for (let x = 0; x < 256; x += 8) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + (Math.random() - 0.5) * 6, y + 16);
        ctx.stroke();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // 19. Photorealistic Volumetric Foliage Texture (Dense Leaf Silhouettes with Alpha)
  createLeafFoliageTexture(baseHex = '#166534', highlightHex = '#4ade80') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Transparent background
    ctx.clearRect(0, 0, 512, 512);

    // Hundreds of individual organic leaf shapes
    const colors = [baseHex, '#15803d', '#14532d', highlightHex, '#22c55e', '#86efac'];
    for (let i = 0; i < 3500; i++) {
      const lx = Math.random() * 512;
      const ly = Math.random() * 512;
      const angle = Math.random() * Math.PI * 2;
      const size = 6 + Math.random() * 12;

      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(angle);

      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.beginPath();
      ctx.ellipse(0, 0, size, size * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Subtle center vein
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-size * 0.8, 0);
      ctx.lineTo(size * 0.8, 0);
      ctx.stroke();

      ctx.restore();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // 20. Realistic Feathered Palm Frond Leaf Texture
  createPalmFrondTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 512, 256);

    // Central Frond Stem / Spine
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(10, 128);
    ctx.quadraticCurveTo(256, 120, 500, 128);
    ctx.stroke();

    // Radiating pinnate leaf blades along both sides of stem
    for (let x = 30; x < 490; x += 4) {
      const frondLen = Math.sin((x / 512) * Math.PI) * 95 + 15;
      const colors = ['#15803d', '#22c55e', '#166534', '#65a30d'];

      // Upper blade
      ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x, 128);
      ctx.lineTo(x + 18, 128 - frondLen);
      ctx.stroke();

      // Lower blade
      ctx.beginPath();
      ctx.moveTo(x, 128);
      ctx.lineTo(x + 18, 128 + frondLen);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  },

  // 21. Village Entrance Monument / Archway Sign Texture
  createVillageArchTexture(villageTitle = 'ACADEMIC VILLAGE', subtitle = 'KTU & CALICUT UNIVERSITY', accentColor = '#38bdf8') {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Deep architectural background with gold/accent border
    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(0, 0, 1024, 256);

    // Outer Neon Border
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, 1008, 240);

    // Inner subtle gold line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 18, 988, 220);

    // Header Tag
    ctx.fillStyle = accentColor;
    ctx.font = '900 24px "Plus Jakarta Sans", monospace';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '4px';
    ctx.fillText('🏛️ HAMNA METROPOLIS // DEDICATED CV DISTRICT', 512, 55);

    // Main Village Name
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 52px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(villageTitle.toUpperCase(), 512, 130);

    // Subtitle / Contents
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(subtitle.toUpperCase(), 512, 185);

    // Bottom Status Bar
    ctx.fillStyle = accentColor;
    ctx.fillRect(200, 210, 624, 4);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  },

  // 22. Official Interstate Highway Green Directional Overhead Gantry Sign Texture
  createDirectionalSignTexture(title = 'HAMNA METROPOLIS HIGHWAY JUNCTION', leftDest = '⬅ EDUCATION VILLAGE (KTU/CALICUT) 200m', straightDest = '⬆ EXPERIENCE TECH PARK 300m', rightDest = '➡ SKILLS MATRIX VILLAGE 150m') {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');

    // Interstate Highway Deep Forest Green (#047857)
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(0, 0, 1024, 384);

    // Thick White Beveled Highway Sign Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 10;
    ctx.strokeRect(12, 12, 1000, 360);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 984, 344);

    // Top Junction Title Bar
    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 24px "Plus Jakarta Sans", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`📍 ${title.toUpperCase()}`, 512, 55);

    // Divider Line
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(35, 70, 954, 4);

    // Left Destination Line
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 32px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(leftDest, 50, 135);

    // Straight Ahead Destination Line
    ctx.fillText(straightDest, 50, 205);

    // Right Destination Line
    ctx.fillText(rightDest, 50, 275);

    // Footer Hint
    ctx.fillStyle = '#a7f3d0';
    ctx.font = '700 20px "Plus Jakarta Sans", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SPEED LIMIT: 120 KM/H // CAUTION: SPEED CAMERAS ACTIVE', 512, 340);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  },

  // 23. Photorealistic Rocky Mountain Slate Texture
  createMountainRockTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 0, 512, 512);

    // Rock layers / strata
    for (let y = 0; y < 512; y += 8) {
      const shade = 45 + Math.floor(Math.sin(y * 0.1) * 20 + Math.random() * 25);
      ctx.fillStyle = `rgb(${shade}, ${shade + 4}, ${shade + 10})`;
      ctx.fillRect(0, y, 512, 6);
    }

    // Snow caps & granite fissures
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    for (let i = 0; i < 80; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 200, 30 + Math.random() * 60, 4);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    return tex;
  },

  // 24. Los Santos Customs Workshop Neon Banner Texture
  createWorkshopSignTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 1024, 256);

    // Outer neon glow border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, 1004, 236);

    // Inner cyan trim
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 984, 216);

    // Glowing title
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 68px "Arial Black", "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 18;
    ctx.fillText('LOS SANTOS CUSTOMS', 512, 95);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
    ctx.fillText('🔧 24/7 AUTO BODY REPAIR & PERFORMANCE TUNING 🔧', 512, 175);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  },

  // 25. Industrial Hazard Warning Stripes (Yellow & Black Diagonals)
  createHazardStripeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = '#0f172a';
    for (let x = -256; x < 512; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 24, 0);
      ctx.lineTo(x + 24 + 256, 256);
      ctx.lineTo(x + 256, 256);
      ctx.closePath();
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 1);
    return tex;
  },

  // 26. Corrugated Roll-Up Garage Door Metal Texture
  createCorrugatedMetalTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#475569';
    ctx.fillRect(0, 0, 128, 256);

    for (let y = 0; y < 256; y += 12) {
      const grad = ctx.createLinearGradient(0, y, 0, y + 12);
      grad.addColorStop(0, '#94a3b8');
      grad.addColorStop(0.5, '#334155');
      grad.addColorStop(1, '#1e293b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, y, 128, 11);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 4);
    return tex;
  },

  // 27. Cast-Iron Manhole Cover & Storm Drain Grate Texture
  createManholeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Waffle traction grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    for (let i = 24; i < 232; i += 18) {
      ctx.beginPath();
      ctx.moveTo(i, 24);
      ctx.lineTo(i, 232);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(24, i);
      ctx.lineTo(232, i);
      ctx.stroke();
    }

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CITY SEWER', 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }
};

// Automatic Performance Caching: Memoize all texture generator methods
GTATextures._cache = {};
[
  'createHighwayAsphalt', 'createCrosswayAsphalt', 'createSidewalkPaver',
  'createLushGrass', 'createSkyscraperFacade', 'createCollegiateBrick',
  'createCarbonFiber', 'createBrakeRotor', 'createTireTread',
  'createAtmosphericSkyDome', 'createBeachSand', 'createWaypointRingTexture',
  'createSignageTexture', 'createOceanWaterTexture', 'createRunwayTexture',
  'createTreeBarkTexture', 'createPalmTrunkTexture', 'createLeafFoliageTexture',
  'createPalmFrondTexture', 'createVillageArchTexture', 'createDirectionalSignTexture',
  'createMountainRockTexture', 'createWorkshopSignTexture', 'createHazardStripeTexture',
  'createCorrugatedMetalTexture', 'createManholeTexture'
].forEach(fnName => {
  const origFn = GTATextures[fnName];
  if (typeof origFn === 'function') {
    GTATextures[fnName] = function(...args) {
      const cacheKey = fnName + '_' + args.join('_');
      if (GTATextures._cache[cacheKey]) {
        return GTATextures._cache[cacheKey];
      }
      const res = origFn.apply(this, args);
      GTATextures._cache[cacheKey] = res;
      return res;
    };
  }
});

window.GTATextures = GTATextures;


