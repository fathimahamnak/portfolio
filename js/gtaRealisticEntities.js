// ========================================================
// PHOTOREALISTIC ENTITIES MODULE (REAL PEOPLE & REAL CARS)
// Replaces cartoon blocky pedestrians with anatomically detailed humans
// and replaces boxy traffic cars with photorealistic automotive models
// ========================================================

const GTARealisticEntities = {

  // Canvas texture cache for clothing and faces
  textureCache: {},

  // ----------------------------------------------------
  // PROCEDURAL TEXTURE GENERATORS
  // ----------------------------------------------------
  getHumanFaceTexture(tone = 'fair', gender = 'female') {
    const key = `face_${tone}_${gender}`;
    if (this.textureCache[key]) return this.textureCache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base skin tone
    let baseColor = '#f5d0b5';
    let blushColor = 'rgba(239, 140, 140, 0.28)';
    let lipColor = '#d9777f';
    let shadowColor = 'rgba(120, 80, 60, 0.15)';

    if (tone === 'tan') {
      baseColor = '#d49b6a';
      blushColor = 'rgba(180, 90, 70, 0.25)';
      lipColor = '#b45353';
      shadowColor = 'rgba(90, 50, 30, 0.2)';
    } else if (tone === 'deep') {
      baseColor = '#8d5534';
      blushColor = 'rgba(120, 50, 40, 0.2)';
      lipColor = '#70382b';
      shadowColor = 'rgba(40, 20, 10, 0.3)';
    } else if (tone === 'olive') {
      baseColor = '#e2b98e';
      blushColor = 'rgba(210, 110, 90, 0.22)';
      lipColor = '#c26262';
      shadowColor = 'rgba(100, 65, 45, 0.18)';
    }

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle skin noise / pores (fast 128x128 pattern)
    const nC = document.createElement('canvas');
    nC.width = 128; nC.height = 128;
    const nCtx = nC.getContext('2d');
    const nImg = nCtx.createImageData(128, 128);
    const nd = nImg.data;
    for (let i = 0; i < nd.length; i += 4) {
      const n = (Math.random() - 0.5) * 12;
      nd[i] = 128 + n; nd[i + 1] = 128 + n; nd[i + 2] = 128 + n; nd[i + 3] = 20;
    }
    nCtx.putImageData(nImg, 0, 0);
    ctx.drawImage(nC, 0, 0, 512, 512);

    // Forehead and cheek highlight
    const hlGrad = ctx.createRadialGradient(256, 180, 10, 256, 180, 160);
    hlGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    hlGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = hlGrad;
    ctx.fillRect(0, 0, 512, 512);

    // Cheeks blush
    const leftCheek = ctx.createRadialGradient(160, 290, 5, 160, 290, 65);
    leftCheek.addColorStop(0, blushColor);
    leftCheek.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = leftCheek;
    ctx.fillRect(90, 220, 140, 140);

    const rightCheek = ctx.createRadialGradient(352, 290, 5, 352, 290, 65);
    rightCheek.addColorStop(0, blushColor);
    rightCheek.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rightCheek;
    ctx.fillRect(282, 220, 140, 140);

    // Realistic Eyes
    const eyeY = 220;
    [-1, 1].forEach(side => {
      const ex = 256 + side * 85;

      // Eye shadow socket
      const socket = ctx.createRadialGradient(ex, eyeY, 5, ex, eyeY, 45);
      socket.addColorStop(0, shadowColor);
      socket.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = socket;
      ctx.beginPath();
      ctx.arc(ex, eyeY, 45, 0, Math.PI * 2);
      ctx.fill();

      // Eye sclera (white)
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.ellipse(ex, eyeY, 32, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Iris (warm brown / hazel)
      const irisGrad = ctx.createRadialGradient(ex, eyeY, 2, ex, eyeY, 14);
      irisGrad.addColorStop(0, '#1c1917');
      irisGrad.addColorStop(0.6, '#78350f');
      irisGrad.addColorStop(1, '#451a03');
      ctx.fillStyle = irisGrad;
      ctx.beginPath();
      ctx.arc(ex, eyeY, 14, 0, Math.PI * 2);
      ctx.fill();

      // Pupil
      ctx.fillStyle = '#09090b';
      ctx.beginPath();
      ctx.arc(ex, eyeY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Specular eye reflection dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ex - 4, eyeY - 4, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Eyelashes & Upper lid liner
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = gender === 'female' ? 4.5 : 2.5;
      ctx.beginPath();
      ctx.ellipse(ex, eyeY - 2, 33, 15, 0, Math.PI, Math.PI * 2);
      ctx.stroke();

      // Eyebrow
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = gender === 'female' ? 4 : 5.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      const browY = eyeY - 28;
      ctx.moveTo(ex - side * 36, browY + 4);
      ctx.quadraticCurveTo(ex, browY - 6, ex + side * 36, browY + 3);
      ctx.stroke();
    });

    // Nose bridge and soft nostrils
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(252, 215);
    ctx.lineTo(250, 280);
    ctx.lineTo(240, 295);
    ctx.quadraticCurveTo(256, 305, 272, 295);
    ctx.stroke();

    // Nostrils
    ctx.fillStyle = 'rgba(70, 35, 25, 0.45)';
    ctx.beginPath();
    ctx.ellipse(244, 297, 4.5, 3, -0.2, 0, Math.PI * 2);
    ctx.ellipse(268, 297, 4.5, 3, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Natural curved lips
    const lipY = 360;
    // Upper lip
    ctx.fillStyle = lipColor;
    ctx.beginPath();
    ctx.moveTo(215, lipY);
    ctx.quadraticCurveTo(240, lipY - 14, 256, lipY - 8);
    ctx.quadraticCurveTo(272, lipY - 14, 297, lipY);
    ctx.quadraticCurveTo(256, lipY + 4, 215, lipY);
    ctx.fill();

    // Lower lip
    const lowerGrad = ctx.createLinearGradient(256, lipY, 256, lipY + 18);
    lowerGrad.addColorStop(0, lipColor);
    lowerGrad.addColorStop(0.5, '#f472b6');
    lowerGrad.addColorStop(1, lipColor);
    ctx.fillStyle = lowerGrad;
    ctx.beginPath();
    ctx.moveTo(215, lipY);
    ctx.quadraticCurveTo(256, lipY + 24, 297, lipY);
    ctx.quadraticCurveTo(256, lipY + 2, 215, lipY);
    ctx.fill();

    // Lip center line
    ctx.strokeStyle = 'rgba(90, 30, 20, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(220, lipY);
    ctx.lineTo(292, lipY);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    this.textureCache[key] = tex;
    return tex;
  },

  // Denim jeans texture with seams
  getDenimTexture(color = '#1e3a8a') {
    const key = `denim_${color}`;
    if (this.textureCache[key]) return this.textureCache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 512, 512);

    // Diagonal twill weave
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    for (let i = -512; i < 1024; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 512, 512);
      ctx.stroke();
    }

    // Fabric noise (fast 128x128 pattern)
    const fnC = document.createElement('canvas');
    fnC.width = 128; fnC.height = 128;
    const fnCtx = fnC.getContext('2d');
    const fnImg = fnCtx.createImageData(128, 128);
    const fnd = fnImg.data;
    for (let i = 0; i < fnd.length; i += 4) {
      const n = (Math.random() - 0.5) * 18;
      fnd[i] = 128 + n; fnd[i + 1] = 128 + n; fnd[i + 2] = 128 + n; fnd[i + 3] = 30;
    }
    fnCtx.putImageData(fnImg, 0, 0);
    ctx.drawImage(fnC, 0, 0, 512, 512);

    // Gold/Orange denim stitching seams
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(40, 0); ctx.lineTo(40, 512);
    ctx.moveTo(472, 0); ctx.lineTo(472, 512);
    ctx.stroke();
    ctx.setLineDash([]);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    this.textureCache[key] = tex;
    return tex;
  },

  // Hoodie / Fabric texture with woven pattern and KTU/Campus logo
  getHoodieTexture(colorHex = '#0284c7', hasLogo = false) {
    const key = `hoodie_${colorHex}_${hasLogo}`;
    if (this.textureCache[key]) return this.textureCache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = colorHex;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle knit texture
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let y = 0; y < 512; y += 4) {
      ctx.fillRect(0, y, 512, 2);
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    for (let x = 0; x < 512; x += 4) {
      ctx.fillRect(x, 0, 2, 512);
    }

    if (hasLogo) {
      // Kangaroo pocket stitching
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 4;
      ctx.strokeRect(120, 260, 272, 180);

      // KTU / University emblem
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('KTU', 256, 170);
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('APJ ABDUL KALAM TECH UNIV', 256, 205);

      // Gold laurel wreath emblem
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(256, 160, 60, 0.4 * Math.PI, 1.6 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(256, 160, 60, 1.4 * Math.PI, 0.6 * Math.PI, true);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    this.textureCache[key] = tex;
    return tex;
  },

  // ----------------------------------------------------
  // 1. PHOTOREALISTIC HUMAN CHARACTER (PEDESTRIANS & STUDENTS)
  // ----------------------------------------------------
  createRealisticHuman(options = {}) {
    const {
      type = 'student', // 'student', 'business', 'casual', 'police'
      gender = Math.random() > 0.5 ? 'female' : 'male',
      skinTone = ['fair', 'tan', 'olive', 'deep'][Math.floor(Math.random() * 4)],
      clothingColor = 0x0284c7,
      pantsColor = 0x1e293b,
      hasBackpack = type === 'student',
      hasHeadphones = Math.random() < 0.35,
      hasPhone = Math.random() < 0.4
    } = options;

    const person = new THREE.Group();

    // Human Skin Material with realistic subsurface softness
    let skinColorHex = 0xf5d0b5;
    if (skinTone === 'tan') skinColorHex = 0xd49b6a;
    else if (skinTone === 'deep') skinColorHex = 0x8d5534;
    else if (skinTone === 'olive') skinColorHex = 0xe2b98e;

    const skinMat = new THREE.MeshStandardMaterial({
      color: skinColorHex,
      roughness: 0.6,
      metalness: 0.04
    });

    // Clothing Materials
    const denimTex = this.getDenimTexture(pantsColor === 0x1e293b ? '#1e293b' : '#1e3a8a');
    const pantsMat = new THREE.MeshStandardMaterial({
      map: denimTex,
      roughness: 0.8,
      metalness: 0.05
    });

    const isStudent = type === 'student';
    const isPolice = type === 'police';
    const isBusiness = type === 'business';

    const hexStr = '#' + (isPolice ? 0x0f172a : (isBusiness ? 0x1e293b : clothingColor)).toString(16).padStart(6, '0');
    const topTex = isStudent ? this.getHoodieTexture(hexStr, true) : null;

    const topMat = new THREE.MeshStandardMaterial({
      map: topTex,
      color: topTex ? 0xffffff : (isPolice ? 0x0f172a : (isBusiness ? 0x1e293b : clothingColor)),
      roughness: 0.65,
      metalness: isBusiness ? 0.15 : 0.05
    });

    const shoeMat = new THREE.MeshStandardMaterial({
      color: isBusiness ? 0x09090b : 0xf8fafc,
      roughness: isBusiness ? 0.35 : 0.5,
      metalness: 0.08
    });
    const soleMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.9,
      metalness: 0.02
    });

    // Natural Hair Materials
    const hairColors = [0x09090b, 0x1c1917, 0x27272a, 0x451a03, 0x78350f];
    const hairMat = new THREE.MeshStandardMaterial({
      color: hairColors[Math.floor(Math.random() * hairColors.length)],
      roughness: 0.85,
      metalness: 0.1
    });

    // ----------------------------------------------------
    // TORSO & UPPER BODY (Realistic anatomical curvature)
    // ----------------------------------------------------
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 8.5;

    // Sculpted chest/torso with trapezoidal taper
    const chestGeo = new THREE.CylinderGeometry(
      gender === 'female' ? 1.7 : 1.95,
      gender === 'female' ? 1.4 : 1.65,
      5.2,
      12
    );
    const chest = new THREE.Mesh(chestGeo, topMat);
    chest.scale.set(1.1, 1, 0.75); // Flatten front-to-back for human ribcage
    chest.castShadow = true;
    torsoGroup.add(chest);

    // Business Collared Shirt & Tie
    if (isBusiness) {
      const shirtMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
      const tieMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5 });
      const collar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.8, 0.4), shirtMat);
      collar.position.set(0, 0.7, 0.95);
      torsoGroup.add(collar);

      const tie = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.2, 0.2), tieMat);
      tie.position.set(0, 0.3, 1.15);
      torsoGroup.add(tie);
    }

    // Police Badge & Radio
    if (isPolice) {
      // Gold Police Shield Badge
      const badgeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.1 });
      const badge = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.15), badgeMat);
      badge.position.set(-0.9, 1.2, 0.96);
      torsoGroup.add(badge);

      // Shoulder Police Epaulets
      [-1.8, 1.8].forEach(ex => {
        const epaulet = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 1.4), topMat);
        epaulet.position.set(ex, 2.6, 0);
        torsoGroup.add(epaulet);
      });

      // Duty Belt with Radio and Handcuff Pouch
      const beltMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.4 });
      const dutyBelt = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 0.6, 12), beltMat);
      dutyBelt.scale.set(1.12, 1, 0.78);
      dutyBelt.position.y = -2.4;
      torsoGroup.add(dutyBelt);

      // Radio Walkie-Talkie on chest
      const radio = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.2, 0.4), beltMat);
      radio.position.set(0.9, 1.0, 0.95);
      torsoGroup.add(radio);
      const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 4), beltMat);
      antenna.position.set(0.9, 1.8, 0.95);
      torsoGroup.add(antenna);
    }

    // Belt for regular clothing
    if (!isPolice) {
      const belt = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 0.4, 12),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 })
      );
      belt.scale.set(1.12, 1, 0.78);
      belt.position.y = -2.4;
      torsoGroup.add(belt);

      // Belt buckle
      const buckle = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.35, 0.1),
        new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.2 })
      );
      buckle.position.set(0, -2.4, 1.15);
      torsoGroup.add(buckle);
    }

    // ----------------------------------------------------
    // NECK & HEAD (Contoured with real face decal)
    // ----------------------------------------------------
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, 1.4, 10), skinMat);
    neck.position.y = 3.1;
    torsoGroup.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.y = 4.4;

    // Sculpted head
    const headGeo = new THREE.SphereGeometry(1.45, 16, 16);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.scale.set(0.92, 1.15, 1.0);
    head.castShadow = true;
    headGroup.add(head);

    // Chin contour
    const chin = new THREE.Mesh(new THREE.SphereGeometry(0.6, 10, 10), skinMat);
    chin.scale.set(0.85, 0.7, 0.9);
    chin.position.set(0, -1.1, 0.75);
    headGroup.add(chin);

    // Nose 3D profile
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.65, 8), skinMat);
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, -0.05, 1.55);
    headGroup.add(nose);

    // Realistic Face Decal Texture
    const faceTex = this.getHumanFaceTexture(skinTone, gender);
    const faceMat = new THREE.MeshBasicMaterial({
      map: faceTex,
      transparent: true
    });
    const facePlane = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 2.3), faceMat);
    facePlane.position.set(0, 0, 1.48);
    headGroup.add(facePlane);

    // Ears
    [-1, 1].forEach(side => {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), skinMat);
      ear.scale.set(0.4, 1.1, 0.8);
      ear.position.set(side * 1.35, 0, 0.05);
      headGroup.add(ear);
    });

    // ----------------------------------------------------
    // 3D HAIRSTYLES (Multiple distinct realistic cuts)
    // ----------------------------------------------------
    if (isPolice) {
      // Peaked Police Officer Cap
      const capMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.4 });
      const capCrown = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.3, 0.8, 14), capMat);
      capCrown.position.set(0, 1.3, 0);
      headGroup.add(capCrown);

      const capVisor = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.15, 14, 1, false, 0, Math.PI), capMat);
      capVisor.rotation.y = -Math.PI / 2;
      capVisor.rotation.x = 0.2;
      capVisor.position.set(0, 1.0, 0.6);
      headGroup.add(capVisor);

      const goldBand = new THREE.Mesh(
        new THREE.CylinderGeometry(1.35, 1.35, 0.2, 14),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 })
      );
      goldBand.position.set(0, 1.0, 0);
      headGroup.add(goldBand);
    } else if (gender === 'female') {
      const femaleHairStyle = Math.floor(Math.random() * 3);

      if (femaleHairStyle === 0) {
        // Long wavy locks
        const hairCrown = new THREE.Mesh(new THREE.SphereGeometry(1.58, 14, 14), hairMat);
        hairCrown.position.set(0, 0.35, -0.15);
        headGroup.add(hairCrown);

        // Side hair locks flowing down over shoulders
        [-0.85, 0.85].forEach(hx => {
          const lock = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.25, 3.8, 8), hairMat);
          lock.position.set(hx, -1.0, 0.5);
          lock.rotation.z = hx > 0 ? -0.12 : 0.12;
          headGroup.add(lock);
        });

        // Back hair curtain
        const backHair = new THREE.Mesh(new THREE.BoxGeometry(2.0, 3.5, 0.6), hairMat);
        backHair.position.set(0, -1.0, -1.2);
        headGroup.add(backHair);
      } else if (femaleHairStyle === 1) {
        // High Ponytail / Top Bun
        const hairCrown = new THREE.Mesh(new THREE.SphereGeometry(1.55, 14, 14), hairMat);
        hairCrown.position.set(0, 0.3, -0.15);
        headGroup.add(hairCrown);

        const bun = new THREE.Mesh(new THREE.SphereGeometry(0.75, 10, 10), hairMat);
        bun.position.set(0, 1.2, -1.1);
        headGroup.add(bun);
      } else {
        // Modern Chic Bob Cut
        const hairBob = new THREE.Mesh(new THREE.SphereGeometry(1.62, 14, 14), hairMat);
        hairBob.scale.set(1.0, 1.15, 1.05);
        hairBob.position.set(0, 0.1, -0.1);
        headGroup.add(hairBob);
      }
    } else {
      // Male Hairstyles: Textured fade / Pompadour
      const hairCrown = new THREE.Mesh(new THREE.SphereGeometry(1.52, 14, 14), hairMat);
      hairCrown.scale.set(0.95, 1.1, 0.95);
      hairCrown.position.set(0, 0.5, -0.05);
      headGroup.add(hairCrown);

      // Hair sweep
      const quiff = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 1.4), hairMat);
      quiff.position.set(0, 1.45, 0.4);
      quiff.rotation.x = -0.25;
      headGroup.add(quiff);
    }

    // Over-ear DJ / Student Headphones
    if (hasHeadphones) {
      const hpMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.3, metalness: 0.6 });
      const band = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.12, 8, 16, Math.PI), hpMat);
      band.rotation.z = Math.PI;
      band.position.set(0, 0.35, 0);
      headGroup.add(band);

      [-1.5, 1.5].forEach(hx => {
        const earpad = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 10), hpMat);
        earpad.rotation.z = Math.PI / 2;
        earpad.position.set(hx, 0.0, 0);
        headGroup.add(earpad);
      });
    }

    torsoGroup.add(headGroup);

    // ----------------------------------------------------
    // ARMS & HANDS (Articulated swingable groups)
    // ----------------------------------------------------
    const armGeo = new THREE.CylinderGeometry(0.48, 0.4, 4.4, 10);
    const handGeo = new THREE.SphereGeometry(0.42, 8, 8);

    // Left Arm Group
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-2.0, 2.0, 0);
    const leftArmMesh = new THREE.Mesh(armGeo, topMat);
    leftArmMesh.position.y = -2.0;
    leftArmMesh.castShadow = true;
    leftArmGroup.add(leftArmMesh);

    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.scale.set(0.7, 1.1, 0.85);
    leftHand.position.y = -4.2;
    leftArmGroup.add(leftHand);

    // Wristwatch on left wrist
    const watch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.46, 0.46, 0.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x09090b, metalness: 0.8, roughness: 0.2 })
    );
    watch.position.y = -3.8;
    leftArmGroup.add(watch);

    torsoGroup.add(leftArmGroup);

    // Right Arm Group
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(2.0, 2.0, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, topMat);
    rightArmMesh.position.y = -2.0;
    rightArmMesh.castShadow = true;
    rightArmGroup.add(rightArmMesh);

    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.scale.set(0.7, 1.1, 0.85);
    rightHand.position.y = -4.2;
    rightArmGroup.add(rightHand);

    // Mobile Phone in Right Hand
    if (hasPhone) {
      const phoneMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2, metalness: 0.8 });
      const phone = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 0.12), phoneMat);
      phone.position.set(0.1, -4.2, 0.4);
      phone.rotation.x = -0.4;
      rightArmGroup.add(phone);

      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(0.42, 0.78),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
      );
      screen.position.set(0.1, -4.2, 0.47);
      screen.rotation.x = -0.4;
      rightArmGroup.add(screen);
    }

    torsoGroup.add(rightArmGroup);

    // ----------------------------------------------------
    // STUDENT BACKPACK (Realistic 3D twin straps)
    // ----------------------------------------------------
    if (hasBackpack) {
      const packMat = new THREE.MeshStandardMaterial({
        color: 0x0369a1,
        roughness: 0.75,
        metalness: 0.1
      });
      const pack = new THREE.Mesh(new THREE.BoxGeometry(2.8, 4.2, 1.8), packMat);
      pack.position.set(0, 0.2, -1.6);
      pack.castShadow = true;
      torsoGroup.add(pack);

      // Front zipper pocket
      const frontPocket = new THREE.Mesh(new THREE.BoxGeometry(2.3, 2.2, 0.8), packMat);
      frontPocket.position.set(0, -0.6, -2.5);
      torsoGroup.add(frontPocket);

      // Shoulder straps
      const strapMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
      [-1.0, 1.0].forEach(sx => {
        const strap = new THREE.Mesh(new THREE.BoxGeometry(0.45, 4.8, 0.2), strapMat);
        strap.position.set(sx, 0.2, 0.9);
        torsoGroup.add(strap);
      });
    }

    person.add(torsoGroup);

    // ----------------------------------------------------
    // LEGS & REALISTIC SHOES (Articulated swingable groups)
    // ----------------------------------------------------
    const legGeo = new THREE.CylinderGeometry(0.62, 0.48, 6.0, 10);

    // Left Leg Group
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.95, 6.0, 0);

    const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
    leftLegMesh.position.y = -3.0;
    leftLegMesh.castShadow = true;
    leftLegGroup.add(leftLegMesh);

    // Left Shoe / Sneaker
    const leftShoe = new THREE.Group();
    leftShoe.position.set(0, -6.0, 0.3);

    const leftSole = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 2.6), soleMat);
    leftSole.position.y = 0.2;
    leftShoe.add(leftSole);

    const leftUpper = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.8, 2.4), shoeMat);
    leftUpper.position.set(0, 0.7, 0);
    leftShoe.add(leftUpper);

    // Toe box curvature
    const leftToe = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), shoeMat);
    leftToe.scale.set(1.0, 0.6, 1.1);
    leftToe.position.set(0, 0.6, 0.9);
    leftShoe.add(leftToe);

    leftLegGroup.add(leftShoe);
    person.add(leftLegGroup);

    // Right Leg Group
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.95, 6.0, 0);

    const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
    rightLegMesh.position.y = -3.0;
    rightLegMesh.castShadow = true;
    rightLegGroup.add(rightLegMesh);

    // Right Shoe / Sneaker
    const rightShoe = new THREE.Group();
    rightShoe.position.set(0, -6.0, 0.3);

    const rightSole = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 2.6), soleMat);
    rightSole.position.y = 0.2;
    rightShoe.add(rightSole);

    const rightUpper = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.8, 2.4), shoeMat);
    rightUpper.position.set(0, 0.7, 0);
    rightShoe.add(rightUpper);

    const rightToe = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), shoeMat);
    rightToe.scale.set(1.0, 0.6, 1.1);
    rightToe.position.set(0, 0.6, 0.9);
    rightShoe.add(rightToe);

    rightLegGroup.add(rightShoe);
    person.add(rightLegGroup);

    // Provide pivots for walking animation in gameEngine.js
    person.userData = {
      leftLeg: leftLegGroup,
      rightLeg: rightLegGroup,
      leftArm: leftArmGroup,
      rightArm: rightArmGroup
    };

    return person;
  },

  // ----------------------------------------------------
  // 2. PHOTOREALISTIC VEHICLES (SEDANS, SUVS, TAXIS, POLICE)
  // ----------------------------------------------------
  createRealisticVehicle(type = 'sedan', colorHex = 0x1e3a8a, envMap = null) {
    const car = new THREE.Group();

    // 1. High-Gloss Metallic Automotive Paint (MeshPhysicalMaterial with PBR reflections)
    const paintMat = new THREE.MeshPhysicalMaterial({
      color: type === 'taxi' ? 0xeab308 : (type === 'police' ? 0x09090b : colorHex),
      metalness: 0.88,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      envMap: envMap,
      envMapIntensity: 1.6,
      reflectivity: 0.95
    });

    const whitePolicePaint = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 0.9,
      envMap: envMap,
      envMapIntensity: 1.2
    });

    // Dark Tinted Automotive Glass
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x081528,
      metalness: 0.95,
      roughness: 0.05,
      transparent: true,
      opacity: 0.85,
      clearcoat: 0.9,
      envMap: envMap,
      envMapIntensity: 1.8
    });

    // Chrome and Aluminum trim
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.98,
      roughness: 0.08,
      envMap: envMap,
      envMapIntensity: 1.5
    });

    // Textured Rubber Tire
    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.9,
      metalness: 0.1
    });

    // Silver Alloy Rim
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.92,
      roughness: 0.18,
      envMap: envMap,
      envMapIntensity: 1.2
    });

    // Red Brembo Brake Caliper
    const caliperMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.5, roughness: 0.3 });

    // Plastic / Underbody
    const plasticMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.7, metalness: 0.2 });

    // Lights
    const headlightLensMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.05,
      transparent: true,
      opacity: 0.9
    });
    const headlightGlowMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const taillightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

    // ----------------------------------------------------
    // CHASSIS MEASUREMENTS BASED ON VEHICLE TYPE
    // ----------------------------------------------------
    let width = 16.0;
    let length = 34.0;
    let height = 3.8;
    let groundClearance = 2.2;
    let cabinLength = 17.0;
    let cabinHeight = 4.6;

    if (type === 'suv') {
      width = 17.2;
      length = 36.0;
      height = 4.8;
      groundClearance = 3.0;
      cabinLength = 22.0;
      cabinHeight = 5.6;
    } else if (type === 'van') {
      width = 16.8;
      length = 38.0;
      height = 5.2;
      groundClearance = 2.4;
      cabinLength = 26.0;
      cabinHeight = 7.2;
    }

    // Lower Main Body Tub
    const bodyGeo = new THREE.BoxGeometry(width, height, length);
    const body = new THREE.Mesh(bodyGeo, paintMat);
    body.position.y = groundClearance + height / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    car.add(body);

    // Front Sloping Hood / Nose
    const hoodLength = (length - cabinLength) / 2 + 1;
    const hoodGeo = new THREE.BoxGeometry(width - 0.6, height * 0.75, hoodLength);
    const hood = new THREE.Mesh(hoodGeo, paintMat);
    hood.position.set(0, groundClearance + height * 0.9, length / 2 - hoodLength / 2);
    hood.rotation.x = 0.08;
    hood.castShadow = true;
    car.add(hood);

    // Aerodynamic Radiator Front Grille
    const grille = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.65, height * 0.6, 1.2),
      plasticMat
    );
    grille.position.set(0, groundClearance + height * 0.6, length / 2 + 0.2);
    car.add(grille);

    // Front Chrome Brand Emblem
    const emblem = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.2, 16), chromeMat);
    emblem.rotation.x = Math.PI / 2;
    emblem.position.set(0, groundClearance + height * 0.65, length / 2 + 0.85);
    car.add(emblem);

    // Projector LED Headlights (Left & Right)
    [-1, 1].forEach(side => {
      const hx = side * (width * 0.38);
      const hlCase = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.6, 1.2), plasticMat);
      hlCase.position.set(hx, groundClearance + height * 0.75, length / 2 + 0.1);
      car.add(hlCase);

      const hlBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.5, 12), headlightGlowMat);
      hlBeam.rotation.x = Math.PI / 2;
      hlBeam.position.set(hx, groundClearance + height * 0.75, length / 2 + 0.6);
      car.add(hlBeam);

      const hlLens = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 1.5), headlightLensMat);
      hlLens.position.set(hx, groundClearance + height * 0.75, length / 2 + 0.65);
      car.add(hlLens);
    });

    // ----------------------------------------------------
    // GREENHOUSE CABIN & WINDOWS (Sleek A/B/C Pillars)
    // ----------------------------------------------------
    const cabinY = groundClearance + height + cabinHeight / 2 - 0.4;
    const cabinZ = -1.5;

    // Glass Canopy
    const cabinGlass = new THREE.Mesh(
      new THREE.BoxGeometry(width - 1.2, cabinHeight, cabinLength),
      glassMat
    );
    cabinGlass.position.set(0, cabinY, cabinZ);
    cabinGlass.castShadow = true;
    car.add(cabinGlass);

    // Metallic Roof Panel
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(width - 2.0, 0.6, cabinLength - 2.0),
      paintMat
    );
    roof.position.set(0, cabinY + cabinHeight / 2 + 0.1, cabinZ);
    roof.castShadow = true;
    car.add(roof);

    // Side Pillars (A-Pillars & B-Pillars in body paint / matte black)
    [-1, 1].forEach(side => {
      const px = side * (width / 2 - 0.5);

      // Sloping A-Pillar (Front windshield post)
      const aPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, cabinHeight * 1.3, 8), paintMat);
      aPillar.rotation.x = 0.55;
      aPillar.position.set(px, cabinY, cabinZ + cabinLength / 2 - 1.2);
      car.add(aPillar);

      // Center B-Pillar
      const bPillar = new THREE.Mesh(new THREE.BoxGeometry(0.3, cabinHeight, 0.9), plasticMat);
      bPillar.position.set(px, cabinY, cabinZ);
      car.add(bPillar);

      // Side View Mirrors with LED Turn Indicator
      const mirror = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 1.2), paintMat);
      mirror.position.set(side * (width / 2 + 0.8), cabinY - 0.6, cabinZ + cabinLength / 2 - 1.5);
      car.add(mirror);

      const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.8), chromeMat);
      mirrorGlass.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
      mirrorGlass.position.set(side * (width / 2 + 0.8) - side * 0.7, cabinY - 0.6, cabinZ + cabinLength / 2 - 1.5);
      car.add(mirrorGlass);
    });

    // ----------------------------------------------------
    // REAR BUMPER, TAILLIGHTS & EXHAUST
    // ----------------------------------------------------
    // Full-width modern LED Taillight Bar
    const taillightBar = new THREE.Mesh(
      new THREE.BoxGeometry(width - 1.6, 1.4, 0.8),
      taillightMat
    );
    taillightBar.position.set(0, groundClearance + height * 0.8, -length / 2 - 0.2);
    car.add(taillightBar);

    // Dual Chrome Exhaust Tips
    [-3.8, 3.8].forEach(ex => {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 1.2, 12), chromeMat);
      pipe.rotation.x = Math.PI / 2;
      pipe.position.set(ex, groundClearance + 0.7, -length / 2 - 0.4);
      car.add(pipe);

      // Dark interior
      const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 1.25, 12), plasticMat);
      inner.rotation.x = Math.PI / 2;
      inner.position.set(ex, groundClearance + 0.7, -length / 2 - 0.45);
      car.add(inner);
    });

    // Rear License Plate ("SAN ANDREAS • KTU 2026")
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 2.2, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
    );
    plate.position.set(0, groundClearance + height * 0.35, -length / 2 - 0.25);
    car.add(plate);

    // Front License Plate
    const frontPlate = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 2.2, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
    );
    frontPlate.position.set(0, groundClearance + height * 0.25, length / 2 + 0.25);
    car.add(frontPlate);

    // ----------------------------------------------------
    // 4 REALISTIC ALLOY WHEELS (5-SPOKE RIMS & BRAKES)
    // ----------------------------------------------------
    const wheelRadius = type === 'suv' ? 3.4 : 3.0;
    const wheelWidth = 2.2;
    const wheelbaseZ = length * 0.32;
    const trackX = width / 2;

    [
      [-trackX, wheelRadius, wheelbaseZ],
      [trackX, wheelRadius, wheelbaseZ],
      [-trackX, wheelRadius, -wheelbaseZ],
      [trackX, wheelRadius, -wheelbaseZ]
    ].forEach(wPos => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(wPos[0], wPos[1], wPos[2]);

      // Rubber Tire with tread profile
      const tire = new THREE.Mesh(
        new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 24),
        tireMat
      );
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      // Silver Rim Lip
      const rimLip = new THREE.Mesh(
        new THREE.CylinderGeometry(wheelRadius * 0.76, wheelRadius * 0.76, wheelWidth + 0.1, 20),
        rimMat
      );
      rimLip.rotation.z = Math.PI / 2;
      wheelGroup.add(rimLip);

      // Center Hub Cap
      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(wheelRadius * 0.25, wheelRadius * 0.25, wheelWidth + 0.15, 12),
        chromeMat
      );
      hub.rotation.z = Math.PI / 2;
      wheelGroup.add(hub);

      // 5 Sculpted Alloy Spokes
      for (let s = 0; s < 5; s++) {
        const spoke = new THREE.Mesh(
          new THREE.BoxGeometry(0.4, wheelRadius * 0.65, 0.6),
          rimMat
        );
        spoke.rotation.x = (s * Math.PI * 2) / 5;
        spoke.position.x = wPos[0] > 0 ? wheelWidth / 2 - 0.2 : -wheelWidth / 2 + 0.2;
        wheelGroup.add(spoke);
      }

      // Brake Rotor Disc & Brembo Caliper behind spokes
      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(wheelRadius * 0.6, wheelRadius * 0.6, 0.4, 16),
        chromeMat
      );
      disc.rotation.z = Math.PI / 2;
      disc.position.x = wPos[0] > 0 ? 0.3 : -0.3;
      wheelGroup.add(disc);

      const caliper = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, wheelRadius * 0.4, 0.8),
        caliperMat
      );
      caliper.position.set(wPos[0] > 0 ? 0.3 : -0.3, wheelRadius * 0.35, 0);
      wheelGroup.add(caliper);

      car.add(wheelGroup);
    });

    // ----------------------------------------------------
    // SPECIAL VEHICLE ADD-ONS (TAXI, POLICE, SUV ROOF RAILS)
    // ----------------------------------------------------
    if (type === 'taxi') {
      // Illuminated Rooftop TAXI Sign
      const taxiSignMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.2,
        emissive: 0xfef08a,
        emissiveIntensity: 0.6
      });
      const taxiPod = new THREE.Mesh(new THREE.BoxGeometry(6.0, 1.8, 2.2), taxiSignMat);
      taxiPod.position.set(0, cabinY + cabinHeight / 2 + 1.2, cabinZ);
      car.add(taxiPod);

      const podBase = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.3, 2.6), plasticMat);
      podBase.position.set(0, cabinY + cabinHeight / 2 + 0.3, cabinZ);
      car.add(podBase);

      // Checkered Taxi Side Decals
      [-1, 1].forEach(side => {
        const checkCanvas = document.createElement('canvas');
        checkCanvas.width = 256; checkCanvas.height = 32;
        const cctx = checkCanvas.getContext('2d');
        cctx.fillStyle = '#ffffff';
        cctx.fillRect(0, 0, 256, 32);
        cctx.fillStyle = '#09090b';
        for (let x = 0; x < 256; x += 32) {
          cctx.fillRect(x, 0, 16, 16);
          cctx.fillRect(x + 16, 16, 16, 16);
        }
        const checkTex = new THREE.CanvasTexture(checkCanvas);
        const checkMat = new THREE.MeshBasicMaterial({ map: checkTex });
        const checkPlane = new THREE.Mesh(new THREE.PlaneGeometry(16, 1.6), checkMat);
        checkPlane.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
        checkPlane.position.set(side * (width / 2 + 0.05), groundClearance + height * 0.65, 0);
        car.add(checkPlane);
      });
    } else if (type === 'police') {
      // White Doors & White Roof for authentic Black & White police cruiser
      const whiteDoorGeo = new THREE.BoxGeometry(width + 0.1, height * 0.9, cabinLength * 0.7);
      const whiteDoors = new THREE.Mesh(whiteDoorGeo, whitePolicePaint);
      whiteDoors.position.set(0, groundClearance + height / 2 + 0.2, cabinZ);
      car.add(whiteDoors);

      // Heavy-Duty Front Steel Push-Bumper (Bull-bar)
      const pushBar = new THREE.Mesh(new THREE.BoxGeometry(width * 0.85, height * 0.95, 2.0), plasticMat);
      pushBar.position.set(0, groundClearance + height * 0.6, length / 2 + 1.4);
      pushBar.castShadow = true;
      car.add(pushBar);

      // Dual front rubber push pads
      [-3.0, 3.0].forEach(px => {
        const pad = new THREE.Mesh(new THREE.BoxGeometry(1.2, height * 1.2, 1.2), plasticMat);
        pad.position.set(px, groundClearance + height * 0.6, length / 2 + 2.2);
        car.add(pad);
      });

      // Rooftop Aerodynamic LED Emergency Lightbar (Alternating Red and Blue Strobe)
      const redStrobe = new THREE.Mesh(
        new THREE.BoxGeometry(5.5, 1.4, 2.4),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      redStrobe.position.set(-3.2, cabinY + cabinHeight / 2 + 1.0, cabinZ);
      car.add(redStrobe);

      const blueStrobe = new THREE.Mesh(
        new THREE.BoxGeometry(5.5, 1.4, 2.4),
        new THREE.MeshBasicMaterial({ color: 0x3b82f6 })
      );
      blueStrobe.position.set(3.2, cabinY + cabinHeight / 2 + 1.0, cabinZ);
      car.add(blueStrobe);

      car.userData.policeRedStrobe = redStrobe;
      car.userData.policeBlueStrobe = blueStrobe;

      // Spotlight on Driver A-Pillar
      const spot = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.0, 10), chromeMat);
      spot.rotation.z = Math.PI / 2;
      spot.position.set(-width / 2 - 0.8, cabinY, cabinZ + cabinLength / 2 - 1.2);
      car.add(spot);
    } else if (type === 'suv') {
      // Aluminum Roof Rails
      [-width / 2 + 1.6, width / 2 - 1.6].forEach(rx => {
        const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, cabinLength * 0.8, 8), chromeMat);
        rail.rotation.x = Math.PI / 2;
        rail.position.set(rx, cabinY + cabinHeight / 2 + 0.6, cabinZ);
        car.add(rail);
      });
    }

    // Attach taillight reference for brake light reaction in gameEngine.js
    car.userData.taillightMesh = taillightBar;

    return car;
  },

  // ----------------------------------------------------
  // 3. ROAD INTERSECTIONS, CROSSWALKS & TRAFFIC LIGHTS
  // ----------------------------------------------------
  createIntersectionCrosswalk(width = 120, zPos = 0) {
    const crosswalkGroup = new THREE.Group();

    // High-contrast white thermal pedestrian zebra stripes
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xf1f5f9 });
    const numStripes = 18;
    const stripeWidth = 3.2;
    const stripeSpacing = 5.8;

    [-12, 12].forEach(offsetZ => {
      for (let i = 0; i < numStripes; i++) {
        const x = -width / 2 + 10 + i * stripeSpacing;
        const stripe = new THREE.Mesh(
          new THREE.PlaneGeometry(stripeWidth, 14),
          stripeMat
        );
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(x, 0.42, zPos + offsetZ);
        crosswalkGroup.add(stripe);
      }
    });

    // Solid stop bar for vehicles before the crosswalk
    [-24, 24].forEach(stopZ => {
      const stopLine = new THREE.Mesh(
        new THREE.PlaneGeometry(width * 0.85, 2.5),
        stripeMat
      );
      stopLine.rotation.x = -Math.PI / 2;
      stopLine.position.set(0, 0.42, zPos + stopZ);
      crosswalkGroup.add(stopLine);
    });

    return crosswalkGroup;
  },

  // 3D Traffic Light Gantry with real Red/Yellow/Green signal heads
  createTrafficSignalPole(x = 64, z = 0, isEastWest = false) {
    const signal = new THREE.Group();
    signal.position.set(x, 0, z);

    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25
    });
    const yellowHousingMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04,
      metalness: 0.3,
      roughness: 0.4
    });

    // Vertical Mast Pole
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.1, 32, 12), metalMat);
    mast.position.y = 16;
    mast.castShadow = true;
    signal.add(mast);

    // Horizontal Overhead Arm extending across highway lane
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 35, 10), metalMat);
    arm.rotation.z = Math.PI / 2;
    arm.position.set(x > 0 ? -17 : 17, 30, 0);
    signal.add(arm);

    // Overhead 3-Aspect Traffic Signal Head (Green, Amber, Red)
    [x > 0 ? -14 : 14, x > 0 ? -28 : 28].forEach(sigX => {
      const sigBox = new THREE.Mesh(new THREE.BoxGeometry(2.2, 6.5, 2.0), yellowHousingMat);
      sigBox.position.set(sigX, 29, 0);
      signal.add(sigBox);

      // Red, Amber, Green circular light lenses with sun visors
      const colors = [0xef4444, 0xf59e0b, 0x10b981];
      colors.forEach((col, idx) => {
        const lens = new THREE.Mesh(
          new THREE.CylinderGeometry(0.65, 0.65, 0.3, 12),
          new THREE.MeshBasicMaterial({ color: col })
        );
        lens.rotation.x = Math.PI / 2;
        lens.position.set(sigX, 31 - idx * 1.8, 1.05);
        signal.add(lens);

        // Sun hood visor
        const visor = new THREE.Mesh(
          new THREE.CylinderGeometry(0.75, 0.75, 0.5, 8, 1, false, 0, Math.PI),
          metalMat
        );
        visor.rotation.x = Math.PI / 2;
        visor.rotation.z = Math.PI;
        visor.position.set(sigX, 31.4 - idx * 1.8, 1.1);
        signal.add(visor);
      });
    });

    // Street Name Sign on mast (e.g. "GRAND AVE / METROPOLIS PKWY")
    const signPlate = new THREE.Mesh(
      new THREE.BoxGeometry(14, 2.5, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.3 })
    );
    signPlate.position.set(x > 0 ? -7 : 7, 24, 0);
    signal.add(signPlate);

    if (isEastWest) {
      signal.rotation.y = Math.PI / 2;
    }

    return signal;
  },

  // ========================================================
  // VEHICLE FACTORY SUITE: VARIETY OF REALISTIC 3D VEHICLES
  // ========================================================

  // 1. LOS SANTOS FIRE RESCUE HEAVY ENGINE TRUCK
  createFireEngineTruck(envMap = null) {
    const truck = new THREE.Group();
    const redMat = new THREE.MeshPhysicalMaterial({ color: 0xdc2626, metalness: 0.85, roughness: 0.18, clearcoat: 1.0, envMap, envMapIntensity: 1.5 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.2 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.08, metalness: 0.98, envMap, envMapIntensity: 1.8 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x081528, roughness: 0.05, metalness: 0.9, transparent: true, opacity: 0.85, envMap });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9, metalness: 0.1 });
    const yellowStripe = new THREE.MeshBasicMaterial({ color: 0xfacc15 });

    // Main Cab & Equipment Body
    const cab = new THREE.Mesh(new THREE.BoxGeometry(8.6, 7.2, 9.5), redMat);
    cab.position.set(0, 4.8, 6.8);
    cab.castShadow = true; truck.add(cab);

    const cabRoof = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.8, 9.2), whiteMat);
    cabRoof.position.set(0, 8.8, 6.8);
    truck.add(cabRoof);

    // Rear Apparatus Body with Chrome Equipment Roll-up Doors
    const rearBody = new THREE.Mesh(new THREE.BoxGeometry(8.6, 7.5, 14.5), redMat);
    rearBody.position.set(0, 4.95, -5.2);
    rearBody.castShadow = true; truck.add(rearBody);

    // Roll-up Aluminum Equipment Doors (Left & Right sides)
    [-4.35, 4.35].forEach(sideX => {
      [-9, -5, -1].forEach(doorZ => {
        const door = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 5.2), chromeMat);
        door.position.set(sideX, 5.0, doorZ);
        door.rotation.y = sideX > 0 ? Math.PI / 2 : -Math.PI / 2;
        truck.add(door);
      });
    });

    // Front Slatted Chrome Grille & Heavy Bumper
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(9.2, 1.8, 1.4), chromeMat);
    bumper.position.set(0, 1.8, 11.8);
    truck.add(bumper);

    const grille = new THREE.Mesh(new THREE.BoxGeometry(6.4, 3.2, 0.4), chromeMat);
    grille.position.set(0, 4.2, 11.6);
    truck.add(grille);

    // Quad Projector Headlights
    [-3.2, 3.2].forEach(hx => {
      const hl = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.4, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      hl.rotation.x = Math.PI / 2;
      hl.position.set(hx, 4.2, 11.7);
      truck.add(hl);
    });

    // Windshield & Side Windows
    const windshield = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 3.0), glassMat);
    windshield.position.set(0, 6.8, 11.6);
    windshield.rotation.x = -0.15;
    truck.add(windshield);

    // Dual Rooftop Extendable Aluminum Aerial Ladder
    const ladderGroup = new THREE.Group();
    [-1.2, 1.2].forEach(lx => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 17.5), chromeMat);
      rail.position.set(lx, 0, 0);
      ladderGroup.add(rail);
    });
    for (let rz = -8; rz <= 8; rz += 1.4) {
      const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.4, 8), chromeMat);
      rung.rotation.z = Math.PI / 2;
      rung.position.set(0, 0, rz);
      ladderGroup.add(rung);
    }
    ladderGroup.position.set(0, 9.4, -4.5);
    truck.add(ladderGroup);

    // Rooftop Emergency Strobe Lightbars (Red & Blue Flashing)
    const strobeBar = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.7, 1.2), chromeMat);
    strobeBar.position.set(0, 9.5, 9.0);
    truck.add(strobeBar);

    const redStrobe = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.8, 1.1), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    redStrobe.position.set(-1.8, 9.6, 9.0);
    truck.add(redStrobe);

    const blueStrobe = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.8, 1.1), new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));
    blueStrobe.position.set(1.8, 9.6, 9.0);
    truck.add(blueStrobe);

    // High-Pressure Water Monitor Cannon
    const cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 2.8, 8), chromeMat);
    cannon.rotation.x = 0.5;
    cannon.position.set(0, 10.2, 5.0);
    truck.add(cannon);

    // Rear Safety Chevrons
    const chevron = new THREE.Mesh(new THREE.BoxGeometry(8.4, 1.4, 0.2), yellowStripe);
    chevron.position.set(0, 3.2, -12.5);
    truck.add(chevron);

    // Heavy Duty Wheels (6 Wheels: 2 Front, 4 Rear Duals)
    const wheelPositions = [
      [-4.3, 2.2, 7.2], [4.3, 2.2, 7.2],      // Front Steer Axle
      [-4.5, 2.2, -4.2], [4.5, 2.2, -4.2],    // Rear Drive Axle 1
      [-4.5, 2.2, -8.6], [4.5, 2.2, -8.6]     // Rear Drive Axle 2
    ];
    wheelPositions.forEach(wp => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 1.6, 16), tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.position.set(wp[0], wp[1], wp[2]);
      tire.castShadow = true; truck.add(tire);

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.7, 12), chromeMat);
      cap.rotation.z = Math.PI / 2;
      cap.position.set(wp[0], wp[1], wp[2]);
      truck.add(cap);
    });

    truck.userData = {
      isFireEngine: true,
      redStrobe: redStrobe,
      blueStrobe: blueStrobe,
      strobePhase: 0
    };
    return truck;
  },

  // 2. LAMBORGHINI V12 HYPERCAR (Extreme Wedge Aerodynamics & Carbon Diffuser)
  createLamborghiniHypercar(colorHex = 0x84cc16, envMap = null) {
    const car = new THREE.Group();
    const paintMat = new THREE.MeshPhysicalMaterial({ color: colorHex, metalness: 0.92, roughness: 0.12, clearcoat: 1.0, clearcoatRoughness: 0.03, envMap, envMapIntensity: 2.2 });
    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4, metalness: 0.6 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x050d1a, roughness: 0.04, metalness: 0.95, transparent: true, opacity: 0.9, envMap });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9, metalness: 0.1 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.2, metalness: 0.9 });
    const caliperMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.3, metalness: 0.7 });

    // Lower Wedge Tub
    const body = new THREE.Mesh(new THREE.BoxGeometry(8.4, 2.2, 17.5), paintMat);
    body.position.set(0, 1.7, 0); body.castShadow = true; car.add(body);

    // Front Sloping Wedge Nose & Carbon Splitter
    const nose = new THREE.Mesh(new THREE.BoxGeometry(8.0, 1.4, 6.0), paintMat);
    nose.position.set(0, 1.3, 6.5); nose.rotation.x = -0.12; car.add(nose);

    const splitter = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.4, 3.2), carbonMat);
    splitter.position.set(0, 0.6, 8.8); car.add(splitter);

    // Hexagonal Air Intakes
    [-2.8, 2.8].forEach(ix => {
      const intake = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 0.8), carbonMat);
      intake.position.set(ix, 1.2, 9.0); car.add(intake);
    });

    // Low-Slung Stealth Canopy
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(6.6, 2.4, 8.5), glassMat);
    canopy.position.set(0, 3.4, -0.6); car.add(canopy);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.4, 7.8), paintMat);
    roof.position.set(0, 4.6, -0.6); car.add(roof);

    // Rear Carbon Diffuser & Quad Titanium Exhaust
    const diffuser = new THREE.Mesh(new THREE.BoxGeometry(8.4, 1.2, 2.8), carbonMat);
    diffuser.position.set(0, 1.0, -8.6); diffuser.rotation.x = 0.2; car.add(diffuser);

    [-1.2, -0.4, 0.4, 1.2].forEach(ex => {
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.8, 12), new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9 }));
      tip.rotation.x = Math.PI / 2; tip.position.set(ex, 1.6, -8.9); car.add(tip);
    });

    // Y-Shaped Signature LED Headlights & Taillights
    [-2.8, 2.8].forEach(hx => {
      const hl = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      hl.position.set(hx, 1.9, 9.2); hl.rotation.x = -0.12; car.add(hl);
    });

    const tailBar = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.6, 0.4), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    tailBar.position.set(0, 2.4, -8.8); car.add(tailBar);

    // 4 Forged Racing Alloy Wheels
    [[-4.3, 1.6, 4.8], [4.3, 1.6, 4.8], [-4.3, 1.7, -4.8], [4.3, 1.7, -4.8]].forEach(wp => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.65, 1.2, 20), tireMat);
      tire.rotation.z = Math.PI / 2; tire.position.set(wp[0], wp[1], wp[2]); tire.castShadow = true; car.add(tire);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.25, 16), rimMat);
      rim.rotation.z = Math.PI / 2; rim.position.set(wp[0], wp[1], wp[2]); car.add(rim);
      const cal = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 0.8), caliperMat);
      cal.position.set(wp[0] > 0 ? wp[0] - 0.3 : wp[0] + 0.3, wp[1] + 0.4, wp[2]); car.add(cal);
    });

    return car;
  },

  // 3. PORSCHE 911 GT3 RS (Track Beast with Swan-Neck Wing)
  createPorscheGT3Coupe(colorHex = 0xdc2626, envMap = null) {
    const car = new THREE.Group();
    const paintMat = new THREE.MeshPhysicalMaterial({ color: colorHex, metalness: 0.9, roughness: 0.14, clearcoat: 1.0, envMap, envMapIntensity: 2.0 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.4, metalness: 0.5 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x081528, roughness: 0.05, metalness: 0.9, transparent: true, opacity: 0.85, envMap });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9, metalness: 0.1 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.9 });

    // Curvaceous Teardrop Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(8.2, 2.4, 16.5), paintMat);
    body.position.set(0, 1.8, 0); body.castShadow = true; car.add(body);

    // Rounded Aerodynamic Nose
    const nose = new THREE.Mesh(new THREE.CylinderGeometry(3.9, 4.1, 5.2, 16), paintMat);
    nose.rotation.x = Math.PI / 2; nose.position.set(0, 1.8, 5.8); car.add(nose);

    // Iconic Oval Headlights
    [-2.6, 2.6].forEach(hx => {
      const hl = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.4, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      hl.rotation.x = Math.PI / 2; hl.position.set(hx, 2.5, 7.8); car.add(hl);
    });

    // Curving Greenhouse Glass Cabin
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(6.4, 2.6, 8.2), glassMat);
    cabin.position.set(0, 3.8, -0.8); car.add(cabin);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.4, 7.2), paintMat);
    roof.position.set(0, 5.1, -0.8); car.add(roof);

    // Swan-Neck High-Downforce Rear GT Wing
    const wingGroup = new THREE.Group();
    [-2.0, 2.0].forEach(sx => {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.6, 0.8), blackMat);
      strut.position.set(sx, 1.3, 0); wingGroup.add(strut);
    });
    const blade = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.35, 2.2), blackMat);
    blade.position.set(0, 2.6, 0); wingGroup.add(blade);
    wingGroup.position.set(0, 3.0, -7.5); car.add(wingGroup);

    // Center Dual Exhaust
    [-0.5, 0.5].forEach(ex => {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.8, 12), blackMat);
      pipe.rotation.x = Math.PI / 2; pipe.position.set(ex, 1.2, -8.4); car.add(pipe);
    });

    // 4 Satin Rims & Tires
    [[-4.2, 1.6, 4.6], [4.2, 1.6, 4.6], [-4.3, 1.7, -4.6], [4.3, 1.7, -4.6]].forEach(wp => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.65, 1.25, 20), tireMat);
      tire.rotation.z = Math.PI / 2; tire.position.set(wp[0], wp[1], wp[2]); tire.castShadow = true; car.add(tire);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.3, 16), rimMat);
      rim.rotation.z = Math.PI / 2; rim.position.set(wp[0], wp[1], wp[2]); car.add(rim);
    });

    return car;
  },

  // 4. 1967 SHELBY GT500 VINTAGE MUSCLE CAR (Twin Racing Stripes & Chrome Bumpers)
  createVintageShelbyMuscle(colorHex = 0x1d4ed8, envMap = null) {
    const car = new THREE.Group();
    const blueMat = new THREE.MeshPhysicalMaterial({ color: colorHex, metalness: 0.85, roughness: 0.22, clearcoat: 1.0, envMap, envMapIntensity: 1.8 });
    const whiteStripeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.1 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.08, metalness: 0.98, envMap, envMapIntensity: 2.0 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x050d1a, roughness: 0.05, metalness: 0.9, transparent: true, opacity: 0.82, envMap });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9, metalness: 0.1 });

    // Muscle Fastback Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(8.2, 2.6, 17.0), blueMat);
    body.position.set(0, 1.9, 0); body.castShadow = true; car.add(body);

    // Twin White Le Mans Racing Stripes running down center
    [-0.65, 0.65].forEach(sx => {
      const hoodStripe = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 16.9), whiteStripeMat);
      hoodStripe.position.set(sx, 3.25, 0); car.add(hoodStripe);
    });

    // Long Aggressive Hood with Dual Air Scoops
    const hoodScoop = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.5, 4.0), blueMat);
    hoodScoop.position.set(0, 3.4, 3.8); car.add(hoodScoop);

    // Classic Chrome Heavy Bumpers & Round Dual Headlights
    const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.9, 1.2), chromeMat);
    frontBumper.position.set(0, 1.5, 8.6); car.add(frontBumper);

    const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.9, 1.2), chromeMat);
    rearBumper.position.set(0, 1.5, -8.6); car.add(rearBumper);

    [-2.6, 2.6].forEach(hx => {
      const hl = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.3, 16), new THREE.MeshBasicMaterial({ color: 0xfffbeb }));
      hl.rotation.x = Math.PI / 2; hl.position.set(hx, 2.2, 8.6); car.add(hl);
    });

    // Fastback Sloping Roof & Chrome Pillars
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(6.6, 2.4, 8.2), glassMat);
    cabin.position.set(0, 3.9, -1.0); car.add(cabin);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.35, 8.0), blueMat);
    roof.position.set(0, 5.15, -1.0); car.add(roof);

    // Chrome Side Lake Pipes
    [-4.2, 4.2].forEach(px => {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 9.5, 12), chromeMat);
      pipe.rotation.x = Math.PI / 2; pipe.position.set(px, 0.9, 0); car.add(pipe);
    });

    // 4 American Mag Wheels with Raised Whitewall Lettering
    [[-4.2, 1.6, 4.8], [4.2, 1.6, 4.8], [-4.2, 1.6, -4.8], [4.2, 1.6, -4.8]].forEach(wp => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 1.3, 20), tireMat);
      tire.rotation.z = Math.PI / 2; tire.position.set(wp[0], wp[1], wp[2]); tire.castShadow = true; car.add(tire);
      const mag = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 1.35, 16), chromeMat);
      mag.rotation.z = Math.PI / 2; mag.position.set(wp[0], wp[1], wp[2]); car.add(mag);
    });

    return car;
  },

  // 5. 1959 CADILLAC ELDORADO VINTAGE CONVERTIBLE (Bullet Tailfins & Whitewalls)
  createVintageEldoradoClassic(colorHex = 0xb91c1c, envMap = null) {
    const car = new THREE.Group();
    const redMat = new THREE.MeshPhysicalMaterial({ color: colorHex, metalness: 0.8, roughness: 0.2, clearcoat: 1.0, envMap, envMapIntensity: 1.8 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.08, metalness: 0.98, envMap, envMapIntensity: 2.2 });
    const leatherMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x081528, roughness: 0.05, metalness: 0.9, transparent: true, opacity: 0.7, envMap });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9, metalness: 0.1 });

    // Long Elegant Cruiser Body (19.5 Length!)
    const body = new THREE.Mesh(new THREE.BoxGeometry(8.5, 2.2, 19.5), redMat);
    body.position.set(0, 1.8, 0); body.castShadow = true; car.add(body);

    // Massive Grille & Dual Chrome Egg-Crate Grilles
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(8.8, 1.2, 1.4), chromeMat);
    bumper.position.set(0, 1.4, 9.8); car.add(bumper);

    // Quad Bullet Headlights
    [-3.2, -1.8, 1.8, 3.2].forEach(hx => {
      const hl = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.35, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      hl.rotation.x = Math.PI / 2; hl.position.set(hx, 2.0, 9.9); car.add(hl);
    });

    // Iconic 1959 Rocket Bullet Tailfins
    [-4.0, 4.0].forEach(fx => {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.2, 8.5), redMat);
      fin.position.set(fx, 3.3, -5.6); fin.rotation.x = -0.15; car.add(fin);

      // Dual Bullet Taillights on Fins
      [3.8, 4.6].forEach(fy => {
        const bullet = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.2, 12), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        bullet.rotation.x = -Math.PI / 2; bullet.position.set(fx, fy, -9.9); car.add(bullet);
      });
    });

    // Wrap-Around Panoramic Windshield
    const windshield = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 4.2, 1.8, 16, 1, true, 0, Math.PI), glassMat);
    windshield.position.set(0, 3.6, 2.2); car.add(windshield);

    // White Leather Interior with Bench Seats & Thin Steering Wheel
    const bench = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.4, 6.4), leatherMat);
    bench.position.set(0, 2.2, -1.2); car.add(bench);

    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.08, 8, 16), chromeMat);
    wheel.rotation.x = 0.6; wheel.position.set(-1.8, 3.4, 1.4); car.add(wheel);

    // 4 Whitewall Tires with Chrome Hubcaps
    [[-4.3, 1.5, 5.8], [4.3, 1.5, 5.8], [-4.3, 1.5, -5.8], [4.3, 1.5, -5.8]].forEach(wp => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1.1, 20), tireMat);
      tire.rotation.z = Math.PI / 2; tire.position.set(wp[0], wp[1], wp[2]); tire.castShadow = true; car.add(tire);
      const whitewall = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.15, 16), new THREE.MeshBasicMaterial({ color: 0xf8fafc }));
      whitewall.rotation.z = Math.PI / 2; whitewall.position.set(wp[0], wp[1], wp[2]); car.add(whitewall);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 1.2, 16), chromeMat);
      cap.rotation.z = Math.PI / 2; cap.position.set(wp[0], wp[1], wp[2]); car.add(cap);
    });

    return car;
  },

  // 6. CYBER ARMORED OFF-ROAD SUV (Geometric Titanium Stealth)
  createCyberArmoredSUV(colorHex = 0x64748b, envMap = null) {
    const car = new THREE.Group();
    const titaniumMat = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.95, roughness: 0.35, envMap, envMapIntensity: 1.4 });
    const blackArmor = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.6, metalness: 0.4 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x030712, roughness: 0.02, metalness: 0.98, transparent: true, opacity: 0.92, envMap });
    const knobbyTire = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.95, metalness: 0.05 });

    // Angular Geometric Exo-Skeleton Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(8.6, 3.8, 17.5), titaniumMat);
    body.position.set(0, 2.8, 0); body.castShadow = true; car.add(body);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(7.6, 2.6, 11.2), titaniumMat);
    roof.position.set(0, 5.6, -1.2); car.add(roof);

    // Full-Width Laser Beam Headlight Bar
    const lightBar = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.3, 0.2), new THREE.MeshBasicMaterial({ color: 0xe0f2fe }));
    lightBar.position.set(0, 4.4, 8.8); car.add(lightBar);

    const redBar = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.3, 0.2), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    redBar.position.set(0, 4.4, -8.8); car.add(redBar);

    // Armored Faceted Windows
    const windshield = new THREE.Mesh(new THREE.PlaneGeometry(7.4, 2.8), glassMat);
    windshield.position.set(0, 5.6, 4.4); windshield.rotation.x = -0.55; car.add(windshield);

    // Heavy Off-Road Beadlock Wheels with High Ground Clearance (2.4)
    [[-4.5, 2.2, 5.0], [4.5, 2.2, 5.0], [-4.5, 2.2, -5.0], [4.5, 2.2, -5.0]].forEach(wp => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 1.8, 16), knobbyTire);
      tire.rotation.z = Math.PI / 2; tire.position.set(wp[0], wp[1], wp[2]); tire.castShadow = true; car.add(tire);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 1.85, 12), blackArmor);
      rim.rotation.z = Math.PI / 2; rim.position.set(wp[0], wp[1], wp[2]); car.add(rim);
    });

    return car;
  },

  // 7. PRESIDENTIAL VIP LUXURY SUV (High-Gloss Obsidian Black Range Rover)
  createLuxuryVIPSUV(colorHex = 0x09090b, envMap = null) {
    const car = new THREE.Group();
    const blackLacquer = new THREE.MeshPhysicalMaterial({ color: colorHex, metalness: 0.9, roughness: 0.1, clearcoat: 1.0, envMap, envMapIntensity: 2.0 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.1, metalness: 0.95, envMap });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x030712, roughness: 0.05, metalness: 0.95, transparent: true, opacity: 0.92, envMap });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });

    // Upright Stately SUV Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(8.6, 3.2, 18.0), blackLacquer);
    body.position.set(0, 2.4, 0); body.castShadow = true; car.add(body);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(8.0, 3.2, 12.0), blackLacquer);
    cabin.position.set(0, 5.2, -1.6); car.add(cabin);

    // Black-Out Privacy Glass
    const win = new THREE.Mesh(new THREE.BoxGeometry(8.1, 2.4, 11.2), glassMat);
    win.position.set(0, 5.2, -1.6); car.add(win);

    // Chrome Mesh Front Grille & Projector Matrix LEDs
    const grille = new THREE.Mesh(new THREE.BoxGeometry(5.8, 2.0, 0.4), chromeMat);
    grille.position.set(0, 2.8, 9.1); car.add(grille);

    [-3.0, 3.0].forEach(hx => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.9, 0.4), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      hl.position.set(hx, 3.2, 9.1); car.add(hl);
    });

    // 22" Multi-Spoke Turbine Alloy Rims
    [[-4.4, 1.9, 5.4], [4.4, 1.9, 5.4], [-4.4, 1.9, -5.4], [4.4, 1.9, -5.4]].forEach(wp => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 1.5, 20), tireMat);
      tire.rotation.z = Math.PI / 2; tire.position.set(wp[0], wp[1], wp[2]); tire.castShadow = true; car.add(tire);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 1.55, 16), chromeMat);
      rim.rotation.z = Math.PI / 2; rim.position.set(wp[0], wp[1], wp[2]); car.add(rim);
    });

    return car;
  },

  // 8. MERCEDES-BENZ G63 AMG G-WAGON (Boxy Muscular Luxury SUV & Panamericana Grille)
  createMercedesBenzGWagon(colorHex = 0x18181b, envMap = null) {
    const car = new THREE.Group();
    const paintMat = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.85, roughness: 0.25, envMap });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.08, metalness: 0.98, envMap });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.6, metalness: 0.4 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x050d1a, roughness: 0.1, metalness: 0.85, transparent: true, opacity: 0.85, envMap });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.8, roughness: 0.2 });

    // 1. Classic Boxy G-Wagon Lower Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(8.6, 3.6, 17.5), paintMat);
    body.position.set(0, 2.6, 0); body.castShadow = true; car.add(body);

    // 2. Upright Stately Cabin with Squared Roof
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(8.2, 3.4, 11.2), paintMat);
    cabin.position.set(0, 5.6, -1.2); car.add(cabin);

    const win = new THREE.Mesh(new THREE.BoxGeometry(8.3, 2.5, 10.4), glassMat);
    win.position.set(0, 5.6, -1.2); car.add(win);

    // 3. Panamericana Vertical Slat Chrome AMG Grille with Mercedes Three-Pointed Star
    const grille = new THREE.Mesh(new THREE.BoxGeometry(5.6, 2.4, 0.4), chromeMat);
    grille.position.set(0, 3.0, 8.8); car.add(grille);

    const starRing = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.08, 8, 16), chromeMat);
    starRing.position.set(0, 3.0, 9.05); car.add(starRing);

    // 4. Iconic Round Projector Headlights with Halo Rings
    [-3.1, 3.1].forEach(hx => {
      const hl = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.35, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      hl.rotation.x = Math.PI / 2; hl.position.set(hx, 3.2, 8.85); car.add(hl);
    });

    // 5. Front Heavy Bull-Bar
    const bullBar = new THREE.Mesh(new THREE.BoxGeometry(6.8, 1.8, 0.6), blackMat);
    bullBar.position.set(0, 1.8, 9.1); car.add(bullBar);

    // 6. Side Rub Strips (Signature G-Class Line)
    [-4.35, 4.35].forEach(sx => {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 16.5), blackMat);
      strip.position.set(sx, 3.2, 0); car.add(strip);
    });

    // 7. Side-Exit Dual Chrome Exhaust Tips (AMG Trademark)
    [-4.3, 4.3].forEach(ex => {
      [-1.2, -0.6].forEach(ez => {
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.6, 12), chromeMat);
        pipe.rotation.z = Math.PI / 2; pipe.position.set(ex > 0 ? ex + 0.2 : ex - 0.2, 1.1, ez); car.add(pipe);
      });
    });

    // 8. Rear Tailgate Mounted Spare Tire with Chrome Hard Shell Ring
    const spareTire = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 0.9, 20), blackMat);
    spareTire.position.set(0, 3.4, -9.1); car.add(spareTire);

    const spareRing = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.15, 8, 20), chromeMat);
    spareRing.position.set(0, 3.4, -9.1); car.add(spareRing);

    // 9. 22" Multi-Spoke AMG Alloy Wheels with Red Brake Calipers
    [[-4.4, 2.0, 5.2], [4.4, 2.0, 5.2], [-4.4, 2.0, -5.2], [4.4, 2.0, -5.2]].forEach(wp => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 1.45, 16), tireMat);
      tire.rotation.z = Math.PI / 2; tire.position.set(wp[0], wp[1], wp[2]); tire.castShadow = true; car.add(tire);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 1.5, 16), chromeMat);
      rim.rotation.z = Math.PI / 2; rim.position.set(wp[0], wp[1], wp[2]); car.add(rim);
      const cal = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.9, 0.8), redMat);
      cal.position.set(wp[0] > 0 ? wp[0] - 0.3 : wp[0] + 0.3, wp[1] + 0.5, wp[2]); car.add(cal);
    });

    return car;
  },

  // 9. BMW M4 COMPETITION COUPE (Twin Kidney Grille & Angel Eyes)
  createBmwM4Competition(colorHex = 0x0284c7, envMap = null) {
    const car = new THREE.Group();
    const blueMat = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.9, roughness: 0.16, envMap });
    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4, metalness: 0.5 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x050d1a, roughness: 0.08, metalness: 0.9, transparent: true, opacity: 0.85, envMap });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.1, metalness: 0.95 });
    const blueM = new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.8, roughness: 0.2 });

    // 1. Sleek Aggressive Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(8.2, 2.2, 16.8), blueMat);
    body.position.set(0, 1.8, 0); body.castShadow = true; car.add(body);

    const nose = new THREE.Mesh(new THREE.BoxGeometry(7.8, 1.3, 5.5), blueMat);
    nose.position.set(0, 1.4, 6.2); nose.rotation.x = -0.1; car.add(nose);

    // 2. Iconic Vertical Double-Kidney M Grille
    [-1.0, 1.0].forEach(kx => {
      const kidney = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.0, 0.3), carbonMat);
      kidney.position.set(kx, 1.7, 8.8); car.add(kidney);
    });

    // 3. Hexagonal Twin "Angel Eye" Laser Headlights
    [-2.8, 2.8].forEach(hx => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 0.3), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      hl.position.set(hx, 1.9, 8.7); car.add(hl);
    });

    // 4. Contoured Carbon-Fiber Roof with Aero Channel
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(6.5, 2.4, 8.2), glassMat);
    cabin.position.set(0, 3.8, -0.6); car.add(cabin);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.3, 7.8), carbonMat);
    roof.position.set(0, 5.0, -0.6); car.add(roof);

    // 5. Rear Carbon Trunk Lip Spoiler & Quad M Exhaust Pipes
    const spoiler = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.25, 0.8), carbonMat);
    spoiler.position.set(0, 3.0, -8.4); car.add(spoiler);

    [-1.4, -0.6, 0.6, 1.4].forEach(ex => {
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.6, 12), chromeMat);
      tip.rotation.x = Math.PI / 2; tip.position.set(ex, 1.1, -8.7); car.add(tip);
    });

    // 6. Staggered 19"/20" M Forged Wheels with Blue M Calipers
    [[-4.2, 1.6, 4.8], [4.2, 1.6, 4.8], [-4.2, 1.6, -4.8], [4.2, 1.6, -4.8]].forEach(wp => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 1.25, 16), tireMat);
      tire.rotation.z = Math.PI / 2; tire.position.set(wp[0], wp[1], wp[2]); tire.castShadow = true; car.add(tire);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.3, 16), carbonMat);
      rim.rotation.z = Math.PI / 2; rim.position.set(wp[0], wp[1], wp[2]); car.add(rim);
      const cal = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.7, 0.7), blueM);
      cal.position.set(wp[0] > 0 ? wp[0] - 0.25 : wp[0] + 0.25, wp[1] + 0.4, wp[2]); car.add(cal);
    });

    return car;
  },

  // 10. ROLLS-ROYCE PHANTOM VIII (Regal Pantheon Temple Grille & Spirit of Ecstasy)
  createRollsRoycePhantom(colorHex = 0x090d16, envMap = null) {
    const car = new THREE.Group();
    const blackLacquer = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.92, roughness: 0.12, envMap });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.05, metalness: 0.98, envMap });
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.85, envMap });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x030712, roughness: 0.05, metalness: 0.95, transparent: true, opacity: 0.9, envMap });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });

    // 1. Stately Upright Regal Limousine Body (Length: 19.8 Units)
    const body = new THREE.Mesh(new THREE.BoxGeometry(8.8, 3.2, 19.8), blackLacquer);
    body.position.set(0, 2.4, 0); body.castShadow = true; car.add(body);

    // Two-Tone Silver Bonnet Hood
    const hood = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.2, 9.4), silverMat);
    hood.position.set(0, 4.05, 4.6); car.add(hood);

    // 2. Massive Hand-Polished Chrome Pantheon Temple Grille
    const grille = new THREE.Mesh(new THREE.BoxGeometry(6.2, 3.6, 0.6), chromeMat);
    grille.position.set(0, 2.8, 10.0); car.add(grille);

    // 3. Iconic Spirit of Ecstasy Mascot on Radiator Cowl
    const mascot = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.9, 8), chromeMat);
    mascot.position.set(0, 4.9, 9.8); mascot.rotation.x = 0.2; car.add(mascot);

    // 4. Stately Formal Cabin with Privacy C-Pillars
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(8.2, 2.8, 11.5), blackLacquer);
    cabin.position.set(0, 5.0, -1.8); car.add(cabin);

    const win = new THREE.Mesh(new THREE.BoxGeometry(8.3, 2.2, 10.5), glassMat);
    win.position.set(0, 5.0, -1.8); car.add(win);

    // 5. Rectangular Laser Headlights
    [-3.2, 3.2].forEach(hx => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.9, 0.4), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      hl.position.set(hx, 3.0, 9.9); car.add(hl);
    });

    // 6. Suicide Coach Doors Center Chrome Handles
    [-4.42, 4.42].forEach(hx => {
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.25, 1.4), chromeMat);
      handle.position.set(hx, 3.4, -1.8); car.add(handle);
    });

    // 7. Weighted Self-Righting RR Monogram Wheels
    [[-4.5, 1.8, 5.8], [4.5, 1.8, 5.8], [-4.5, 1.8, -5.8], [4.5, 1.8, -5.8]].forEach(wp => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(1.85, 1.85, 1.4, 16), tireMat);
      tire.rotation.z = Math.PI / 2; tire.position.set(wp[0], wp[1], wp[2]); tire.castShadow = true; car.add(tire);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 1.45, 16), chromeMat);
      cap.rotation.z = Math.PI / 2; cap.position.set(wp[0], wp[1], wp[2]); car.add(cap);
    });

    return car;
  },

  // 11. AUDI R8 V10 PLUS QUATTRO (Singleframe Honeycomb Grille & Carbon Sideblades)
  createAudiR8Supercar(colorHex = 0xf59e0b, envMap = null) {
    const car = new THREE.Group();
    const goldMat = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.92, roughness: 0.14, envMap });
    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4, metalness: 0.5 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.1, metalness: 0.95 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x050d1a, roughness: 0.08, metalness: 0.9, transparent: true, opacity: 0.85, envMap });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.8, roughness: 0.2 });

    // 1. Mid-Engine Supercar Wedge Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(8.4, 2.1, 16.5), goldMat);
    body.position.set(0, 1.7, 0); body.castShadow = true; car.add(body);

    const nose = new THREE.Mesh(new THREE.BoxGeometry(8.0, 1.2, 5.6), goldMat);
    nose.position.set(0, 1.3, 6.0); nose.rotation.x = -0.12; car.add(nose);

    // 2. Wide Hexagonal Singleframe Grille
    const grille = new THREE.Mesh(new THREE.BoxGeometry(5.8, 1.8, 0.4), carbonMat);
    grille.position.set(0, 1.5, 8.8); car.add(grille);

    // 3. Four Interlocking Chrome Audi Rings on Hood
    [-0.75, -0.25, 0.25, 0.75].forEach(rx => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 8, 12), chromeMat);
      ring.position.set(rx, 2.1, 8.6); car.add(ring);
    });

    // 4. Sharp Matrix LED Angular Headlights
    [-2.8, 2.8].forEach(hx => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 0.3), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      hl.position.set(hx, 1.8, 8.7); car.add(hl);
    });

    // 5. Signature Carbon-Fiber Sideblades behind Windows
    [-4.22, 4.22].forEach(bx => {
      const blade = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.6), carbonMat);
      blade.position.set(bx, 2.6, -1.8); blade.rotation.y = bx > 0 ? Math.PI / 2 : -Math.PI / 2; car.add(blade);
    });

    // 6. Cockpit Glass Canopy
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(6.4, 2.2, 8.2), glassMat);
    canopy.position.set(0, 3.4, -0.4); car.add(canopy);

    // 7. Fixed Carbon-Fiber Rear Wing & Dual Oval RS Exhausts
    const wing = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.25, 1.8), carbonMat);
    wing.position.set(0, 3.2, -7.8); car.add(wing);

    [-2.2, 2.2].forEach(ex => {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.4, 0.6, 12), chromeMat);
      pipe.rotation.x = Math.PI / 2; pipe.position.set(ex, 1.1, -8.4); car.add(pipe);
    });

    // 8. 20" Forged Titanium Rims with Red RS Calipers
    [[-4.3, 1.6, 4.6], [4.3, 1.6, 4.6], [-4.3, 1.6, -4.6], [4.3, 1.6, -4.6]].forEach(wp => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 1.25, 16), tireMat);
      tire.rotation.z = Math.PI / 2; tire.position.set(wp[0], wp[1], wp[2]); tire.castShadow = true; car.add(tire);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.3, 16), chromeMat);
      rim.rotation.z = Math.PI / 2; rim.position.set(wp[0], wp[1], wp[2]); car.add(rim);
      const cal = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.7, 0.7), redMat);
      cal.position.set(wp[0] > 0 ? wp[0] - 0.25 : wp[0] + 0.25, wp[1] + 0.4, wp[2]); car.add(cal);
    });

    return car;
  },

  // 12. TOYOTA INNOVA CRYSTA MPV (Touring Luxury MPV - India & Kerala Favorite)
  createToyotaInnovaCrysta(colorHex = 0xe2e8f0, envMap = null) {
    const car = new THREE.Group();
    const silverMat = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.85, roughness: 0.25, envMap });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.08, metalness: 0.98, envMap });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.5, metalness: 0.4 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x050d1a, roughness: 0.1, metalness: 0.85, transparent: true, opacity: 0.85, envMap });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });

    // 1. Practical 3-Row Touring MPV Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(8.2, 3.4, 17.5), silverMat);
    body.position.set(0, 2.5, 0); body.castShadow = true; car.add(body);

    // Sloped Front MPV Hood
    const hood = new THREE.Mesh(new THREE.BoxGeometry(7.8, 1.6, 5.2), silverMat);
    hood.position.set(0, 2.6, 6.2); hood.rotation.x = -0.15; car.add(hood);

    // 2. Bold Hexagonal Chrome Dual-Slat Grille with Toyota Oval Emblem
    const grille = new THREE.Mesh(new THREE.BoxGeometry(5.8, 1.8, 0.4), chromeMat);
    grille.position.set(0, 2.4, 8.8); car.add(grille);

    const logo = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.06, 8, 16), chromeMat);
    logo.position.set(0, 2.4, 9.05); car.add(logo);

    // 3. Swept-Back Projector Headlights
    [-2.8, 2.8].forEach(hx => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 0.3), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      hl.position.set(hx, 2.7, 8.6); car.add(hl);
    });

    // 4. Tall 3-Row Cabin with Triangular Quarter Glass
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(7.8, 2.6, 11.5), glassMat);
    cabin.position.set(0, 5.0, -1.5); car.add(cabin);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.3, 11.2), silverMat);
    roof.position.set(0, 6.35, -1.5); car.add(roof);

    // 5. Silver Roof Luggage Rails
    [-3.2, 3.2].forEach(rx => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.35, 10.2), chromeMat);
      rail.position.set(rx, 6.6, -1.5); car.add(rail);
    });

    // 6. Rear Tailgate with Chrome Applique Bar ("CRYSTA") & Roof Spoiler
    const chromeBar = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.5, 0.2), chromeMat);
    chromeBar.position.set(0, 3.0, -8.8); car.add(chromeBar);

    const spoiler = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.3, 1.4), silverMat);
    spoiler.position.set(0, 6.2, -8.4); car.add(spoiler);

    // 7. 17" Two-Tone Diamond-Cut Alloy Wheels
    [[-4.2, 1.7, 5.2], [4.2, 1.7, 5.2], [-4.2, 1.7, -5.2], [4.2, 1.7, -5.2]].forEach(wp => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 1.25, 16), tireMat);
      tire.rotation.z = Math.PI / 2; tire.position.set(wp[0], wp[1], wp[2]); tire.castShadow = true; car.add(tire);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.3, 16), chromeMat);
      rim.rotation.z = Math.PI / 2; rim.position.set(wp[0], wp[1], wp[2]); car.add(rim);
    });

    return car;
  },

  // 13. TESLA MODEL S PLAID (Minimalist Aerodynamic Electric Hyper-Sedan)
  createTeslaModelSPlaid(colorHex = 0xdc2626, envMap = null) {
    const car = new THREE.Group();
    const redMat = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.9, roughness: 0.15, envMap });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x030712, roughness: 0.05, metalness: 0.95, transparent: true, opacity: 0.9, envMap });
    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4, metalness: 0.5 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.1, metalness: 0.95 });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });

    // 1. Low-Drag Aerodynamic Flush Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(8.2, 2.1, 17.2), redMat);
    body.position.set(0, 1.7, 0); body.castShadow = true; car.add(body);

    const nose = new THREE.Mesh(new THREE.BoxGeometry(7.8, 1.2, 5.2), redMat);
    nose.position.set(0, 1.3, 6.2); nose.rotation.x = -0.12; car.add(nose);

    // 2. Grille-Less Flush Front Nose with Chrome Tesla 'T' Emblem
    const logoT = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.1), chromeMat);
    logoT.position.set(0, 1.8, 8.8); car.add(logoT);

    // 3. Full-Width Laser Headlight Bar
    [-2.8, 2.8].forEach(hx => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.2), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      hl.position.set(hx, 1.7, 8.7); car.add(hl);
    });

    // 4. Continuous Full Panoramic Tinted Glass Roof
    const glassRoof = new THREE.Mesh(new THREE.BoxGeometry(6.4, 2.2, 9.5), glassMat);
    glassRoof.position.set(0, 3.4, -0.5); car.add(glassRoof);

    // 5. Carbon-Fiber Trunk Lid Lip Spoiler
    const spoiler = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.2, 0.8), carbonMat);
    spoiler.position.set(0, 2.8, -8.6); car.add(spoiler);

    // 6. 21" Arachnid Gunmetal Turbine Wheels
    [[-4.2, 1.6, 4.8], [4.2, 1.6, 4.8], [-4.2, 1.6, -4.8], [4.2, 1.6, -4.8]].forEach(wp => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.65, 1.2, 16), tireMat);
      tire.rotation.z = Math.PI / 2; tire.position.set(wp[0], wp[1], wp[2]); tire.castShadow = true; car.add(tire);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 1.25, 16), carbonMat);
      rim.rotation.z = Math.PI / 2; rim.position.set(wp[0], wp[1], wp[2]); car.add(rim);
    });

    return car;
  }
};

window.GTARealisticEntities = GTARealisticEntities;
