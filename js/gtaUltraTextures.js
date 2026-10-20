// ========================================================
// ULTRA-REALISTIC TEXTURE OVERHAUL MODULE
// High-performance photorealistic PBR textures featuring
// weathering, aggregate detail, micro-variation, and caching.
// ========================================================

const GTAUltraTextures = {
  cache: {},

  // Ultra-detailed realistic asphalt with worn tire tracks and oil stains
  createUltraRealisticAsphalt(lanes = 4) {
    const cacheKey = 'asphalt_' + lanes;
    if (this.cache[cacheKey]) return this.cache[cacheKey];

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Base asphalt - dark rich road grit
    ctx.fillStyle = '#161b22';
    ctx.fillRect(0, 0, 1024, 1024);

    // Fast aggregate noise pattern (256x256 scaled to 1024x1024 for instant startup)
    const nCanvas = document.createElement('canvas');
    nCanvas.width = 256;
    nCanvas.height = 256;
    const nCtx = nCanvas.getContext('2d');
    const nImg = nCtx.createImageData(256, 256);
    const nd = nImg.data;
    for (let i = 0; i < nd.length; i += 4) {
      const n = (Math.random() - 0.5) * 20;
      nd[i] = Math.min(255, Math.max(0, 30 + n));
      nd[i + 1] = Math.min(255, Math.max(0, 35 + n));
      nd[i + 2] = Math.min(255, Math.max(0, 42 + n));
      nd[i + 3] = 40; // semi-transparent aggregate
    }
    nCtx.putImageData(nImg, 0, 0);
    ctx.drawImage(nCanvas, 0, 0, 1024, 1024);

    // Worn tire tracks - darker strips
    ctx.fillStyle = 'rgba(5, 8, 12, 0.28)';
    ctx.fillRect(175, 0, 90, 1024);
    ctx.fillRect(760, 0, 90, 1024);

    // Oil stains (random dark splotches)
    for (let i = 0; i < 15; i++) {
      const ox = Math.random() * 1024;
      const oy = Math.random() * 1024;
      const or = 8 + Math.random() * 20;
      const oGrad = ctx.createRadialGradient(ox, oy, 2, ox, oy, or);
      oGrad.addColorStop(0, 'rgba(5, 5, 8, 0.45)');
      oGrad.addColorStop(0.5, 'rgba(10, 12, 18, 0.2)');
      oGrad.addColorStop(1, 'rgba(10, 12, 18, 0)');
      ctx.fillStyle = oGrad;
      ctx.beginPath();
      ctx.arc(ox, oy, or, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer solid white shoulder lines
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(35, 0); ctx.lineTo(35, 1024);
    ctx.moveTo(989, 0); ctx.lineTo(989, 1024);
    ctx.stroke();

    // Double yellow center divider (US standard)
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(502, 0); ctx.lineTo(502, 1024);
    ctx.moveTo(522, 0); ctx.lineTo(522, 1024);
    ctx.stroke();

    // Reflective dashed lane dividers
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 6;
    ctx.setLineDash([40, 40]);
    ctx.beginPath();
    ctx.moveTo(265, 0); ctx.lineTo(265, 1024);
    ctx.moveTo(759, 0); ctx.lineTo(759, 1024);
    ctx.stroke();
    ctx.setLineDash([]);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 8;
    this.cache[cacheKey] = tex;
    return tex;
  },

  // Ultra-realistic sidewalk with weathering, cracks, and wear patterns
  createUltraRealisticSidewalk() {
    const cacheKey = 'sidewalk';
    if (this.cache[cacheKey]) return this.cache[cacheKey];

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Concrete base with subtle color variation
    ctx.fillStyle = '#8b95a2';
    ctx.fillRect(0, 0, 512, 512);

    // Individual paving slabs with natural variation
    const slabSize = 64;
    for (let x = 0; x < 512; x += slabSize) {
      for (let y = 0; y < 512; y += slabSize) {
        const shade = 130 + Math.floor(Math.random() * 25);
        ctx.fillStyle = `rgb(${shade}, ${shade + 1}, ${shade - 1})`;
        ctx.fillRect(x + 2, y + 2, slabSize - 4, slabSize - 4);
      }
    }

    // Grout lines
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 3;
    for (let p = 0; p <= 512; p += slabSize) {
      ctx.beginPath();
      ctx.moveTo(p, 0); ctx.lineTo(p, 512);
      ctx.moveTo(0, p); ctx.lineTo(512, p);
      ctx.stroke();
    }

    // Hairline cracks
    ctx.strokeStyle = 'rgba(55, 65, 81, 0.4)';
    ctx.lineWidth = 1;
    for (let c = 0; c < 6; c++) {
      const cx = Math.random() * 512;
      const cy = Math.random() * 512;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      let crX = cx, crY = cy;
      for (let seg = 0; seg < 4; seg++) {
        crX += (Math.random() - 0.5) * 40;
        crY += 10 + Math.random() * 20;
        ctx.lineTo(crX, crY);
      }
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 8;
    this.cache[cacheKey] = tex;
    return tex;
  },

  // Ultra-realistic skyscraper facade with individual window detail
  createUltraRealisticFacade(tint = 'azure', width = 1024, height = 1024) {
    const cacheKey = 'facade_' + tint + '_' + width + '_' + height;
    if (this.cache[cacheKey]) return this.cache[cacheKey];

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const isGold = tint === 'gold';
    const isEmerald = tint === 'emerald';

    // Curtain wall spandrel base
    ctx.fillStyle = isGold ? '#0d1117' : (isEmerald ? '#071210' : '#050d17');
    ctx.fillRect(0, 0, width, height);

    const cols = 16;
    const rows = 24;
    const cellW = width / cols;
    const cellH = height / rows;
    const mullionW = 4;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellW + mullionW;
        const y = r * cellH + mullionW;
        const w = cellW - mullionW * 2;
        const h = cellH - mullionW * 2;

        const isLit = Math.random() < 0.35;
        const winGrad = ctx.createLinearGradient(x, y, x, y + h);

        if (isGold) {
          if (isLit) {
            winGrad.addColorStop(0, '#fef9c3');
            winGrad.addColorStop(0.5, '#f59e0b');
            winGrad.addColorStop(1, '#92400e');
          } else {
            winGrad.addColorStop(0, '#78350f');
            winGrad.addColorStop(1, '#1c1917');
          }
        } else if (isEmerald) {
          if (isLit) {
            winGrad.addColorStop(0, '#d1fae5');
            winGrad.addColorStop(0.5, '#10b981');
            winGrad.addColorStop(1, '#064e3b');
          } else {
            winGrad.addColorStop(0, '#064e3b');
            winGrad.addColorStop(1, '#0a0a0a');
          }
        } else {
          if (isLit) {
            winGrad.addColorStop(0, '#e0f2fe');
            winGrad.addColorStop(0.5, '#38bdf8');
            winGrad.addColorStop(1, '#0369a1');
          } else {
            winGrad.addColorStop(0, '#164e63');
            winGrad.addColorStop(0.5, '#0c4a6e');
            winGrad.addColorStop(1, '#020617');
          }
        }

        ctx.fillStyle = winGrad;
        ctx.fillRect(x, y, w, h);

        // Glass reflection highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.moveTo(x, y + h * 0.4);
        ctx.lineTo(x + w * 0.5, y);
        ctx.lineTo(x + w * 0.7, y);
        ctx.lineTo(x, y + h * 0.6);
        ctx.fill();

        // Window frame
        ctx.strokeStyle = isGold ? '#78350f' : (isEmerald ? '#064e3b' : '#1e3a5f');
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
      }

      // Horizontal floor spandrel
      ctx.fillStyle = isGold ? '#1c1917' : (isEmerald ? '#0a0a0a' : '#0f172a');
      ctx.fillRect(0, r * cellH, width, mullionW);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 8;
    this.cache[cacheKey] = tex;
    return tex;
  },

  // Ultra-realistic grass with depth and natural variation
  createUltraRealisticGrass() {
    const cacheKey = 'grass';
    if (this.cache[cacheKey]) return this.cache[cacheKey];

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Rich dark earth base
    ctx.fillStyle = '#1a3a1a';
    ctx.fillRect(0, 0, 512, 512);

    // Multi-tone grass underlayer
    const grassColors = [
      '#0d3b0d', '#14532d', '#166534', '#15803d',
      '#22c55e', '#16a34a', '#1a5c2e', '#0e4a1e'
    ];

    for (let i = 0; i < 2000; i++) {
      const gx = Math.random() * 512;
      const gy = Math.random() * 512;
      const len = 3 + Math.random() * 8;
      const sway = (Math.random() - 0.5) * 4;

      ctx.strokeStyle = grassColors[Math.floor(Math.random() * grassColors.length)];
      ctx.lineWidth = 1 + Math.random();
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.quadraticCurveTo(gx + sway * 0.5, gy - len * 0.5, gx + sway, gy - len);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 8;
    this.cache[cacheKey] = tex;
    return tex;
  },

  // Ultra-realistic sky dome with volumetric clouds and proper atmosphere
  createUltraRealisticSkyDome() {
    const cacheKey = 'skydome';
    if (this.cache[cacheKey]) return this.cache[cacheKey];

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Rayleigh scattering gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 512);
    skyGrad.addColorStop(0, '#0c4a6e');     // Zenith
    skyGrad.addColorStop(0.25, '#0284c7');
    skyGrad.addColorStop(0.5, '#38bdf8');   // Mid sky
    skyGrad.addColorStop(0.75, '#bae6fd');
    skyGrad.addColorStop(0.9, '#fde68a');   // Warm horizon
    skyGrad.addColorStop(1.0, '#fed7aa');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Cumulus clouds
    const drawCloud = (x, y, scale, opacity) => {
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      for (let p = 0; p < 6; p++) {
        const px = x + (Math.random() - 0.5) * scale * 1.8;
        const py = y + (Math.random() - 0.3) * scale * 0.5;
        const pr = scale * (0.3 + Math.random() * 0.5);
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    for (let i = 0; i < 10; i++) {
      drawCloud(
        Math.random() * 1024,
        140 + Math.random() * 120,
        30 + Math.random() * 50,
        0.35 + Math.random() * 0.25
      );
    }

    // Photorealistic sun with soft halo
    const sunX = 340, sunY = 100;
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 2, sunX, sunY, 120);
    sunGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    sunGrad.addColorStop(0.04, 'rgba(255, 253, 235, 0.95)');
    sunGrad.addColorStop(0.15, 'rgba(254, 240, 138, 0.5)');
    sunGrad.addColorStop(0.4, 'rgba(251, 191, 36, 0.15)');
    sunGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 120, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    this.cache[cacheKey] = tex;
    return tex;
  },

  // Apply ultra textures to the existing system by overriding GTATextures methods
  installOverrides() {
    if (!window.GTATextures) return;

    window.GTATextures.createHighwayAsphalt = (lanes) => {
      return GTAUltraTextures.createUltraRealisticAsphalt(lanes);
    };

    window.GTATextures.createSidewalkPaver = () => {
      return GTAUltraTextures.createUltraRealisticSidewalk();
    };

    window.GTATextures.createSkyscraperFacade = (tint) => {
      return GTAUltraTextures.createUltraRealisticFacade(tint);
    };

    window.GTATextures.createLushGrass = () => {
      return GTAUltraTextures.createUltraRealisticGrass();
    };

    window.GTATextures.createAtmosphericSkyDome = () => {
      return GTAUltraTextures.createUltraRealisticSkyDome();
    };
  }
};

window.GTAUltraTextures = GTAUltraTextures;
