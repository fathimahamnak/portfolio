// ========================================================
// GTA 5 REALISTIC 3D MODELS BUILDER
// Photorealistic Supercar (Aerodynamic Curves, Metallic PBR Lacquer,
// V10 Engine Deck, Chrome Alloy Wheels, Drilled Rotors & Headlight Beams)
// Photorealistic Human Character (Hamna's Face Texture, Anatomical Joints,
// Designer Blazer, Natural Walk/Sprint Animations)
// Photorealistic Architecture, Roadways, Street Furniture & VFX
// ========================================================

const GTAModels = {
  // ========================================================
  // 1. PHOTOREALISTIC GTA 5 SUPERCAR (Pegassi / Grotti Turismo R)
  // ========================================================
  createSupercar(bodyColor = 0xf59e0b) {
    const car = new THREE.Group();

    // Textures from GTATextures
    const carbonTex = GTATextures.createCarbonFiber();
    const rotorTex = GTATextures.createBrakeRotor();
    const treadTex = GTATextures.createTireTread();

    // 1. High-End Automotive Metallic Paint Shader (MeshPhysicalMaterial)
    const paintMat = new THREE.MeshPhysicalMaterial({
      color: bodyColor,
      metalness: 0.88,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.95
    });

    // Dark Carbon Fiber Material
    const carbonMat = new THREE.MeshStandardMaterial({
      map: carbonTex,
      color: 0x18181b,
      metalness: 0.5,
      roughness: 0.35
    });

    // Dark Tinted Automotive Glass
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x081528,
      metalness: 0.9,
      roughness: 0.05,
      transmission: 0.6,
      transparent: true,
      opacity: 0.82,
      ior: 1.52
    });

    // Chrome Trim
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.98,
      roughness: 0.08
    });

    // Red Brembo Brake Caliper Material
    const caliperMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      metalness: 0.6,
      roughness: 0.25
    });

    // Rubber Tire Material
    const tireMat = new THREE.MeshStandardMaterial({
      map: treadTex,
      color: 0x18181b,
      metalness: 0.1,
      roughness: 0.85
    });

    // Headlight Lens Material
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const drlGlowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const taillightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

    // ----------------------------------------------------
    // SUPERCAR CHASSIS & LOWER BODYWORK
    // ----------------------------------------------------
    // Main Lower Tub
    const tubGeo = new THREE.BoxGeometry(16.5, 3.5, 36);
    const tub = new THREE.Mesh(tubGeo, paintMat);
    tub.position.y = 3.6;
    tub.castShadow = true;
    tub.receiveShadow = true;
    car.add(tub);

    // Sculpted Aerodynamic Front Nose / Hood (Sloping Wedge)
    const hoodGeo = new THREE.CylinderGeometry(7.2, 8.2, 14, 16);
    const hood = new THREE.Mesh(hoodGeo, paintMat);
    hood.rotation.x = Math.PI / 2 + 0.12;
    hood.scale.set(1, 0.45, 1);
    hood.position.set(0, 4.4, 11);
    hood.castShadow = true;
    car.add(hood);

    // Front Twin Extractor Air Ducts (Carbon Fiber Vents on Hood)
    [-3.8, 3.8].forEach(vx => {
      const vent = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.4, 5.5), carbonMat);
      vent.position.set(vx, 5.1, 11);
      vent.rotation.x = -0.12;
      car.add(vent);
    });

    // Aggressive Front Bumper with Carbon Fiber Racing Splitter Lip
    const splitter = new THREE.Mesh(new THREE.BoxGeometry(17.4, 0.9, 6), carbonMat);
    splitter.position.set(0, 1.8, 17.5);
    splitter.castShadow = true;
    car.add(splitter);

    // Front Air Intake Honeycomb Mesh Grill
    const grill = new THREE.Mesh(new THREE.BoxGeometry(14, 2.2, 1.2), carbonMat);
    grill.position.set(0, 2.9, 18.2);
    car.add(grill);

    // Aerodynamic Side Skirts (Carbon Fiber Rocker Panels)
    [-8.6, 8.6].forEach(sx => {
      const skirt = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 28), carbonMat);
      skirt.position.set(sx, 2.2, 0);
      car.add(skirt);
    });

    // ----------------------------------------------------
    // COCKPIT CANOPY & WINDOWS
    // ----------------------------------------------------
    // Aerodynamic Cockpit Glass Bubble
    const canopyGeo = new THREE.CylinderGeometry(5.8, 7.2, 16, 16);
    const canopy = new THREE.Mesh(canopyGeo, glassMat);
    canopy.rotation.x = Math.PI / 2 + 0.08;
    canopy.scale.set(0.95, 0.52, 1);
    canopy.position.set(0, 7.4, -1);
    canopy.castShadow = true;
    car.add(canopy);

    // Lightweight Carbon Fiber Roof Panel
    const roof = new THREE.Mesh(new THREE.BoxGeometry(11, 0.8, 12), carbonMat);
    roof.position.set(0, 9.6, -2);
    roof.castShadow = true;
    car.add(roof);

    // Cockpit A-Pillars & C-Pillars (Roof frame in body color)
    [-5.8, 5.8].forEach(px => {
      const aPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 8, 8), paintMat);
      aPillar.position.set(px, 7.5, 4.2);
      aPillar.rotation.x = 0.52;
      car.add(aPillar);
    });

    // ----------------------------------------------------
    // SCULPTED SIDE AIR INTAKES (LAMBORGHINI / FERRARI SCOOPS)
    // ----------------------------------------------------
    [-8.5, 8.5].forEach(sx => {
      const scoop = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.8, 7), carbonMat);
      scoop.position.set(sx, 5, -4);
      car.add(scoop);

      // Aero Winglet strake
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.2, 6), paintMat);
      fin.position.set(sx > 0 ? sx + 0.6 : sx - 0.6, 5, -4);
      car.add(fin);
    });

    // Aerodynamic Side Mirrors
    [-8.8, 8.8].forEach(mx => {
      const mirrorArm = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 2.5, 8), carbonMat);
      mirrorArm.position.set(mx, 7.4, 4);
      mirrorArm.rotation.z = mx > 0 ? -0.4 : 0.4;
      car.add(mirrorArm);

      const mirrorHousing = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 1.8), paintMat);
      mirrorHousing.position.set(mx > 0 ? mx + 1.2 : mx - 1.2, 8.1, 4);
      car.add(mirrorHousing);

      const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.1), chromeMat);
      mirrorGlass.position.set(mx > 0 ? mx + 1.2 : mx - 1.2, 8.1, 3.1);
      mirrorGlass.rotation.y = Math.PI;
      car.add(mirrorGlass);
    });

    // ----------------------------------------------------
    // REAR MID-ENGINE BAY & V10 ENGINE BLOCK
    // ----------------------------------------------------
    // Slanted Louvered Engine Lid (Glass & Carbon)
    const engineCover = new THREE.Mesh(new THREE.BoxGeometry(12, 1, 10), glassMat);
    engineCover.position.set(0, 7.2, -10.5);
    engineCover.rotation.x = 0.15;
    car.add(engineCover);

    // Visible V10 Engine Block inside the bay
    const engineBlock = new THREE.Mesh(new THREE.BoxGeometry(6, 2.5, 7), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 }));
    engineBlock.position.set(0, 5.2, -10.5);
    car.add(engineBlock);

    // Red Cylinder Head Valve Covers
    [-2, 2].forEach(vx => {
      const valveCover = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 6.5), new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.7, roughness: 0.2 }));
      valveCover.position.set(vx, 6.4, -10.5);
      car.add(valveCover);
    });

    // Chrome Intake Runners
    for (let iz = -12; iz <= -8; iz += 1.8) {
      [-1, 1].forEach(ix => {
        const runner = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.2, 8), chromeMat);
        runner.position.set(ix, 6.8, iz);
        car.add(runner);
      });
    }

    // ----------------------------------------------------
    // REAR RACING DIFFUSER & GT SPOILER WING
    // ----------------------------------------------------
    // Carbon Fiber GT Wing
    const wingBlade = new THREE.Mesh(new THREE.BoxGeometry(17.5, 0.7, 4.2), carbonMat);
    wingBlade.position.set(0, 10.4, -18);
    wingBlade.castShadow = true;
    car.add(wingBlade);

    // Wing Endplates
    [-8.8, 8.8].forEach(wx => {
      const endplate = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.2, 4.8), carbonMat);
      endplate.position.set(wx, 10.4, -18);
      car.add(endplate);
    });

    // Dual Swan-Neck Wing Mount Stanchions
    [-4.5, 4.5].forEach(sx => {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4.4, 2.4), carbonMat);
      strut.position.set(sx, 8.2, -17.5);
      strut.rotation.x = -0.15;
      car.add(strut);
    });

    // Rear Aerodynamic Diffuser with 4 Vertical Strakes
    const diffuser = new THREE.Mesh(new THREE.BoxGeometry(16, 2.2, 4), carbonMat);
    diffuser.position.set(0, 2.4, -17.8);
    diffuser.rotation.x = 0.25;
    car.add(diffuser);

    [-5, -1.8, 1.8, 5].forEach(dx => {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.4, 3.6), carbonMat);
      fin.position.set(dx, 2.4, -17.8);
      fin.rotation.x = 0.25;
      car.add(fin);
    });

    // Quad Titanium Chrome Exhaust Tips (Burnished heat treated)
    [-4, -2.4, 2.4, 4].forEach(ex => {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 2.8, 16), chromeMat);
      pipe.rotation.x = Math.PI / 2;
      pipe.position.set(ex, 3.2, -19.2);
      car.add(pipe);

      // Dark exhaust inner hole
      const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.4, 16), new THREE.MeshBasicMaterial({ color: 0x09090b }));
      hole.rotation.x = Math.PI / 2;
      hole.position.set(ex, 3.2, -19.5);
      car.add(hole);
    });

    // ----------------------------------------------------
    // PROJECTOR HEADLIGHTS & LIGHT CONES
    // ----------------------------------------------------
    // Angled Xenon Projector Headlights
    [-5.6, 5.6].forEach(hx => {
      // Smoked Glass Housing
      const housing = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.8, 2.8), glassMat);
      housing.position.set(hx, 4.6, 17.6);
      housing.rotation.y = hx > 0 ? -0.22 : 0.22;
      car.add(housing);

      // Projector Bulb
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 12), headlightMat);
      bulb.position.set(hx, 4.6, 18.2);
      car.add(bulb);

      // LED DRL Accent Blade
      const drl = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.35, 0.8), drlGlowMat);
      drl.position.set(hx, 5.3, 18.4);
      car.add(drl);
    });

    // Dynamic High-Beam Spotlights (Cast real illumination on road)
    const headlightBeamL = new THREE.SpotLight(0xfffaed, 2.4, 160, Math.PI / 7, 0.4, 1.2);
    headlightBeamL.position.set(-5.6, 5, 19);
    headlightBeamL.target.position.set(-5.6, 0, 120);
    car.add(headlightBeamL);
    car.add(headlightBeamL.target);

    const headlightBeamR = new THREE.SpotLight(0xfffaed, 2.4, 160, Math.PI / 7, 0.4, 1.2);
    headlightBeamR.position.set(5.6, 5, 19);
    headlightBeamR.target.position.set(5.6, 0, 120);
    car.add(headlightBeamR);
    car.add(headlightBeamR.target);

    // Rear Continuous Neon LED Taillight Bar
    const taillightBar = new THREE.Mesh(new THREE.BoxGeometry(15.2, 1.2, 0.8), taillightMat);
    taillightBar.position.set(0, 5.6, -18.2);
    car.add(taillightBar);

    // Rear California License Plate ("HAMNA 01")
    const createPlate = () => {
      const pCan = document.createElement('canvas');
      pCan.width = 128; pCan.height = 64;
      const pCtx = pCan.getContext('2d');
      pCtx.fillStyle = '#ffffff'; pCtx.fillRect(0, 0, 128, 64);
      pCtx.strokeStyle = '#0284c7'; pCtx.lineWidth = 4; pCtx.strokeRect(2, 2, 124, 60);
      pCtx.fillStyle = '#b91c1c'; pCtx.font = 'bold 12px sans-serif'; pCtx.textAlign = 'center';
      pCtx.fillText('CALIFORNIA', 64, 18);
      pCtx.fillStyle = '#0f172a'; pCtx.font = 'bold 24px sans-serif';
      pCtx.fillText('HAMNA 01', 64, 46);
      return new THREE.CanvasTexture(pCan);
    };
    const plateTex = createPlate();

    const frontPlate = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 2.4), new THREE.MeshBasicMaterial({ map: plateTex }));
    frontPlate.position.set(0, 2.8, 18.8);
    car.add(frontPlate);

    const backPlate = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 2.4), new THREE.MeshBasicMaterial({ map: plateTex }));
    backPlate.position.set(0, 3.8, -18.5);
    backPlate.rotation.y = Math.PI;
    car.add(backPlate);

    // ----------------------------------------------------
    // 4 HIGH-FIDELITY ALLOY WHEELS, TIRES & BRAKES
    // ----------------------------------------------------
    const wheelPositions = [
      [-8.6, 3.4, 11],  // Front Left
      [8.6, 3.4, 11],   // Front Right
      [-8.8, 3.6, -11], // Rear Left (Wider track)
      [8.8, 3.6, -11]   // Rear Right (Wider track)
    ];

    const carWheels = [];
    wheelPositions.forEach((pos, idx) => {
      const wheelGroup = new THREE.Group();
      const isRight = pos[0] > 0;

      // Outer Rubber Performance Tire with Tread Texture
      const tireGeo = new THREE.CylinderGeometry(3.4, 3.4, 2.4, 28);
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      // Cross-Drilled Brembo Steel Brake Rotor / Disc
      const rotorGeo = new THREE.CylinderGeometry(2.3, 2.3, 0.4, 24);
      const rotorMat = new THREE.MeshStandardMaterial({
        map: rotorTex,
        metalness: 0.9,
        roughness: 0.2
      });
      const rotor = new THREE.Mesh(rotorGeo, rotorMat);
      rotor.rotation.z = Math.PI / 2;
      rotor.position.x = isRight ? -0.4 : 0.4;
      wheelGroup.add(rotor);

      // Bright Red 6-Piston Brake Caliper
      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, 1.4), caliperMat);
      caliper.position.set(isRight ? -0.4 : 0.4, 1.4, 0);
      wheelGroup.add(caliper);

      // Chrome Forged Alloy Rim with 5 Twin-Spokes
      const rimRim = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 2.5, 24), chromeMat);
      rimRim.rotation.z = Math.PI / 2;
      wheelGroup.add(rimRim);

      // 5 Twin-Spokes
      for (let s = 0; s < 5; s++) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.2, 0.5), chromeMat);
        spoke.rotation.x = (s / 5) * Math.PI * 2;
        spoke.position.x = isRight ? 1.15 : -1.15;
        wheelGroup.add(spoke);
      }

      // Center Chrome Hub Cap with Logo
      const hubCap = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2.6, 12), chromeMat);
      hubCap.rotation.z = Math.PI / 2;
      wheelGroup.add(hubCap);

      wheelGroup.position.set(pos[0], pos[1], pos[2]);
      car.add(wheelGroup);
      carWheels.push(wheelGroup);
    });

    car.userData = {
      carWheels,
      headlightBeams: [headlightBeamL, headlightBeamR],
      taillightBar
    };

    return car;
  },

  // ========================================================
  // 2. PHOTOREALISTIC HUMAN CHARACTER (FATHIMA HAMNA K)
  // ========================================================
  createPlayerCharacter(onReadyCallback = null) {
    const character = new THREE.Group();

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xf5d0b5,
      roughness: 0.55,
      metalness: 0.05
    });

    // Designer Tech Blazer / Jacket (Deep Navy / Charcoal with Satin Sheen)
    const blazerMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.65,
      metalness: 0.1
    });

    // Inner White Satin Shirt
    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.4,
      metalness: 0.05
    });

    // Tailored Trousers / Jeans
    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
      metalness: 0.05
    });

    // Natural Black Styled Hair
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.85,
      metalness: 0.1
    });

    // Designer Sneaker Material
    const sneakerMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.35,
      metalness: 0.1
    });
    const soleMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.9,
      metalness: 0.0
    });

    // ----------------------------------------------------
    // TORSO & UPPER BODY
    // ----------------------------------------------------
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 8.5;

    // Tailored Blazer Torso (Tapered athletic posture)
    const torsoGeo = new THREE.BoxGeometry(3.6, 5.2, 2.4);
    const torso = new THREE.Mesh(torsoGeo, blazerMat);
    torso.castShadow = true;
    torsoGroup.add(torso);

    // Inner Shirt V-Neck / Lapels
    const lapel = new THREE.Mesh(new THREE.BoxGeometry(1.4, 4.6, 0.4), shirtMat);
    lapel.position.set(0, 0.3, 1.15);
    torsoGroup.add(lapel);

    // Gold Architect Pendant / Lanyard
    const pendant = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.1), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.1 }));
    pendant.position.set(0, 0.4, 1.38);
    torsoGroup.add(pendant);

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.85, 1.8, 12), skinMat);
    neck.position.y = 3.2;
    torsoGroup.add(neck);

    // ----------------------------------------------------
    // HEAD & HAMNA'S FACE TEXTURE
    // ----------------------------------------------------
    const headGroup = new THREE.Group();
    headGroup.position.y = 4.8;

    // Head Base Mesh
    const headGeo = new THREE.SphereGeometry(1.7, 24, 24);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.scale.set(0.92, 1.1, 0.96);
    head.castShadow = true;
    headGroup.add(head);

    // Load and map Hamna's Real Face Photo onto the front face!
    GTATextures.createHamnaFaceTexture('assets/hamna_real.jpg', (faceTex) => {
      const faceMat = new THREE.MeshBasicMaterial({
        map: faceTex,
        transparent: true
      });
      // Front Face Decal Plane curved slightly to match face
      const facePlane = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.5), faceMat);
      facePlane.position.set(0, 0, 1.62);
      facePlane.rotation.x = -0.05;
      headGroup.add(facePlane);
    });

    // ----------------------------------------------------
    // STYLED HAIR GEOMETRY (Natural volume, parted locks & side contour)
    // ----------------------------------------------------
    const hairCrown = new THREE.Mesh(new THREE.SphereGeometry(1.82, 16, 16), hairMat);
    hairCrown.position.set(0, 0.45, -0.2);
    hairCrown.scale.set(0.95, 1.05, 1.02);
    headGroup.add(hairCrown);

    // Side hair locks framing the face
    [-0.9, 0.9].forEach(hx => {
      const lock = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.3, 3.2, 8), hairMat);
      lock.position.set(hx, -0.6, 0.6);
      lock.rotation.z = hx > 0 ? -0.15 : 0.15;
      headGroup.add(lock);
    });

    // Hair bun / ponytail in back
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.9, 12, 12), hairMat);
    bun.position.set(0, 0.2, -1.8);
    headGroup.add(bun);

    torsoGroup.add(headGroup);
    character.add(torsoGroup);

    // ----------------------------------------------------
    // ARMS & HANDS (Articulated for natural swinging)
    // ----------------------------------------------------
    const armGeo = new THREE.CylinderGeometry(0.55, 0.48, 4.4, 10);
    const handGeo = new THREE.SphereGeometry(0.5, 10, 10);

    // Left Arm
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-2.2, 2.2, 0);

    const leftArmMesh = new THREE.Mesh(armGeo, blazerMat);
    leftArmMesh.position.y = -2;
    leftArmMesh.castShadow = true;
    leftArmGroup.add(leftArmMesh);

    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.y = -4.2;
    leftArmGroup.add(leftHand);

    torsoGroup.add(leftArmGroup);

    // Right Arm
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(2.2, 2.2, 0);

    const rightArmMesh = new THREE.Mesh(armGeo, blazerMat);
    rightArmMesh.position.y = -2;
    rightArmMesh.castShadow = true;
    rightArmGroup.add(rightArmMesh);

    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.y = -4.2;
    rightArmGroup.add(rightHand);

    torsoGroup.add(rightArmGroup);

    // ----------------------------------------------------
    // LEGS & SNEAKERS (Articulated at hips for natural walking)
    // ----------------------------------------------------
    const legGeo = new THREE.CylinderGeometry(0.72, 0.58, 6.2, 10);

    // Left Leg Group
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-1.1, 5.8, 0);

    const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
    leftLegMesh.position.y = -3;
    leftLegMesh.castShadow = true;
    leftLegGroup.add(leftLegMesh);

    // Left Sneaker
    const leftSneaker = new THREE.Group();
    leftSneaker.position.set(0, -6.1, 0.4);

    const lShoeUpper = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 2.6), sneakerMat);
    lShoeUpper.position.y = 0.6;
    leftSneaker.add(lShoeUpper);

    const lShoeSole = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.45, 2.8), soleMat);
    lShoeSole.position.y = 0.2;
    leftSneaker.add(lShoeSole);

    leftLegGroup.add(leftSneaker);
    character.add(leftLegGroup);

    // Right Leg Group
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(1.1, 5.8, 0);

    const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
    rightLegMesh.position.y = -3;
    rightLegMesh.castShadow = true;
    rightLegGroup.add(rightLegMesh);

    // Right Sneaker
    const rightSneaker = new THREE.Group();
    rightSneaker.position.set(0, -6.1, 0.4);

    const rShoeUpper = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 2.6), sneakerMat);
    rShoeUpper.position.y = 0.6;
    rightSneaker.add(rShoeUpper);

    const rShoeSole = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.45, 2.8), soleMat);
    rShoeSole.position.y = 0.2;
    rightSneaker.add(rShoeSole);

    rightLegGroup.add(rightSneaker);
    character.add(rightLegGroup);

    // Floating GTA Nameplate
    const nameCanvas = document.createElement('canvas');
    nameCanvas.width = 256; nameCanvas.height = 64;
    const nctx = nameCanvas.getContext('2d');
    nctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    nctx.fillRect(0, 0, 256, 64);
    nctx.strokeStyle = '#f59e0b'; nctx.lineWidth = 4;
    nctx.strokeRect(2, 2, 252, 60);
    nctx.font = '900 24px "Plus Jakarta Sans", sans-serif';
    nctx.fillStyle = '#f59e0b'; nctx.textAlign = 'center';
    nctx.fillText('HAMNA // ARCHITECT', 128, 42);

    const nameTex = new THREE.CanvasTexture(nameCanvas);
    const nameSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: nameTex }));
    nameSprite.position.set(0, 16.8, 0);
    nameSprite.scale.set(22, 5.5, 1);
    character.add(nameSprite);

    // Save Animation Nodes in userData
    character.userData = {
      torsoGroup,
      headGroup,
      leftArmGroup,
      rightArmGroup,
      leftLegGroup,
      rightLegGroup,
      isPlayer: true
    };

    if (onReadyCallback) onReadyCallback(character);
    return character;
  },

  // ========================================================
  // 3. PHOTOREALISTIC AMERICAN POLICE INTERCEPTOR CRUISER
  // ========================================================
  createPoliceCruiser() {
    // Priority 1: If real 3D GLB model is available, use genuine GLTF mesh interceptor!
    if (window.GTAModelLoader && window.GTAModelLoader.templates && window.GTAModelLoader.templates.supercar) {
      const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;
      return window.GTAModelLoader.createRealPoliceCruiser(envMap);
    }

    const police = new THREE.Group();
    const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;

    const blackPaint = new THREE.MeshPhysicalMaterial({
      color: 0x09090b,
      metalness: 0.92,
      roughness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      envMap: envMap,
      envMapIntensity: 1.8
    });
    const whitePaint = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      metalness: 0.85,
      roughness: 0.2,
      clearcoat: 0.9,
      envMap: envMap
    });
    const darkGlass = new THREE.MeshPhysicalMaterial({
      color: 0x050d1a,
      metalness: 0.95,
      roughness: 0.05,
      transparent: true,
      opacity: 0.88,
      envMap: envMap,
      envMapIntensity: 2.0
    });
    const bullBarMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.7, roughness: 0.35 });

    // 1. Aerodynamic Lower Sculpted Body (Deep Midnight Police Black)
    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(16.2, 3.8, 36), blackPaint);
    lowerBody.position.y = 3.6;
    lowerBody.castShadow = true;
    police.add(lowerBody);

    // Front Hood Slope (Raked muscle car nose)
    const hood = new THREE.Mesh(new THREE.BoxGeometry(15.8, 2.2, 12), blackPaint);
    hood.position.set(0, 5.2, 10.5);
    hood.rotation.x = -0.14;
    police.add(hood);

    // Rear Trunk Deck
    const trunk = new THREE.Mesh(new THREE.BoxGeometry(15.6, 2.4, 9), blackPaint);
    trunk.position.set(0, 5.0, -12);
    police.add(trunk);

    // 2. Cabin Green-House & White Roof Section
    const whiteRoof = new THREE.Mesh(new THREE.BoxGeometry(12.8, 0.4, 13.5), whitePaint);
    whiteRoof.position.set(0, 9.8, -1.2);
    police.add(whiteRoof);

    // Raked Windshield
    const windshield = new THREE.Mesh(new THREE.PlaneGeometry(13.6, 5.8), darkGlass);
    windshield.position.set(0, 7.8, 5.2);
    windshield.rotation.x = -Math.PI / 4;
    police.add(windshield);

    // Rear Sloped Window
    const rearGlass = new THREE.Mesh(new THREE.PlaneGeometry(13.2, 5.2), darkGlass);
    rearGlass.position.set(0, 7.6, -7.2);
    rearGlass.rotation.x = Math.PI / 3.6;
    police.add(rearGlass);

    // Side Windows
    [-6.8, 6.8].forEach(wx => {
      const sideWindow = new THREE.Mesh(new THREE.PlaneGeometry(11.8, 3.6), darkGlass);
      sideWindow.position.set(wx, 8.0, -1.2);
      sideWindow.rotation.y = wx > 0 ? Math.PI / 2 : -Math.PI / 2;
      police.add(sideWindow);
    });

    // 3. High-Res Canvas Door Decals ("POLICE 911 // HIGHWAY PATROL")
    const dCanvas = document.createElement('canvas');
    dCanvas.width = 512; dCanvas.height = 256;
    const dctx = dCanvas.getContext('2d');
    dctx.fillStyle = '#f8fafc'; dctx.fillRect(0, 0, 512, 256);
    dctx.fillStyle = '#0f172a'; dctx.font = '900 70px sans-serif'; dctx.textAlign = 'center';
    dctx.fillText('POLICE', 256, 85);
    dctx.fillStyle = '#ef4444'; dctx.font = '700 42px sans-serif';
    dctx.fillText('★ 911 ★', 256, 142);
    dctx.fillStyle = '#1e293b'; dctx.font = '600 24px monospace';
    dctx.fillText('HIGHWAY PATROL // METRO DIV 9', 256, 192);

    const dTex = new THREE.CanvasTexture(dCanvas);
    const dMat = new THREE.MeshStandardMaterial({ map: dTex, roughness: 0.25, metalness: 0.4 });

    const leftDecal = new THREE.Mesh(new THREE.PlaneGeometry(12.5, 4.4), dMat);
    leftDecal.position.set(-8.15, 5.2, -0.8);
    leftDecal.rotation.y = -Math.PI / 2;
    police.add(leftDecal);

    const rightDecal = new THREE.Mesh(new THREE.PlaneGeometry(12.5, 4.4), dMat);
    rightDecal.position.set(8.15, 5.2, -0.8);
    rightDecal.rotation.y = Math.PI / 2;
    police.add(rightDecal);

    // 4. Heavy-Duty Steel Push Bumper (Bull-Bar)
    const bullBar = new THREE.Mesh(new THREE.BoxGeometry(15.2, 4.2, 2.2), bullBarMat);
    bullBar.position.set(0, 3.8, 18.4);
    police.add(bullBar);
    [-4.8, 4.8].forEach(px => {
      const pad = new THREE.Mesh(new THREE.BoxGeometry(1.6, 6.2, 2.4), bullBarMat);
      pad.position.set(px, 4.5, 18.5);
      police.add(pad);
    });

    // 5. Rooftop Emergency LED Strobe Lightbar (Red & Blue)
    const barBase = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.6, 2.6), bullBarMat);
    barBase.position.set(0, 10.2, -1.2);
    police.add(barBase);

    const redLight = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.4, 2.4), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    redLight.position.set(-2.6, 11.0, -1.2);
    police.add(redLight);

    const blueLight = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.4, 2.4), new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));
    blueLight.position.set(2.6, 11.0, -1.2);
    police.add(blueLight);

    // Spotlight on A-pillar
    const spotlight = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.6, 12), bullBarMat);
    spotlight.rotation.z = Math.PI / 3;
    spotlight.position.set(-6.2, 7.8, 4.2);
    police.add(spotlight);

    // 6. 4 Heavy-Duty Police Wheels
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.8 });
    const chromeCapMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.98, roughness: 0.08 });
    [
      [-8.3, 3.3, 11], [8.3, 3.3, 11],
      [-8.3, 3.3, -11], [8.3, 3.3, -11]
    ].forEach(wPos => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(3.3, 3.3, 2.2, 24), tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.position.set(wPos[0], wPos[1], wPos[2]);
      police.add(tire);

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 2.3, 16), chromeCapMat);
      cap.rotation.z = Math.PI / 2;
      cap.position.set(wPos[0], wPos[1], wPos[2]);
      police.add(cap);
    });

    police.userData = { redLight, blueLight, isRealGLB: false };
    return police;
  },

  // ========================================================
  // 4. PHOTOREALISTIC MODERN HIGH-RISE SKYSCRAPER
  // ========================================================
  createSkyscraper(width = 90, height = 260, depth = 90, tint = 'azure') {
    const tower = new THREE.Group();

    // High-Resolution Procedural Facade Texture
    const facadeTex = GTATextures.createSkyscraperFacade(tint);
    facadeTex.repeat.set(2, Math.floor(height / 45));

    const facadeMat = new THREE.MeshStandardMaterial({
      map: facadeTex,
      metalness: 0.85,
      roughness: 0.15
    });

    // Main Tower Column
    const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), facadeMat);
    body.position.y = height / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    tower.add(body);

    // Ground Floor Entrance Lobby (Glass Revolving Doors & Stone Canopy)
    const lobby = new THREE.Mesh(
      new THREE.BoxGeometry(width + 4, 16, depth + 4),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7, roughness: 0.25 })
    );
    lobby.position.y = 8;
    tower.add(lobby);

    // Grand Entrance Cantilever Canopy
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.5, 2, 24),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 })
    );
    canopy.position.set(0, 14, depth / 2 + 10);
    canopy.castShadow = true;
    tower.add(canopy);

    // Rooftop Mechanical Penthouse & Helipad
    const roofPenthouse = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.65, 24, depth * 0.65),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.4 })
    );
    roofPenthouse.position.y = height + 12;
    roofPenthouse.castShadow = true;
    tower.add(roofPenthouse);

    // Communications Antenna Mast with Flashing Aviation Light
    const mast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 1.2, 45, 8),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.1 })
    );
    mast.position.set(0, height + 46, 0);
    tower.add(mast);

    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    beacon.position.set(0, height + 68, 0);
    tower.add(beacon);

    return tower;
  },

  // ========================================================
  // 5. PHOTOREALISTIC NATURAL TREES & VILLAGE MONUMENTS
  // ========================================================

  // 5A. Photorealistic California Royal Palm Tree (Segmented Bark & Feathered Fronds)
  createPhotorealisticPalmTree(height = 28) {
    const palm = new THREE.Group();

    const trunkTex = window.GTATextures ? window.GTATextures.createPalmTrunkTexture() : null;
    if (trunkTex) trunkTex.repeat.set(1, 4);
    const trunkMat = new THREE.MeshStandardMaterial({
      map: trunkTex,
      color: 0x8d6e63,
      roughness: 0.9,
      metalness: 0.05
    });

    const frondTex = window.GTATextures ? window.GTATextures.createPalmFrondTexture() : null;
    const frondMat = new THREE.MeshStandardMaterial({
      map: frondTex,
      transparent: true,
      alphaTest: 0.25,
      side: THREE.DoubleSide,
      roughness: 0.7,
      metalness: 0.05
    });

    // Articulated Curved Trunk (5 segmented joints curving slightly with natural lean)
    const segments = 6;
    const segH = (height * 0.78) / segments;
    let currY = 0;
    let currX = 0;
    const curveAmount = (Math.random() - 0.5) * 0.12;

    for (let i = 0; i < segments; i++) {
      const rBottom = 1.6 - (i / segments) * 0.65;
      const rTop = 1.6 - ((i + 1) / segments) * 0.65;
      const segGeo = new THREE.CylinderGeometry(rTop, rBottom, segH, 12);
      const segMesh = new THREE.Mesh(segGeo, trunkMat);
      segMesh.position.set(currX, currY + segH / 2, 0);
      segMesh.rotation.z = curveAmount * (i + 1);
      segMesh.castShadow = true;
      segMesh.receiveShadow = true;
      palm.add(segMesh);

      currY += segH;
      currX += Math.sin(curveAmount * (i + 1)) * segH;
    }

    // Top Green Crownshaft
    const crownShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.95, 3.2, 12),
      new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.6 })
    );
    crownShaft.position.set(currX, currY + 1.6, 0);
    crownShaft.castShadow = true;
    palm.add(crownShaft);
    currY += 3.2;

    // Coconut / Fruit Clusters at Base of Crown
    const nutMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.8 });
    for (let c = 0; c < 7; c++) {
      const nut = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), nutMat);
      const angle = (c / 7) * Math.PI * 2;
      nut.position.set(currX + Math.cos(angle) * 1.1, currY - 0.5, Math.sin(angle) * 1.1);
      nut.castShadow = true;
      palm.add(nut);
    }

    // 16 Natural Drooping Palm Fronds (3 tiers: upper erect, middle spreading, lower weeping)
    const frondTiers = [
      { count: 5, length: 14, pitch: 0.55, yOffset: 0.8 },   // Upper young fronds
      { count: 6, length: 18, pitch: 0.12, yOffset: 0.2 },   // Middle spreading fronds
      { count: 5, length: 16, pitch: -0.42, yOffset: -0.6 }  // Lower weeping fronds
    ];

    frondTiers.forEach(tier => {
      for (let f = 0; f < tier.count; f++) {
        const yaw = (f / tier.count) * Math.PI * 2 + (tier.length * 0.2);
        const frondGroup = new THREE.Group();
        frondGroup.position.set(currX, currY + tier.yOffset, 0);
        frondGroup.rotation.y = yaw;
        frondGroup.rotation.x = tier.pitch;

        // Curved Frond Plane
        const frondGeo = new THREE.PlaneGeometry(tier.length, 3.8, 8, 1);
        // Curve the vertices downward along length
        const pos = frondGeo.attributes.position;
        for (let v = 0; v < pos.count; v++) {
          const vx = pos.getX(v);
          const drop = Math.pow(Math.max(0, vx / tier.length), 2) * 4.5;
          pos.setY(v, pos.getY(v) - drop);
        }
        frondGeo.computeVertexNormals();

        const frondMesh = new THREE.Mesh(frondGeo, frondMat);
        frondMesh.position.x = tier.length / 2;
        frondMesh.castShadow = true;
        frondGroup.add(frondMesh);

        palm.add(frondGroup);
      }
    });

    return palm;
  },

  // 5B. Photorealistic Organic Oak / Banyan Tree (Gnarled Trunk & Volumetric Leaves)
  createPhotorealisticOakTree(height = 26, leafColor = 0x166534) {
    const tree = new THREE.Group();

    const barkTex = window.GTATextures ? window.GTATextures.createTreeBarkTexture() : null;
    if (barkTex) barkTex.repeat.set(1, 3);
    const trunkMat = new THREE.MeshStandardMaterial({
      map: barkTex,
      color: 0x3e2723,
      roughness: 0.92,
      metalness: 0.05
    });

    const foliageTex = window.GTATextures ? window.GTATextures.createLeafFoliageTexture('#166534', '#4ade80') : null;
    const leafMat = new THREE.MeshStandardMaterial({
      map: foliageTex,
      color: leafColor,
      roughness: 0.82,
      metalness: 0.05,
      bumpScale: 0.15
    });

    // 1. Organic Flared Base & Main Trunk
    const baseTrunk = new THREE.Mesh(
      new THREE.CylinderGeometry(2.1, 3.4, height * 0.42, 14),
      trunkMat
    );
    baseTrunk.position.y = (height * 0.42) / 2;
    baseTrunk.castShadow = true;
    baseTrunk.receiveShadow = true;
    tree.add(baseTrunk);

    // 2. 4 Heavy Primary Branches Splitting Outward (Natural Gnarled Canopy Scaffold)
    const branchConfigs = [
      { x: 3.2, z: 2.8, rotX: 0.45, rotZ: -0.45, len: height * 0.38, r: 1.3 },
      { x: -3.4, z: 2.6, rotX: 0.4, rotZ: 0.52, len: height * 0.36, r: 1.2 },
      { x: 2.8, z: -3.2, rotX: -0.48, rotZ: -0.38, len: height * 0.39, r: 1.25 },
      { x: -3.1, z: -2.9, rotX: -0.42, rotZ: 0.46, len: height * 0.37, r: 1.2 },
      { x: 0, z: 0, rotX: 0.08, rotZ: 0.08, len: height * 0.45, r: 1.4 } // Center vertical leader
    ];

    branchConfigs.forEach(bc => {
      const bMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(bc.r * 0.65, bc.r, bc.len, 10),
        trunkMat
      );
      bMesh.position.set(bc.x * 0.5, height * 0.38 + bc.len * 0.45, bc.z * 0.5);
      bMesh.rotation.set(bc.rotX, 0, bc.rotZ);
      bMesh.castShadow = true;
      tree.add(bMesh);

      // Terminal Sub-canopy Foliage Clump for each main branch
      const clumpGeo = new THREE.IcosahedronGeometry(height * 0.28, 2);
      const clump = new THREE.Mesh(clumpGeo, leafMat);
      clump.position.set(bc.x * 1.6, height * 0.38 + bc.len * 0.9, bc.z * 1.6);
      clump.scale.set(1.2, 0.85, 1.1);
      clump.castShadow = true;
      clump.receiveShadow = true;
      tree.add(clump);
    });

    // 3. Central Grand Volumetric Foliage Crown (Layered for visual density)
    const crownCenter = new THREE.Mesh(
      new THREE.IcosahedronGeometry(height * 0.36, 2),
      leafMat
    );
    crownCenter.position.set(0, height * 0.84, 0);
    crownCenter.scale.set(1.3, 0.9, 1.2);
    crownCenter.castShadow = true;
    crownCenter.receiveShadow = true;
    tree.add(crownCenter);

    const crownTop = new THREE.Mesh(
      new THREE.IcosahedronGeometry(height * 0.26, 2),
      leafMat
    );
    crownTop.position.set(0, height * 1.05, 0);
    crownTop.scale.set(1.1, 0.8, 1.1);
    crownTop.castShadow = true;
    tree.add(crownTop);

    return tree;
  },

  // 5C. Photorealistic Flowering Blossom Tree (Jacaranda / Cherry Blossom)
  createPhotorealisticFloweringTree(height = 22, blossomColor = 0xf472b6) {
    const tree = this.createPhotorealisticOakTree(height, blossomColor);
    return tree;
  },

  // 5D. Photorealistic Evergreen Pine / Conifer Tree
  createPhotorealisticPineTree(height = 28) {
    const pine = new THREE.Group();

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x27170a, roughness: 0.9 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.6, height, 10), trunkMat);
    trunk.position.y = height / 2;
    trunk.castShadow = true;
    pine.add(trunk);

    const needleMat = new THREE.MeshStandardMaterial({
      color: 0x14532d,
      roughness: 0.85,
      metalness: 0.05
    });

    // 6 Stepped Tiers of Conifer Needles
    const tiers = 6;
    for (let t = 0; t < tiers; t++) {
      const tH = (height * 0.75) / tiers;
      const tY = height * 0.28 + t * tH;
      const tR = (1 - (t / tiers) * 0.8) * 8.5;

      const cone = new THREE.Mesh(new THREE.ConeGeometry(tR, tH * 1.5, 10), needleMat);
      cone.position.y = tY;
      cone.castShadow = true;
      cone.receiveShadow = true;
      pine.add(cone);
    }

    return pine;
  },

  // Backwards compatibility alias
  createLushTree(height = 24, leafColor = 0x15803d) {
    return this.createPhotorealisticOakTree(height, leafColor);
  },

  // ========================================================
  // 5E. GRAND 3D VILLAGE ENTRANCE MONUMENT PORTAL
  // ========================================================
  createVillageEntranceMonument(villageTitle, subtitle, themeColorHex = '#38bdf8', themeColorNum = 0x38bdf8) {
    const monument = new THREE.Group();

    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8, metalness: 0.2 });
    const accentMat = new THREE.MeshBasicMaterial({ color: themeColorNum });

    // Twin Stone Gateway Pylons
    [-24, 24].forEach(px => {
      const pylon = new THREE.Mesh(new THREE.BoxGeometry(4.5, 22, 5.5), stoneMat);
      pylon.position.set(px, 11, 0);
      pylon.castShadow = true;
      pylon.receiveShadow = true;
      monument.add(pylon);

      // Vertical Glowing Neon Accent Channels
      const channel = new THREE.Mesh(new THREE.BoxGeometry(0.8, 20, 0.4), accentMat);
      channel.position.set(px, 11, 2.8);
      monument.add(channel);

      // Top Monument Lantern
      const lantern = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), accentMat);
      lantern.position.set(px, 23.5, 0);
      monument.add(lantern);
    });

    // Grand Overhead Signboard Crossbeam
    const beam = new THREE.Mesh(new THREE.BoxGeometry(52, 4.5, 4), stoneMat);
    beam.position.set(0, 20.5, 0);
    beam.castShadow = true;
    monument.add(beam);

    // Backlit High-Resolution Arch Sign
    if (window.GTATextures && window.GTATextures.createVillageArchTexture) {
      const signTex = window.GTATextures.createVillageArchTexture(villageTitle, subtitle, themeColorHex);
      const signMat = new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide });
      const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(42, 10.5), signMat);
      signMesh.position.set(0, 16.5, 2.2);
      monument.add(signMesh);

      // Backside copy so visible when driving either direction
      const signBack = new THREE.Mesh(new THREE.PlaneGeometry(42, 10.5), signMat);
      signBack.position.set(0, 16.5, -2.2);
      signBack.rotation.y = Math.PI;
      monument.add(signBack);
    }

    // Downward Illuminating Spotlights
    const spot = new THREE.SpotLight(themeColorNum, 2.5, 45, Math.PI / 3, 0.5);
    spot.position.set(0, 22, 3);
    spot.target.position.set(0, 0, 0);
    monument.add(spot);
    monument.add(spot.target);

    return monument;
  },

  // ========================================================
  // 6. STREET FURNITURE & LIGHTING
  // ========================================================
  createHighwayStreetlight() {
    const lightGroup = new THREE.Group();

    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.3 });
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    // Tall Cobra Mast
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.1, 30, 8), metalMat);
    mast.position.y = 15;
    mast.castShadow = true;
    lightGroup.add(mast);

    // Curved Overhead Arm
    const arm = new THREE.Mesh(new THREE.BoxGeometry(8, 0.6, 0.6), metalMat);
    arm.position.set(3.5, 29.5, 0);
    lightGroup.add(arm);

    // Luminaire Housing
    const housing = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.8, 1.4), metalMat);
    housing.position.set(7.2, 29.2, 0);
    lightGroup.add(housing);

    // Glowing LED Lens
    const lens = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.1), bulbMat);
    lens.position.set(7.2, 28.7, 0);
    lens.rotation.x = Math.PI / 2;
    lightGroup.add(lens);

    // Downward Illuminating Spotlight (Casts real pool of light on asphalt)
    const spot = new THREE.SpotLight(0xffedd5, 1.8, 70, Math.PI / 4, 0.4, 1.2);
    spot.position.set(7.2, 28.5, 0);
    spot.target.position.set(7.2, 0, 0);
    lightGroup.add(spot);
    lightGroup.add(spot.target);

    return lightGroup;
  },

  // ========================================================
  // 7. GTA 5 INTERACTIVE GROUND WAYPOINTS & 3D ARCHITECTURAL SIGNAGE
  // ========================================================
  activeWaypoints: [],

  createGTAWaypoint({ x = 0, y = 0.5, z = 0, colorHex = '#f59e0b', colorNum = 0xf59e0b, icon = '★', title = '' }) {
    const wpGroup = new THREE.Group();
    wpGroup.position.set(x, y, z);

    // 1. Ground Ring Decal
    const ringTex = GTATextures.createWaypointRingTexture(colorHex, icon);
    const ringMat = new THREE.MeshBasicMaterial({
      map: ringTex,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.15;
    wpGroup.add(ring);

    // 2. Translucent Light Beacon Beam (Vertical Cylinder)
    const beamMat = new THREE.MeshBasicMaterial({
      color: colorNum,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 5.8, 16, 16, 1, true), beamMat);
    beam.position.y = 8;
    wpGroup.add(beam);

    // 3. Floating 3D Holographic Marker (Eye Level: y = 4.2m)
    const markerGroup = new THREE.Group();
    markerGroup.position.y = 4.2;

    const octaMat = new THREE.MeshBasicMaterial({
      color: colorNum,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    const octa = new THREE.Mesh(new THREE.OctahedronGeometry(2, 0), octaMat);
    markerGroup.add(octa);

    const coreMesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.2, 0),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    markerGroup.add(coreMesh);

    wpGroup.add(markerGroup);

    // Track for Animation in render loop
    const wpData = { group: wpGroup, ring, beam, markerGroup, baseOpacity: 0.25 };
    this.activeWaypoints.push(wpData);

    return wpGroup;
  },

  updateWaypoints(time) {
    if (!this.activeWaypoints || !this.activeWaypoints.length) return;
    for (let i = 0; i < this.activeWaypoints.length; i++) {
      const wp = this.activeWaypoints[i];
      if (!wp.group.parent) continue;

      // Rotate ground ring slowly
      if (wp.ring) wp.ring.rotation.z = time * 0.8;

      // Pulse beacon beam opacity
      if (wp.beam) {
        wp.beam.material.opacity = wp.baseOpacity + Math.sin(time * 3 + i) * 0.12;
      }

      // Bob & rotate hovering holographic diamond marker
      if (wp.markerGroup) {
        wp.markerGroup.rotation.y = time * 1.5;
        wp.markerGroup.position.y = 4.2 + Math.sin(time * 2.5 + i) * 0.45;
      }
    }
  },

  // Architectural Monolith Directory Totem (Ground Pylon Signage)
  createBuildingTotemSign(title, subtitle = '', badge = '', theme = 'gold', width = 14, height = 24) {
    const totem = new THREE.Group();

    // Heavy Matte Steel Base Footing
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7, metalness: 0.6 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(width + 2, 1.8, 5), baseMat);
    base.position.y = 0.9;
    base.castShadow = true;
    totem.add(base);

    // Dark Anodized Aluminum Pylon Body
    const pylonMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.35, metalness: 0.8 });
    const pylon = new THREE.Mesh(new THREE.BoxGeometry(width, height, 3.2), pylonMat);
    pylon.position.y = height / 2 + 1.2;
    pylon.castShadow = true;
    totem.add(pylon);

    // Front & Back Illuminated Signage Panels with Real Graphics & Typography
    const signTex = GTATextures.createSignageTexture(title, subtitle, badge, theme);
    const signMat = new THREE.MeshBasicMaterial({ map: signTex });

    const frontPanel = new THREE.Mesh(new THREE.PlaneGeometry(width - 1.2, height * 0.4), signMat);
    frontPanel.position.set(0, height * 0.65, 1.65);
    totem.add(frontPanel);

    const backPanel = new THREE.Mesh(new THREE.PlaneGeometry(width - 1.2, height * 0.4), signMat);
    backPanel.position.set(0, height * 0.65, -1.65);
    backPanel.rotation.y = Math.PI;
    totem.add(backPanel);

    // Glowing Top Accent Light Strip
    const topAccent = new THREE.Mesh(
      new THREE.BoxGeometry(width - 0.5, 0.8, 3.4),
      new THREE.MeshBasicMaterial({ color: theme === 'gold' ? 0xf59e0b : (theme === 'azure' ? 0x0284c7 : 0x10b981) })
    );
    topAccent.position.y = height + 1.2;
    totem.add(topAccent);

    return totem;
  },

  // Giant Commercial Highway & Facade LED Billboard with Real Photographic Assets
  createRealAssetBillboard(width = 64, height = 36, assetKey = 'supercarStreet', title = '', badge = '') {
    const billboard = new THREE.Group();

    // Heavy Industrial Steel Truss Columns & Concrete Pedestals
    const trussMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.35 });
    const concMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.85 });

    const span = width * 0.38;
    [-span, span].forEach(bx => {
      const footing = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 6), concMat);
      footing.position.set(bx, 2, 0);
      footing.castShadow = true;
      billboard.add(footing);

      const column = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.8, 42, 8), trussMat);
      column.position.set(bx, 23, 0);
      column.castShadow = true;
      billboard.add(column);
    });

    // Steel Backing Frame
    const frame = new THREE.Mesh(new THREE.BoxGeometry(width + 2, height + 2, 3), trussMat);
    frame.position.set(0, 44 + height / 2, 0);
    frame.castShadow = true;
    billboard.add(frame);

    // Maintenance Service Catwalk & Safety Railing
    const catwalk = new THREE.Mesh(new THREE.BoxGeometry(width + 4, 1.2, 5), trussMat);
    catwalk.position.set(0, 43, 2.5);
    billboard.add(catwalk);

    // Real Photographic Asset Backlit Display Face
    const photoTex = GTATextures.getRealAssetTexture(assetKey, 1, 1);
    const displayMat = new THREE.MeshStandardMaterial({
      map: photoTex,
      roughness: 0.25,
      metalness: 0.1
    });
    const display = new THREE.Mesh(new THREE.PlaneGeometry(width, height), displayMat);
    display.position.set(0, 44 + height / 2, 1.55);
    billboard.add(display);

    // 4 Angled Overhead Floodlights Casting Light Downwards
    const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const numLights = 4;
    for (let i = 0; i < numLights; i++) {
      const lx = -width * 0.38 + (i / (numLights - 1)) * (width * 0.76);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 7), fixtureMat);
      arm.position.set(lx, 44 + height + 2, 3.5);
      billboard.add(arm);

      const lamp = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 2.2), fixtureMat);
      lamp.position.set(lx, 44 + height + 1.6, 7);
      lamp.rotation.x = 0.45;
      billboard.add(lamp);

      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.9, 8, 8), bulbMat);
      bulb.position.set(lx, 44 + height + 1.2, 7);
      billboard.add(bulb);
    }

    return billboard;
  },

  // Photorealistic Coastal Lighthouse
  createCoastalLighthouse() {
    const lh = new THREE.Group();

    // 1. Heavy Rocky Granite Foundation
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.95 });
    const rockBase = new THREE.Mesh(new THREE.CylinderGeometry(26, 32, 14, 12), rockMat);
    rockBase.position.y = 7;
    rockBase.castShadow = true;
    rockBase.receiveShadow = true;
    lh.add(rockBase);

    // 2. White Masonry Lower Tower Section
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45 });
    const lowerTower = new THREE.Mesh(new THREE.CylinderGeometry(14, 20, 60, 16), whiteMat);
    lowerTower.position.y = 44;
    lowerTower.castShadow = true;
    lh.add(lowerTower);

    // 3. Iconic Red Navigation Band Upper Section
    const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
    const upperTower = new THREE.Mesh(new THREE.CylinderGeometry(11, 14, 30, 16), redMat);
    upperTower.position.y = 89;
    upperTower.castShadow = true;
    lh.add(upperTower);

    // 4. Observation Gallery Catwalk & Iron Railings
    const galleryMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.7 });
    const gallery = new THREE.Mesh(new THREE.CylinderGeometry(16, 16, 2.5, 16), galleryMat);
    gallery.position.y = 105;
    lh.add(gallery);

    const railing = new THREE.Mesh(new THREE.CylinderGeometry(15.8, 15.8, 4, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0x1e293b, wireframe: true }));
    railing.position.y = 107.5;
    lh.add(railing);

    // 5. 3D Glass Lantern Room with Fresnel Prism Lens
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.85,
      transparent: true,
      opacity: 0.65
    });
    const lantern = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 14, 16), glassMat);
    lantern.position.y = 113;
    lh.add(lantern);

    // Powerful Rotating Core Beacon Bulb
    const beaconBulb = new THREE.Mesh(new THREE.SphereGeometry(3.5, 12, 12), new THREE.MeshBasicMaterial({ color: 0xfffbeb }));
    beaconBulb.position.y = 113;
    lh.add(beaconBulb);

    // 6. Copper Domed Verdigris Spire Roof
    const copperMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.4, metalness: 0.6 });
    const dome = new THREE.Mesh(new THREE.ConeGeometry(12, 12, 16), copperMat);
    dome.position.y = 126;
    lh.add(dome);

    // Brass Lightning Rod & Weather Vane
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 14, 8), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9 }));
    rod.position.y = 138;
    lh.add(rod);

    // 7. Volumetric Rotating Ocean Spotlight Beam
    const beamCone = new THREE.Mesh(
      new THREE.ConeGeometry(80, 480, 24, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    beamCone.rotation.x = Math.PI / 2;
    beamCone.position.set(0, 113, 240);

    const rotatingBeaconGroup = new THREE.Group();
    rotatingBeaconGroup.position.set(0, 0, 0);
    rotatingBeaconGroup.add(beamCone);
    lh.add(rotatingBeaconGroup);
    lh.userData = { rotatingBeacon: rotatingBeaconGroup };

    return lh;
  },

  // Photorealistic International Airport Runway & Orbital Launchpad Complex
  createInternationalSpaceport() {
    const spaceport = new THREE.Group();

    // 1. Long High-Speed Runway Tarmac with Real Markings
    const runwayTex = GTATextures.createRunwayTexture();
    const runwayMat = new THREE.MeshStandardMaterial({
      map: runwayTex,
      roughness: 0.78,
      metalness: 0.15
    });
    const runway = new THREE.Mesh(new THREE.PlaneGeometry(140, 950), runwayMat);
    runway.rotation.x = -Math.PI / 2;
    runway.position.set(0, 0.45, 0);
    runway.receiveShadow = true;
    spaceport.add(runway);

    // Runway Edge Inset Landing Lights (Green approach, white center, red rollout)
    const bulbMatGreen = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const bulbMatWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const bulbMatRed = new THREE.MeshBasicMaterial({ color: 0xef4444 });

    for (let z = -440; z <= 440; z += 55) {
      [-72, 72].forEach(x => {
        let mat = bulbMatWhite;
        if (z < -360) mat = bulbMatGreen;
        else if (z > 360) mat = bulbMatRed;
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(1.2, 8, 8), mat);
        bulb.position.set(x, 1, z);
        spaceport.add(bulb);
      });
    }

    // 2. Air Traffic Control Tower with Rotating Radar Dish
    const towerMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.45 });
    const atcBase = new THREE.Mesh(new THREE.CylinderGeometry(8, 12, 75, 12), towerMat);
    atcBase.position.set(-140, 37.5, -120);
    atcBase.castShadow = true;
    spaceport.add(atcBase);

    // Octagonal Glass Cab
    const atcCab = new THREE.Mesh(
      new THREE.CylinderGeometry(15, 12, 14, 8),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.1, transparent: true, opacity: 0.85 })
    );
    atcCab.position.set(-140, 82, -120);
    spaceport.add(atcCab);

    // Rotating Radar Dish
    const dishMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 });
    const radarDish = new THREE.Mesh(new THREE.CylinderGeometry(10, 0.5, 2, 16), dishMat);
    radarDish.rotation.z = Math.PI / 3;
    const radarGroup = new THREE.Group();
    radarGroup.position.set(-140, 93, -120);
    radarGroup.add(radarDish);
    spaceport.add(radarGroup);
    spaceport.userData = { radarGroup };

    // 3. Aerospace Hangar with Real Realm Earth Space Mural
    const hangarMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const hangar = new THREE.Mesh(new THREE.BoxGeometry(110, 45, 130), hangarMat);
    hangar.position.set(-140, 22.5, 120);
    hangar.castShadow = true;
    spaceport.add(hangar);

    // Giant Real Earth/Space Mission Mural on Hangar Facade
    const muralTex = GTATextures.getRealAssetTexture('realmEarth', 1, 1);
    const mural = new THREE.Mesh(new THREE.PlaneGeometry(95, 36), new THREE.MeshStandardMaterial({ map: muralTex, roughness: 0.3 }));
    mural.position.set(-84, 23, 120);
    mural.rotation.y = Math.PI / 2;
    spaceport.add(mural);

    // 4. Orbital Launchpad Steel Gantry & Rocket
    const gantryMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.7, roughness: 0.4 });
    const gantry = new THREE.Mesh(new THREE.BoxGeometry(22, 135, 22), gantryMat);
    gantry.position.set(130, 67.5, 0);
    gantry.castShadow = true;
    spaceport.add(gantry);

    // Orbital Multi-Stage Rocket
    const rocketMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.2 });
    const rocketBody = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 95, 24), rocketMat);
    rocketBody.position.set(130, 52, 0);
    rocketBody.castShadow = true;
    spaceport.add(rocketBody);

    const noseCone = new THREE.Mesh(new THREE.ConeGeometry(6, 20, 24), new THREE.MeshStandardMaterial({ color: 0x18181b }));
    noseCone.position.set(130, 109.5, 0);
    spaceport.add(noseCone);

    return spaceport;
  },

  // Vast Pacific Ocean Water Surface along the West Coast
  createPacificOcean(width = 2400, length = 3800) {
    const oceanGroup = new THREE.Group();

    const waterTex = GTATextures.createOceanWaterTexture();
    const oceanMat = new THREE.MeshStandardMaterial({
      map: waterTex,
      color: 0x0284c7,
      metalness: 0.88,
      roughness: 0.12,
      transparent: true,
      opacity: 0.94
    });

    const oceanPlane = new THREE.Mesh(new THREE.PlaneGeometry(width, length), oceanMat);
    oceanPlane.rotation.x = -Math.PI / 2;
    oceanPlane.position.set(-1100, -2, 0);
    oceanPlane.receiveShadow = true;
    oceanGroup.add(oceanPlane);

    // Dramatic Rocky Sea-Cliff Barrier Wall separating highway from ocean
    const cliffMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.92 });
    const seaCliff = new THREE.Mesh(new THREE.BoxGeometry(35, 18, length), cliffMat);
    seaCliff.position.set(-460, 4, 0);
    seaCliff.castShadow = true;
    seaCliff.receiveShadow = true;
    oceanGroup.add(seaCliff);

    // Continuous Ocean Safety Barrier & Concrete Balustrade
    const railMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5, metalness: 0.4 });
    const barrier = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.8, length), railMat);
    barrier.position.set(-443, 14.5, 0);
    barrier.castShadow = true;
    oceanGroup.add(barrier);

    return oceanGroup;
  },

  // ========================================================
  // 12. INTERSTATE HIGHWAY DIRECTIONAL OVERHEAD GANTRY SIGN
  // ========================================================
  createHighwayDirectionGantry(title, leftDest, straightDest, rightDest, span = 92) {
    const gantry = new THREE.Group();

    const steelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.25 });
    const concMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });

    // Twin Highway Shoulder Support Columns
    [-span / 2, span / 2].forEach(cx => {
      const footing = new THREE.Mesh(new THREE.BoxGeometry(5.5, 3.5, 5.5), concMat);
      footing.position.set(cx, 1.75, 0);
      footing.castShadow = true;
      gantry.add(footing);

      const column = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.1, 32, 8), steelMat);
      column.position.set(cx, 17.5, 0);
      column.castShadow = true;
      gantry.add(column);
    });

    // Overhead Steel Truss Beam
    const beam = new THREE.Mesh(new THREE.BoxGeometry(span + 6, 4.2, 4.5), steelMat);
    beam.position.set(0, 31, 0);
    beam.castShadow = true;
    gantry.add(beam);

    // Green Interstate Signboard Face (Double-sided)
    if (window.GTATextures && window.GTATextures.createDirectionalSignTexture) {
      const signTex = window.GTATextures.createDirectionalSignTexture(title, leftDest, straightDest, rightDest);
      const signMat = new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide });

      // Sign facing oncoming traffic (+Z)
      const signFace = new THREE.Mesh(new THREE.PlaneGeometry(span * 0.72, 18), signMat);
      signFace.position.set(0, 26, 2.4);
      gantry.add(signFace);

      // Sign facing reverse traffic (-Z)
      const signBack = new THREE.Mesh(new THREE.PlaneGeometry(span * 0.72, 18), signMat);
      signBack.position.set(0, 26, -2.4);
      signBack.rotation.y = Math.PI;
      gantry.add(signBack);
    }

    // Downward Illuminating Spotlights
    const spot = new THREE.SpotLight(0xfffaed, 2.0, 50, Math.PI / 3, 0.4);
    spot.position.set(0, 32, 3);
    spot.target.position.set(0, 0, 0);
    gantry.add(spot);
    gantry.add(spot.target);

    return gantry;
  },

  // ========================================================
  // 13. MAJESTIC 3D ROCKY MOUNTAIN RIDGE (GTA 5 Mount Chiliad Style)
  // ========================================================
  createMountainRidge(width = 3200, depth = 900, maxHeight = 420, peakCount = 7) {
    const mountainGroup = new THREE.Group();

    const rockTex = window.GTATextures ? window.GTATextures.createMountainRockTexture() : null;
    const rockMat = new THREE.MeshStandardMaterial({
      map: rockTex,
      color: 0x475569,
      roughness: 0.95,
      metalness: 0.05
    });

    const snowMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.6,
      metalness: 0.1
    });

    // Build series of intersecting mountain peaks along the ridge
    for (let p = 0; p < peakCount; p++) {
      const px = -width / 2 + (p / (peakCount - 1)) * width + (Math.random() - 0.5) * 120;
      const pz = (Math.random() - 0.5) * (depth * 0.4);
      const pH = maxHeight * (0.65 + Math.random() * 0.35);
      const pR = (depth * 0.45) * (0.8 + Math.random() * 0.4);

      // Main Rocky Cone Peak
      const peakGeo = new THREE.ConeGeometry(pR, pH, 10, 4);
      const peakMesh = new THREE.Mesh(peakGeo, rockMat);
      peakMesh.position.set(px, pH / 2, pz);
      peakMesh.rotation.y = Math.random() * Math.PI;
      peakMesh.castShadow = true;
      peakMesh.receiveShadow = true;
      mountainGroup.add(peakMesh);

      // Snowy Peak Cap
      const snowGeo = new THREE.ConeGeometry(pR * 0.35, pH * 0.28, 10);
      const snowMesh = new THREE.Mesh(snowGeo, snowMat);
      snowMesh.position.set(px, pH - (pH * 0.14), pz);
      snowMesh.rotation.y = peakMesh.rotation.y;
      mountainGroup.add(snowMesh);

      // Clean majestic mountain ridge silhouette without unnecessary micro-mesh overhead
    }

    return mountainGroup;
  },

  // ========================================================
  // 14. REALISTIC STREET ROADSIDE DIRECTIONAL SIGNBOARD / FINGERPOST
  // ========================================================
  createStreetDirectionSign(plates = [
    { dir: '⬅', dest: 'EDUCATION VILLAGE', dist: '200m', color: '#0369a1' },
    { dir: '⬆', dest: 'EXPERIENCE TECH PARK', dist: '300m', color: '#047857' },
    { dir: '➡', dest: 'SKILLS MATRIX', dist: '150m', color: '#6d28d9' }
  ]) {
    const signGroup = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.2 });
    const concMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });

    // Concrete Footing
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.8, 1.5, 12), concMat);
    base.position.y = 0.75;
    base.castShadow = true;
    signGroup.add(base);

    // Steel Vertical Pole
    const poleHeight = 14 + plates.length * 3.2;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, poleHeight, 12), metalMat);
    pole.position.y = poleHeight / 2;
    pole.castShadow = true;
    signGroup.add(pole);

    // Add plates
    plates.forEach((p, idx) => {
      const plateY = poleHeight - 2.5 - idx * 3.4;

      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = p.color || '#15803d';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(4, 4, 504, 120, 14);
      } else {
        ctx.rect(4, 4, 504, 120);
      }
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(8, 8, 496, 112, 10);
      } else {
        ctx.rect(8, 8, 496, 112);
      }
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';

      const label = `${p.dir} ${p.dest}`;
      ctx.fillText(label, 20, 64);

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 30px "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(p.dist || '', 488, 64);

      const tex = new THREE.CanvasTexture(canvas);
      const plateMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
      const plateMesh = new THREE.Mesh(new THREE.PlaneGeometry(12, 3), plateMat);
      plateMesh.position.set(0, plateY, 0.2);
      signGroup.add(plateMesh);

      const plateBack = new THREE.Mesh(new THREE.PlaneGeometry(12, 3), plateMat);
      plateBack.position.set(0, plateY, -0.2);
      plateBack.rotation.y = Math.PI;
      signGroup.add(plateBack);

      const clamp = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 0.6), metalMat);
      clamp.position.set(0, plateY, 0);
      signGroup.add(clamp);
    });

    return signGroup;
  },

  // ========================================================
  // 15. LOS SANTOS CUSTOMS // 24/7 AUTO REPAIR & TUNING WORKSHOP
  // ========================================================
  createAutoRepairWorkshop() {
    const workshop = new THREE.Group();

    const concMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.85, metalness: 0.1 });
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7, metalness: 0.3 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.25 });
    const yellowHazardMat = new THREE.MeshStandardMaterial({
      map: window.GTATextures ? window.GTATextures.createHazardStripeTexture() : null,
      roughness: 0.6
    });
    const corrugatedMat = new THREE.MeshStandardMaterial({
      map: window.GTATextures ? window.GTATextures.createCorrugatedMetalTexture() : null,
      roughness: 0.5,
      metalness: 0.6
    });

    // 1. Concrete Foundation Plinth & Service Apron
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(94, 2.5, 74), concMat);
    plinth.position.set(0, 1.25, 0);
    plinth.receiveShadow = true;
    workshop.add(plinth);

    // 2. Main Workshop Building Body
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(90, 28, 66), wallMat);
    mainBody.position.set(0, 16.5, -4);
    mainBody.castShadow = true;
    mainBody.receiveShadow = true;
    workshop.add(mainBody);

    // Roof Trusses & Skylight Glass
    const roof = new THREE.Mesh(new THREE.BoxGeometry(94, 2.5, 72), steelMat);
    roof.position.set(0, 31, -4);
    workshop.add(roof);

    // 3. Dual Open Garage Service Bays
    const apronGeo = new THREE.PlaneGeometry(28, 22);
    const apron1 = new THREE.Mesh(apronGeo, yellowHazardMat);
    apron1.rotation.x = -Math.PI / 2;
    apron1.position.set(-22, 2.55, 24);
    workshop.add(apron1);

    const apron2 = new THREE.Mesh(apronGeo, yellowHazardMat);
    apron2.rotation.x = -Math.PI / 2;
    apron2.position.set(22, 2.55, 24);
    workshop.add(apron2);

    // Roll-Up Bay Doors (Bay 1 Open, Bay 2 Semi-Open)
    const bayDoor1 = new THREE.Mesh(new THREE.PlaneGeometry(26, 6), corrugatedMat);
    bayDoor1.position.set(-22, 26, 29.2);
    workshop.add(bayDoor1);

    const bayDoor2 = new THREE.Mesh(new THREE.PlaneGeometry(26, 14), corrugatedMat);
    bayDoor2.position.set(22, 22, 29.2);
    workshop.add(bayDoor2);

    // Dark interior hollow
    const hollowMat = new THREE.MeshBasicMaterial({ color: 0x050508 });
    const hollow1 = new THREE.Mesh(new THREE.PlaneGeometry(26, 21), hollowMat);
    hollow1.position.set(-22, 13, 28.9);
    workshop.add(hollow1);

    const hollow2 = new THREE.Mesh(new THREE.PlaneGeometry(26, 12), hollowMat);
    hollow2.position.set(22, 8.5, 28.9);
    workshop.add(hollow2);

    // 4. Large Glowing Neon Workshop Sign
    if (window.GTATextures && window.GTATextures.createWorkshopSignTexture) {
      const signTex = window.GTATextures.createWorkshopSignTexture();
      const signMat = new THREE.MeshBasicMaterial({ map: signTex });
      const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(74, 18), signMat);
      signMesh.position.set(0, 24, 29.6);
      workshop.add(signMesh);
    }

    // 5. Hydraulic 2-Post Vehicle Lift in Bay 1 with elevated sports car
    const liftGroup = new THREE.Group();
    const liftPostMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 });
    [-7.5, 7.5].forEach(lx => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(1.6, 18, 1.6), liftPostMat);
      post.position.set(lx, 9, 0);
      post.castShadow = true;
      liftGroup.add(post);

      const arm = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 8), steelMat);
      arm.position.set(lx, 10, 0);
      liftGroup.add(arm);
    });

    const elevatedCar = new THREE.Mesh(new THREE.BoxGeometry(12, 3.8, 24), new THREE.MeshLambertMaterial({ color: 0xef4444 }));
    elevatedCar.position.set(0, 11.5, 0);
    elevatedCar.castShadow = true;
    liftGroup.add(elevatedCar);

    liftGroup.position.set(-22, 2.5, 14);
    workshop.add(liftGroup);

    // 6. Rolling Mechanic Tool Chests & Workbenches
    const toolMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.7, roughness: 0.3 });
    [-38, 38].forEach(tx => {
      const chest = new THREE.Mesh(new THREE.BoxGeometry(6, 7, 3), toolMat);
      chest.position.set(tx, 6, 26);
      chest.castShadow = true;
      workshop.add(chest);

      for (let t = 0; t < 3; t++) {
        const tire = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 1.4, 12), steelMat);
        tire.position.set(tx > 0 ? 38 : -38, 3.2 + t * 1.5, 18);
        workshop.add(tire);
      }
    });

    // 7. Blue 55-Gallon Oil Drums
    const drumMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.6, roughness: 0.4 });
    [[-36, 10], [-36, 6], [36, 10]].forEach(dp => {
      const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 5, 12), drumMat);
      drum.position.set(dp[0], 5, dp[1]);
      drum.castShadow = true;
      workshop.add(drum);
    });

    // 8. 3D Animated Mechanics Working in Bay
    const createMechanicMesh = () => {
      const mech = new THREE.Group();
      const suitMat = new THREE.MeshLambertMaterial({ color: 0x1e3a8a });
      const vestMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
      const skinMat = new THREE.MeshLambertMaterial({ color: 0xd4a373 });

      const torso = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.5, 1.4), vestMat);
      torso.position.y = 5.5;
      mech.add(torso);

      const head = new THREE.Mesh(new THREE.SphereGeometry(1.1, 10, 10), skinMat);
      head.position.y = 8;
      mech.add(head);

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.6, 10), new THREE.MeshLambertMaterial({ color: 0x0f172a }));
      cap.position.y = 8.8;
      mech.add(cap);

      [-0.7, 0.7].forEach(lx => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.9, 3.8, 1), suitMat);
        leg.position.set(lx, 2, 0);
        mech.add(leg);
      });

      return mech;
    };

    const mech1 = createMechanicMesh();
    mech1.position.set(-26, 2.5, 20);
    workshop.add(mech1);

    const mech2 = createMechanicMesh();
    mech2.position.set(-18, 2.5, 16);
    mech2.rotation.y = Math.PI / 2;
    workshop.add(mech2);

    // 9. Ambient Workshop Work-Light
    const workLight = new THREE.PointLight(0x38bdf8, 2.2, 45);
    workLight.position.set(-22, 14, 18);
    workshop.add(workLight);

    // 10. GTA Waypoint Ring & Totem Sign
    if (window.GTAModels && window.GTAModels.createGTAWaypoint) {
      const wp = window.GTAModels.createGTAWaypoint({
        x: 0, y: 2.6, z: 28,
        colorHex: '#f59e0b', colorNum: 0xf59e0b,
        icon: '🔧', title: 'Los Santos Customs Workshop'
      });
      workshop.add(wp);
    }

    if (window.GTAModels && window.GTAModels.createBuildingTotemSign) {
      const totem = window.GTAModels.createBuildingTotemSign(
        'LOS SANTOS CUSTOMS',
        '24/7 AUTO REPAIR, TOWING & PERFORMANCE TUNING',
        'SERVICE',
        'gold'
      );
      totem.position.set(40, 0, 32);
      workshop.add(totem);
    }

    return workshop;
  },

  // ========================================================
  // 16. LOS SANTOS CUSTOMS FLATBED TOW TRUCK / RECOVERY VEHICLE
  // ========================================================
  createTowTruckModel() {
    const truck = new THREE.Group();

    const cabMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6, roughness: 0.3 });
    const bedMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.95, roughness: 0.1 });
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x18181b });

    // 1. Heavy-duty Truck Cab
    const cab = new THREE.Mesh(new THREE.BoxGeometry(15, 8.5, 16), cabMat);
    cab.position.set(0, 6.5, 14);
    cab.castShadow = true;
    truck.add(cab);

    // Windshield
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 });
    const windshield = new THREE.Mesh(new THREE.PlaneGeometry(13, 5), glassMat);
    windshield.position.set(0, 8, 22.1);
    truck.add(windshield);

    // Chrome Grille & Bumper
    const grille = new THREE.Mesh(new THREE.BoxGeometry(12, 4.5, 1), chromeMat);
    grille.position.set(0, 4.5, 22.2);
    truck.add(grille);

    const bumper = new THREE.Mesh(new THREE.BoxGeometry(16, 2.5, 3), chromeMat);
    bumper.position.set(0, 2.5, 23);
    truck.add(bumper);

    // Dual Chrome Diesel Stacks
    [-7, 7].forEach(sx => {
      const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 16, 12), chromeMat);
      stack.position.set(sx, 12, 6);
      truck.add(stack);
    });

    // 2. Long Diamond-Plate Steel Flatbed Tray
    const flatbed = new THREE.Mesh(new THREE.BoxGeometry(16, 2, 34), bedMat);
    flatbed.position.set(0, 4.5, -11);
    flatbed.castShadow = true;
    flatbed.receiveShadow = true;
    truck.add(flatbed);

    // Tow Winch Crane Boom
    const headacheRack = new THREE.Mesh(new THREE.BoxGeometry(15, 9, 1.5), bedMat);
    headacheRack.position.set(0, 9, 5);
    truck.add(headacheRack);

    const boomArm = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 18), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    boomArm.position.set(0, 8, -6);
    boomArm.rotation.x = -0.25;
    truck.add(boomArm);

    // 3. Flashing Amber Strobe Lightbar on Roof
    const strobeGroup = new THREE.Group();
    const barFrame = new THREE.Mesh(new THREE.BoxGeometry(10, 1.2, 2.5), chromeMat);
    barFrame.position.set(0, 11.2, 14);
    strobeGroup.add(barFrame);

    const amberLensMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const amberLight = new THREE.Mesh(new THREE.BoxGeometry(9.6, 1, 2.2), amberLensMat);
    amberLight.position.set(0, 11.8, 14);
    strobeGroup.add(amberLight);

    truck.add(strobeGroup);
    truck.userData.strobeLight = amberLight;

    // 4. Wheels
    [[-8, 2.8, 15], [8, 2.8, 15], [-8, 2.8, -12], [8, 2.8, -12], [-8, 2.8, -20], [8, 2.8, -20]].forEach(wp => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 2.2, 14), wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wp[0], wp[1], wp[2]);
      wheel.castShadow = true;
      truck.add(wheel);
    });

    return truck;
  },

  // ========================================================
  // 17. 24-7 RON OIL GAS STATION & CONVENIENCE MART
  // ========================================================
  createRonOilGasStation() {
    const station = new THREE.Group();

    const concMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.25 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.8 });

    // 1. Gas Canopy
    const canopyRoof = new THREE.Mesh(new THREE.BoxGeometry(70, 4, 38), redMat);
    canopyRoof.position.set(0, 22, 0);
    canopyRoof.castShadow = true;
    station.add(canopyRoof);

    // Glowing Canopy Fascia
    const fascia = new THREE.Mesh(new THREE.BoxGeometry(70.5, 2.5, 38.5), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
    fascia.position.set(0, 22, 0);
    station.add(fascia);

    // 4 Canopy Columns
    [[-24, -12], [-24, 12], [24, -12], [24, 12]].forEach(cp => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 22, 12), steelMat);
      col.position.set(cp[0], 11, cp[1]);
      col.castShadow = true;
      station.add(col);
    });

    // 2. Fuel Pump Islands
    [[-16, 0], [16, 0]].forEach(ip => {
      const island = new THREE.Mesh(new THREE.BoxGeometry(8, 0.8, 28), concMat);
      island.position.set(ip[0], 0.4, ip[1]);
      station.add(island);

      [-8, 8].forEach(pz => {
        const pump = new THREE.Mesh(new THREE.BoxGeometry(3.5, 8.5, 3.5), redMat);
        pump.position.set(ip[0], 4.65, ip[1] + pz);
        station.add(pump);

        const pumpScreen = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2), new THREE.MeshBasicMaterial({ color: 0x000000 }));
        pumpScreen.position.set(ip[0] + 1.8, 5.5, ip[1] + pz);
        pumpScreen.rotation.y = Math.PI / 2;
        station.add(pumpScreen);
      });
    });

    // 3. Convenience Store Building behind pumps
    const store = new THREE.Mesh(new THREE.BoxGeometry(60, 18, 30), concMat);
    store.position.set(0, 9, -45);
    store.castShadow = true;
    station.add(store);

    const storeGlass = new THREE.Mesh(new THREE.PlaneGeometry(45, 12), glassMat);
    storeGlass.position.set(0, 7.5, -29.8);
    station.add(storeGlass);

    const storeSign = new THREE.Mesh(new THREE.BoxGeometry(36, 4, 1), redMat);
    storeSign.position.set(0, 15, -29.5);
    station.add(storeSign);

    // 4. LED Price Totem Sign
    const totem = new THREE.Group();
    const tPole = new THREE.Mesh(new THREE.BoxGeometry(2, 28, 2), steelMat);
    tPole.position.y = 14;
    totem.add(tPole);

    const tBoard = new THREE.Mesh(new THREE.BoxGeometry(10, 16, 2), redMat);
    tBoard.position.y = 20;
    totem.add(tBoard);

    const tLed = new THREE.Mesh(new THREE.PlaneGeometry(8, 12), new THREE.MeshBasicMaterial({ color: 0x15803d }));
    tLed.position.set(0, 20, 1.1);
    totem.add(tLed);

    totem.position.set(42, 0, 16);
    station.add(totem);

    return station;
  },

  // ========================================================
  // 18. MODERN GLASS BUS STOP TRANSIT SHELTER
  // ========================================================
  createBusStopShelter() {
    const shelter = new THREE.Group();

    const steelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.2 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5, roughness: 0.1 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });

    [-7, 7].forEach(px => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 12, 8), steelMat);
      pole.position.set(px, 6, -2);
      shelter.add(pole);
    });

    const roof = new THREE.Mesh(new THREE.BoxGeometry(16, 0.6, 7), steelMat);
    roof.position.set(0, 12, 0.5);
    shelter.add(roof);

    const rearGlass = new THREE.Mesh(new THREE.PlaneGeometry(13.8, 10.5), glassMat);
    rearGlass.position.set(0, 6.5, -2);
    shelter.add(rearGlass);

    const sideGlass = new THREE.Mesh(new THREE.PlaneGeometry(6, 10.5), glassMat);
    sideGlass.rotation.y = Math.PI / 2;
    sideGlass.position.set(7.5, 6.5, 0.8);
    shelter.add(sideGlass);

    const bench = new THREE.Mesh(new THREE.BoxGeometry(12, 0.6, 2.2), woodMat);
    bench.position.set(0, 2.6, -0.6);
    shelter.add(bench);

    const totem = new THREE.Mesh(new THREE.BoxGeometry(2.4, 9, 0.8), new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
    totem.position.set(-8.5, 4.5, -0.6);
    shelter.add(totem);

    return shelter;
  }
};

window.GTAModels = GTAModels;

