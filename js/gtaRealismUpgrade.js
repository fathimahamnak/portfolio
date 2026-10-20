// ========================================================
// PHOTOREALISTIC ARCHITECTURE UPGRADE MODULE
// Transforms basic box buildings into detailed real-world architecture
// with setbacks, window mullions, ledges, balconies, AC units,
// rooftop structures, and proper PBR materials
// ========================================================

const GTARealismUpgrade = {

  // Enhanced materials library with PBR properties
  materials: {},

  initMaterials(envMap) {
    const em = envMap || null;

    this.materials = {
      // Polished glass curtain wall (Optimized PBR reflection without costly physical clearcoat)
      glass: new THREE.MeshStandardMaterial({
        color: 0x88ccee,
        metalness: 0.85,
        roughness: 0.1,
        transparent: true,
        opacity: 0.72,
        envMap: em,
        envMapIntensity: 1.2
      }),

      // Exposed concrete (brutalist panels)
      concrete: new THREE.MeshStandardMaterial({
        color: 0x8b95a2,
        roughness: 0.88,
        metalness: 0.08,
        envMap: em,
        envMapIntensity: 0.15
      }),

      // Dark concrete / weathered
      concreteDark: new THREE.MeshStandardMaterial({
        color: 0x4b5563,
        roughness: 0.92,
        metalness: 0.05,
        envMap: em,
        envMapIntensity: 0.1
      }),

      // Brushed stainless steel cladding
      steel: new THREE.MeshStandardMaterial({
        color: 0xc8cdd4,
        metalness: 0.92,
        roughness: 0.18,
        envMap: em,
        envMapIntensity: 1.0
      }),

      // Anodized aluminum mullions
      aluminum: new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.85,
        roughness: 0.25,
        envMap: em,
        envMapIntensity: 0.8
      }),

      // Dark steel / structural
      darkSteel: new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.75,
        roughness: 0.35,
        envMap: em,
        envMapIntensity: 0.5
      }),

      // Warm interior glow
      warmGlow: new THREE.MeshBasicMaterial({
        color: 0xfef3c7,
        transparent: true,
        opacity: 0.6
      }),

      // Road asphalt PBR
      asphalt: new THREE.MeshStandardMaterial({
        color: 0x1c222b,
        roughness: 0.82,
        metalness: 0.12,
        envMap: em,
        envMapIntensity: 0.2
      }),

      // Water (reflective)
      water: new THREE.MeshPhysicalMaterial({
        color: 0x0369a1,
        metalness: 0.92,
        roughness: 0.08,
        transparent: true,
        opacity: 0.92,
        envMap: em,
        envMapIntensity: 1.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02
      }),

      // Ceramic / porcelain (building tiles)
      ceramic: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.35,
        metalness: 0.1,
        envMap: em,
        envMapIntensity: 0.4
      }),

      // Natural stone (granite/marble)
      stone: new THREE.MeshStandardMaterial({
        color: 0x64748b,
        roughness: 0.65,
        metalness: 0.15,
        envMap: em,
        envMapIntensity: 0.3
      }),

      // Weathered brick
      brick: new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.9,
        metalness: 0.03
      }),

      // Car paint (high-end automotive)
      carPaint: new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b,
        metalness: 0.92,
        roughness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        envMap: em,
        envMapIntensity: 2.0,
        reflectivity: 1.0
      })
    };
  },

  // ========================================================
  // CREATE A PHOTOREALISTIC SKYSCRAPER WITH ARCHITECTURAL DETAIL
  // ========================================================
  createDetailedSkyscraper(width = 90, height = 260, depth = 90, tint = 'azure', envMap = null) {
    const tower = new THREE.Group();
    const em = envMap || null;

    // Get high-res facade texture
    const facadeTex = window.GTAUltraTextures ?
      window.GTAUltraTextures.createUltraRealisticFacade(tint) :
      (window.GTATextures ? window.GTATextures.createSkyscraperFacade(tint) : null);

    if (facadeTex) {
      facadeTex.repeat.set(2, Math.floor(height / 40));
    }

    const facadeMat = new THREE.MeshStandardMaterial({
      map: facadeTex,
      metalness: 0.82,
      roughness: 0.2,
      envMap: em,
      envMapIntensity: 0.8
    });

    // ---- ARCHITECTURAL SETBACKS (Real skyscrapers taper at top) ----
    // Lower podium (wider base)
    const podiumH = Math.min(30, height * 0.1);
    const podium = new THREE.Mesh(
      new THREE.BoxGeometry(width + 8, podiumH, depth + 8),
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.6,
        roughness: 0.3,
        envMap: em,
        envMapIntensity: 0.5
      })
    );
    podium.position.y = podiumH / 2;
    tower.add(podium);

    // Main tower shaft
    const mainH = height * 0.75;
    const mainBody = new THREE.Mesh(
      new THREE.BoxGeometry(width, mainH, depth),
      facadeMat
    );
    mainBody.position.y = podiumH + mainH / 2;
    tower.add(mainBody);

    // Upper setback tier
    const upperW = width * 0.82;
    const upperD = depth * 0.82;
    const upperH = height * 0.18;
    const upperBody = new THREE.Mesh(
      new THREE.BoxGeometry(upperW, upperH, upperD),
      facadeMat
    );
    upperBody.position.y = podiumH + mainH + upperH / 2;
    tower.add(upperBody);

    // Crown / top cap
    const crownH = height * 0.04;
    const crownBody = new THREE.Mesh(
      new THREE.BoxGeometry(upperW * 0.7, crownH, upperD * 0.7),
      new THREE.MeshStandardMaterial({
        color: tint === 'gold' ? 0xb45309 : (tint === 'emerald' ? 0x065f46 : 0x0c4a6e),
        metalness: 0.7,
        roughness: 0.3,
        envMap: em,
        envMapIntensity: 0.6
      })
    );
    crownBody.position.y = podiumH + mainH + upperH + crownH / 2;
    crownBody.castShadow = true;
    tower.add(crownBody);

    // ---- GROUND FLOOR ENTRANCE LOBBY ----
    // Glass entrance canopy
    const canopyGlass = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      metalness: 0.3,
      roughness: 0.1,
      transparent: true,
      opacity: 0.5,
      envMap: em,
      envMapIntensity: 1.2
    });
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.5, 1.5, 18),
      canopyGlass
    );
    canopy.position.set(0, podiumH + 2, depth / 2 + 8);
    canopy.castShadow = true;
    tower.add(canopy);

    // Entrance columns (polished stone)
    const columnMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.5,
      roughness: 0.25,
      envMap: em,
      envMapIntensity: 0.6
    });
    [-width * 0.2, width * 0.2].forEach(cx => {
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.8, podiumH + 3, 12),
        columnMat
      );
      col.position.set(cx, (podiumH + 3) / 2, depth / 2 + 3);
      col.castShadow = true;
      tower.add(col);
    });

    // Revolving door entrance (dark glass)
    const doorMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a1628,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85,
      envMap: em,
      envMapIntensity: 1.0
    });
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.25, podiumH * 0.7, 2),
      doorMat
    );
    door.position.set(0, podiumH * 0.35 + 1, depth / 2 + 4.5);
    tower.add(door);

    // Interior warm glow visible through entrance
    const interiorGlow = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.3, podiumH * 0.5, 0.5),
      new THREE.MeshBasicMaterial({ color: 0xfef3c7, transparent: true, opacity: 0.25 })
    );
    interiorGlow.position.set(0, podiumH * 0.3, depth / 2 + 1);
    tower.add(interiorGlow);

    // ---- VERTICAL ARCHITECTURAL ACCENT PILLARS (Sleek corner & center mullions) ----
    const ribMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.2,
      envMap: em,
      envMapIntensity: 0.6
    });
    const ribH = mainH + upperH;
    const ribGeo = new THREE.BoxGeometry(2.2, ribH, 2.2);
    [
      [-width / 2 + 1, depth / 2 + 1],
      [width / 2 - 1, depth / 2 + 1],
      [-width / 2 + 1, -depth / 2 - 1],
      [width / 2 - 1, -depth / 2 - 1],
      [0, depth / 2 + 1],
      [0, -depth / 2 - 1]
    ].forEach(([rx, rz]) => {
      const rib = new THREE.Mesh(ribGeo, ribMat);
      rib.position.set(rx, podiumH + ribH / 2, rz);
      tower.add(rib);
    });

    // ---- FLOOR SLAB EDGE BANDS (Horizontal spandrel lines) ----
    const spandrelMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.6,
      roughness: 0.4,
      envMap: em,
      envMapIntensity: 0.3
    });
    const floorH = 12; // Height of each floor
    const numFloors = Math.floor((mainH + upperH) / floorH);
    for (let f = 0; f < numFloors; f++) {
      const fy = podiumH + f * floorH;
      // Only every 5th floor has a visible band (mechanical floor markers)
      if (f % 5 === 0 && f > 0) {
        const band = new THREE.Mesh(
          new THREE.BoxGeometry(width + 1.5, 1.8, depth + 1.5),
          spandrelMat
        );
        band.position.y = fy;
        tower.add(band);
      }
    }

    // ---- MECHANICAL PENTHOUSE ROOFTOP ----
    const mechW = width * 0.45;
    const mechD = depth * 0.45;
    const mechH = 18;
    const mechMat = new THREE.MeshStandardMaterial({
      color: 0x374151,
      metalness: 0.5,
      roughness: 0.5,
      envMap: em,
      envMapIntensity: 0.3
    });
    const mech = new THREE.Mesh(
      new THREE.BoxGeometry(mechW, mechH, mechD),
      mechMat
    );
    mech.position.y = height + mechH / 2;
    mech.castShadow = true;
    tower.add(mech);

    // Rooftop HVAC units
    for (let h = 0; h < 4; h++) {
      const hvac = new THREE.Mesh(
        new THREE.BoxGeometry(4, 3, 6),
        new THREE.MeshStandardMaterial({
          color: 0x94a3b8,
          metalness: 0.6,
          roughness: 0.4,
          envMap: em,
          envMapIntensity: 0.4
        })
      );
      hvac.position.set(
        (Math.random() - 0.5) * mechW * 1.5,
        height + 2,
        (Math.random() - 0.5) * mechD * 1.5
      );
      tower.add(hvac);
    }

    // Communications antenna
    const antennaMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.15,
      envMap: em,
      envMapIntensity: 0.8
    });
    const antenna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 1.0, 40, 8),
      antennaMat
    );
    antenna.position.y = height + mechH + 20;
    tower.add(antenna);

    // Aviation warning beacon
    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(1.0, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    beacon.position.y = height + mechH + 40;
    tower.add(beacon);

    // ---- WINDOW-MOUNTED AC UNITS (Residential detail) ----
    if (height < 120) { // Only on shorter buildings
      for (let f = 0; f < 6; f++) {
        const acY = podiumH + 15 + f * floorH * 2;
        const acX = -width / 2 + Math.random() * width;
        const ac = new THREE.Mesh(
          new THREE.BoxGeometry(3, 2, 4),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7, metalness: 0.3 })
        );
        ac.position.set(acX, acY, depth / 2 + 2);
        tower.add(ac);
      }
    }

    return tower;
  },

  // ========================================================
  // DETAILED RESIDENTIAL BUILDING (Apartments / Mixed-Use)
  // ========================================================
  createDetailedResidentialBlock(width = 60, height = 45, depth = 40, envMap = null) {
    const building = new THREE.Group();
    const em = envMap || null;

    // Brick texture
    const brickTex = window.GTATextures ? window.GTATextures.createCollegiateBrick() : null;
    if (brickTex) brickTex.repeat.set(3, Math.floor(height / 15));

    const brickMat = new THREE.MeshStandardMaterial({
      map: brickTex,
      color: 0xa0522d,
      roughness: 0.85,
      metalness: 0.05,
      envMap: em,
      envMapIntensity: 0.1
    });

    // Main building body
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      brickMat
    );
    body.position.y = height / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    building.add(body);

    // Ground floor commercial (different material)
    const shopFront = new THREE.Mesh(
      new THREE.BoxGeometry(width + 0.5, 8, depth + 0.5),
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.6,
        roughness: 0.3,
        envMap: em,
        envMapIntensity: 0.4
      })
    );
    shopFront.position.y = 4;
    building.add(shopFront);

    // Shop windows with warm glow
    const shopWindowMat = new THREE.MeshBasicMaterial({
      color: 0xfef3c7,
      transparent: true,
      opacity: 0.5
    });
    for (let sw = 0; sw < 3; sw++) {
      const shopWin = new THREE.Mesh(
        new THREE.PlaneGeometry(width * 0.25, 5),
        shopWindowMat
      );
      shopWin.position.set(
        -width * 0.3 + sw * width * 0.3,
        4,
        depth / 2 + 0.3
      );
      building.add(shopWin);
    }

    // Individual window frames on upper floors
    const floorH = 10;
    const numFloors = Math.floor((height - 8) / floorH);
    const windowsPerFloor = Math.floor(width / 10);

    const windowFrameMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.7,
      roughness: 0.3,
      envMap: em,
      envMapIntensity: 0.5
    });

    for (let f = 0; f < numFloors; f++) {
      for (let w = 0; w < windowsPerFloor; w++) {
        const wX = -width / 2 + 5 + w * (width / windowsPerFloor);
        const wY = 12 + f * floorH;

        // Window recess (dark)
        const recess = new THREE.Mesh(
          new THREE.BoxGeometry(5, 5.5, 1.5),
          new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.3 })
        );
        recess.position.set(wX, wY, depth / 2);
        building.add(recess);

        // Window glass
        const isLit = Math.random() < 0.4;
        const winGlass = new THREE.Mesh(
          new THREE.PlaneGeometry(4.2, 4.8),
          new THREE.MeshBasicMaterial({
            color: isLit ? 0xfef3c7 : 0x1e3a5f,
            transparent: true,
            opacity: isLit ? 0.6 : 0.8
          })
        );
        winGlass.position.set(wX, wY, depth / 2 + 0.3);
        building.add(winGlass);

        // Window sill
        const sill = new THREE.Mesh(
          new THREE.BoxGeometry(5.5, 0.5, 2),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6 })
        );
        sill.position.set(wX, wY - 3, depth / 2 + 0.5);
        building.add(sill);

        // Random AC unit
        if (Math.random() < 0.2) {
          const ac = new THREE.Mesh(
            new THREE.BoxGeometry(3, 2, 3),
            new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7, metalness: 0.3 })
          );
          ac.position.set(wX, wY - 1, depth / 2 + 2);
          building.add(ac);
        }
      }
    }

    // Cornice / parapet at top
    const cornice = new THREE.Mesh(
      new THREE.BoxGeometry(width + 2, 2, depth + 2),
      new THREE.MeshStandardMaterial({
        color: 0x78716c,
        roughness: 0.6,
        metalness: 0.2,
        envMap: em,
        envMapIntensity: 0.3
      })
    );
    cornice.position.y = height + 1;
    building.add(cornice);

    // Rooftop water tanks
    const tankMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.7,
      metalness: 0.4
    });
    const tank = new THREE.Mesh(
      new THREE.CylinderGeometry(4, 4, 8, 12),
      tankMat
    );
    tank.position.set(width * 0.2, height + 6, 0);
    building.add(tank);

    // Fire escape on side
    const fireMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.7,
      roughness: 0.4
    });
    for (let f = 0; f < numFloors; f++) {
      const feY = 10 + f * floorH;
      const platform = new THREE.Mesh(
        new THREE.BoxGeometry(8, 0.4, 5),
        fireMat
      );
      platform.position.set(width / 2 + 4, feY, 0);
      building.add(platform);

      // Railing
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(8, 3, 0.3),
        fireMat
      );
      rail.position.set(width / 2 + 4, feY + 1.5, 2.5);
      building.add(rail);

      // Ladder
      if (f < numFloors - 1) {
        const ladder = new THREE.Mesh(
          new THREE.BoxGeometry(1.5, floorH, 0.3),
          fireMat
        );
        ladder.position.set(width / 2 + 7, feY + floorH / 2, 0);
        building.add(ladder);
      }
    }

    return building;
  },

  // ========================================================
  // UPGRADE EXISTING SKYSCRAPER MODEL WITH PHOTOREALISTIC DETAILS
  // ========================================================
  upgradeExistingSkyscraper() {
    if (!window.GTAModels) return;

    // Store original
    const origCreateSkyscraper = window.GTAModels.createSkyscraper.bind(window.GTAModels);

    // Replace with enhanced version
    window.GTAModels.createSkyscraper = (width = 90, height = 260, depth = 90, tint = 'azure') => {
      const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;
      return GTARealismUpgrade.createDetailedSkyscraper(width, height, depth, tint, envMap);
    };
  },

  // ========================================================
  // ========================================================
  // ADD SCATTERED REALISTIC CITY FILLER BUILDINGS
  // ========================================================
  addCityFillerBuildings(scene, gameInstance = null) {
    if (!scene) return;
    const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;

    // Define positions for filler buildings: Spacious outer perimeter, completely clear of roads and landmarks
    const fillerPositions = [
      // Coastal Bluff Ridge (well clear of Coastal Highway at x = -490 and Villa at x = -280, z = -240)
      { x: -410, z: -100, w: 48, h: 36, d: 38, type: 'residential' },
      { x: -410, z: 90, w: 44, h: 42, d: 36, type: 'residential' },
      { x: -410, z: 340, w: 50, h: 38, d: 38, type: 'residential' },

      // East Metropolis Perimeter (far behind VIP Tower at x = 200, z = -220 and Tech Park)
      { x: 420, z: -400, w: 52, h: 65, d: 46, type: 'commercial' },
      { x: 440, z: -260, w: 48, h: 50, d: 44, type: 'residential' },
      { x: 430, z: 360, w: 52, h: 48, d: 44, type: 'residential' },

      // South-West Perimeter
      { x: -360, z: 420, w: 52, h: 40, d: 42, type: 'residential' },
    ];

    fillerPositions.forEach(fp => {
      let building;
      if (fp.type === 'residential') {
        building = this.createDetailedResidentialBlock(fp.w, fp.h, fp.d, envMap);
      } else {
        building = this.createDetailedSkyscraper(fp.w, fp.h, fp.d, 'azure', envMap);
      }
      building.position.set(fp.x, 0, fp.z);
      building.rotation.y = Math.random() * Math.PI * 0.1 - 0.05; // Slight rotation for realism
      scene.add(building);

      // Register building AABB with collision engine so player/car cannot pass through
      if (gameInstance && gameInstance.registerBuildingCollider) {
        gameInstance.registerBuildingCollider({
          minX: fp.x - fp.w / 2 - 2,
          maxX: fp.x + fp.w / 2 + 2,
          minZ: fp.z - fp.d / 2 - 2,
          maxZ: fp.z + fp.d / 2 + 2,
          name: `Perimeter ${fp.type} building`
        });
      }
    });
  },

  // ========================================================
  // ADD REALISTIC STREET DETAILS (Uncluttered, Grand Open Boulevards)
  // ========================================================
  addStreetDetails(scene) {
    if (!scene) return;

    // Road lane reflective cat-eye studs along highway center line (Instanced: 1 single draw call)
    const studMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const studGeo = new THREE.BoxGeometry(0.5, 0.18, 0.5);
    const studCount = 60;
    const instancedStuds = new THREE.InstancedMesh(studGeo, studMat, studCount);
    const dummy = new THREE.Object3D();
    let studIdx = 0;
    for (let z = -600; z < 600 && studIdx < studCount; z += 20) {
      dummy.position.set(0, 0.55, z);
      dummy.updateMatrix();
      instancedStuds.setMatrixAt(studIdx++, dummy.matrix);
    }
    instancedStuds.instanceMatrix.needsUpdate = true;
    scene.add(instancedStuds);

    // Pedestrian Zebra Crosswalks & Traffic Signals at Highway Intersections (Set back from curbs!)
    if (window.GTARealisticEntities) {
      // Intersection 1: Avenue 1 (z = 0)
      const cw1 = window.GTARealisticEntities.createIntersectionCrosswalk(120, 0);
      scene.add(cw1);
      const ts1 = window.GTARealisticEntities.createTrafficSignalPole(74, 0);
      scene.add(ts1);
      const ts1b = window.GTARealisticEntities.createTrafficSignalPole(-74, 0);
      ts1b.rotation.y = Math.PI;
      scene.add(ts1b);

      // Intersection 2: Avenue 2 (z = -240) - Villa to VIP Tower
      const cw2 = window.GTARealisticEntities.createIntersectionCrosswalk(120, -240);
      scene.add(cw2);
      const ts2 = window.GTARealisticEntities.createTrafficSignalPole(74, -240);
      scene.add(ts2);

      // Intersection 3: Avenue 3 (z = 240) - Collab-Hub to Trendrove
      const cw3 = window.GTARealisticEntities.createIntersectionCrosswalk(120, 240);
      scene.add(cw3);
      const ts3 = window.GTARealisticEntities.createTrafficSignalPole(-74, 240);
      ts3.rotation.y = Math.PI;
      scene.add(ts3);

      // Intersection 4: Academic Parkway (z = -330) - KTU Campus Gate
      const cw4 = window.GTARealisticEntities.createIntersectionCrosswalk(120, -330);
      scene.add(cw4);
      const ts4 = window.GTARealisticEntities.createTrafficSignalPole(74, -330);
      scene.add(ts4);
    }

    // Bus Stop Shelters along Sidewalks (Set back on wide sidewalk at x = 80)
    if (window.GTAModels && window.GTAModels.createBusStopShelter) {
      [-160, 160].forEach(z => {
        const busStop = window.GTAModels.createBusStopShelter();
        busStop.position.set(80, 0.85, z);
        busStop.rotation.y = -Math.PI / 2;
        scene.add(busStop);
      });
    }

    // Realistic Sidewalk Benches (Set back nicely along pedestrian walkway)
    if (window.GTAModelLoader && window.GTAModelLoader.createRealBench) {
      [-80, 80].forEach(z => {
        const bench1 = window.GTAModelLoader.createRealBench(3.2);
        if (bench1) {
          bench1.position.set(78, 0.85, z);
          bench1.rotation.y = -Math.PI / 2;
          scene.add(bench1);
        }
        const bench2 = window.GTAModelLoader.createRealBench(3.2);
        if (bench2) {
          bench2.position.set(-78, 0.85, z);
          bench2.rotation.y = Math.PI / 2;
          scene.add(bench2);
        }
      });
    }
  },

  // ========================================================
  // UPGRADE PEDESTRIANS: Replaces cartoon meshes with realistic humans
  // ========================================================
  upgradePedestrians() {
    if (!window.OpenWorldGame || !window.GTARealisticEntities) return;

    window.OpenWorldGame.prototype.createPedestrianMesh = function(pantsColor, shirtColor, isStudent = false) {
      return window.GTARealisticEntities.createRealisticHuman({
        type: isStudent ? 'student' : (Math.random() < 0.25 ? 'business' : 'casual'),
        pantsColor: pantsColor,
        clothingColor: shirtColor
      });
    };
  },

  // ========================================================
  // UPGRADE TRAFFIC: Replaces cartoon box cars with real vehicles
  // ========================================================
  upgradeTraffic() {
    if (!window.OpenWorldGame || !window.GTARealisticEntities) return;

    window.OpenWorldGame.prototype.buildHighwayTraffic = function() {
      const vehicleTypes = ['sedan', 'suv', 'taxi', 'sedan', 'van', 'sedan', 'suv', 'taxi', 'sedan', 'suv'];
      const carColors = [0x1e3a8a, 0xdc2626, 0xf8fafc, 0x18181b, 0xeab308, 0x059669, 0x475569, 0x7c3aed, 0xb91c1c, 0x0284c7];
      const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;

      for (let i = 0; i < 12; i++) {
        const type = vehicleTypes[i % vehicleTypes.length];
        const col = carColors[i % carColors.length];
        const tCar = window.GTARealisticEntities.createRealisticVehicle(type, col, envMap);

        const isNorthbound = i % 2 === 0;
        const laneX = isNorthbound ? -28 : 28;
        tCar.position.set(laneX, 0, -1400 + i * 240);
        const baseSpd = isNorthbound ? 3.8 : -3.8;

        tCar.userData = {
          baseSpeed: baseSpd,
          currentSpeed: baseSpd,
          isNorthbound: isNorthbound,
          taillightMesh: tCar.userData.taillightMesh,
          isCrashed: false,
          crashTumble: null,
          initialLaneX: laneX
        };

        if (!isNorthbound) tCar.rotation.y = Math.PI;

        this.scene.add(tCar);
        this.trafficCars.push(tCar);
      }
    };
  },

  // ========================================================
  // PRE-INIT: Intercept creation before gameEngine builds world
  // ========================================================
  preInit(gameInstance) {
    // 1. Initialize real 3D GLB model loader
    if (window.GTAModelLoader) {
      window.GTAModelLoader.init();
    }

    // 2. Texture overrides
    if (window.GTAUltraTextures) {
      window.GTAUltraTextures.installOverrides();
    }

    // 3. Model overrides: Replace primitive factories with genuine 3D models
    if (window.GTAModels) {
      // Supercar -> Real Ferrari 3D model (51 meshes)
      window.GTAModels.createSupercar = (bodyColor = 0xf59e0b) => {
        const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;
        if (window.GTAModelLoader) {
          return window.GTAModelLoader.createRealSupercar(bodyColor, envMap);
        }
        return window.GTARealisticEntities ? window.GTARealisticEntities.createRealisticVehicle('sport', bodyColor) : new THREE.Group();
      };

      // Palm Trees -> Real California Palm 3D model
      window.GTAModels.createPhotorealisticPalmTree = (height = 28) => {
        if (window.GTAModelLoader) {
          return window.GTAModelLoader.createRealPalmTree(5.8);
        }
        return new THREE.Group();
      };

      // Trees -> Real 3D Oak & Pine models
      window.GTAModels.createPhotorealisticOakTree = (height = 26, leafColor = 0x166534) => {
        if (window.GTAModelLoader) {
          return window.GTAModelLoader.createRealTree(0, 4.5);
        }
        return new THREE.Group();
      };

      // Streetlights -> Real 3D Streetlamp model
      window.GTAModels.createHighwayStreetlight = () => {
        if (window.GTAModelLoader) {
          return window.GTAModelLoader.createRealStreetlight(4.2);
        }
        return new THREE.Group();
      };

      // Player Character -> Real 3D Rigged Hamna Developer Model
      window.GTAModels.createPlayerCharacter = () => {
        const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;
        if (window.GTAModelLoader && window.GTAModelLoader.createRealHamnaCharacter) {
          return window.GTAModelLoader.createRealHamnaCharacter(envMap);
        }
        if (window.GTAModelLoader && window.GTAModelLoader.originalGTAModels && window.GTAModelLoader.originalGTAModels.createPlayerCharacter) {
          return window.GTAModelLoader.originalGTAModels.createPlayerCharacter();
        }
        return new THREE.Group();
      };

      // Police Cruiser -> Real LAPD 3D Police Interceptor model
      window.GTAModels.createPoliceCruiser = () => {
        const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;
        if (window.GTAModelLoader && window.GTAModelLoader.createRealPoliceCruiser) {
          return window.GTAModelLoader.createRealPoliceCruiser(envMap);
        }
        return window.GTARealisticEntities ? window.GTARealisticEntities.createRealisticVehicle('police', 0x09090b, envMap) : new THREE.Group();
      };

      // Skyscraper -> Real 3D Architectural Building model (Streamlined 4-tier geometry eliminates 7,000+ draw calls)
      window.GTAModels.createSkyscraper = (width = 90, height = 260, depth = 90, tint = 'azure') => {
        const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;
        return GTARealismUpgrade.createDetailedSkyscraper(width, height, depth, tint, envMap);
      };
    }

    // 4. Realistic Pedestrians -> Real 3D rigged character models
    if (window.OpenWorldGame) {
      window.OpenWorldGame.prototype.createPedestrianMesh = function(pantsColor, shirtColor, isStudent = false) {
        if (window.GTAModelLoader && (window.GTAModelLoader.templates.character || window.GTAModelLoader.templates.soldier)) {
          return window.GTAModelLoader.createRealCharacter(false, isStudent);
        }
        if (window.GTARealisticEntities) {
          return window.GTARealisticEntities.createRealisticHuman({
            type: isStudent ? 'student' : 'casual',
            pantsColor, clothingColor: shirtColor
          });
        }
        return new THREE.Group();
      };

      // 5. Realistic Traffic Fleet -> Real 3D vehicle models
      window.OpenWorldGame.prototype.buildHighwayTraffic = function() {
        const carColors = [0x1e3a8a, 0xdc2626, 0xf8fafc, 0x18181b, 0xeab308, 0x059669, 0x475569, 0x7c3aed, 0xb91c1c, 0x0284c7];
        const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;

        for (let i = 0; i < 12; i++) {
          const col = carColors[i % carColors.length];
          let tCar;
          if (window.GTAModelLoader && window.GTAModelLoader.templates.cityProps.cars.length > 0) {
            tCar = window.GTAModelLoader.createRealTrafficVehicle(i, col, envMap);
          } else if (window.GTARealisticEntities) {
            tCar = window.GTARealisticEntities.createRealisticVehicle('sedan', col, envMap);
          } else {
            tCar = new THREE.Group();
          }

          const isNorthbound = i % 2 === 0;
          const laneX = isNorthbound ? -28 : 28;
          tCar.position.set(laneX, 0, -1400 + i * 240);
          const baseSpd = isNorthbound ? 3.8 : -3.8;

          tCar.userData = {
            baseSpeed: baseSpd,
            currentSpeed: baseSpd,
            isNorthbound: isNorthbound,
            taillightMesh: tCar.userData ? tCar.userData.taillightMesh : null,
            isCrashed: false,
            crashTumble: null,
            initialLaneX: laneX
          };

          if (!isNorthbound) tCar.rotation.y = Math.PI;

          this.scene.add(tCar);
          this.trafficCars.push(tCar);
        }
      };
    }

    console.log('[GTA REALISM] ✅ Pre-initialization overrides with real 3D assets installed');
  },

  // ========================================================
  // MASTER INSTALL: Apply all realism upgrades
  // ========================================================
  install(scene, renderer, gameInstance = null) {
    // 1. Initialize materials
    let envMap = null;
    if (window.GTARealisticEnvironment) {
      envMap = window.GTARealisticEnvironment.createEnvironmentMap(renderer);
      this.initMaterials(envMap);
    } else {
      this.initMaterials(null);
    }

    // 2. Override textures
    if (window.GTAUltraTextures) {
      window.GTAUltraTextures.installOverrides();
    }

    // 3. Upgrade skyscraper model
    this.upgradeExistingSkyscraper();

    // 4. Apply environment map & lighting to scene
    if (window.GTARealisticEnvironment && envMap) {
      window.GTARealisticEnvironment.applyEnvironmentToScene(scene, envMap);
      window.GTARealisticEnvironment.setupRealisticRendering(renderer);
      window.GTARealisticEnvironment.upgradeSceneLighting(scene);
      window.GTARealisticEnvironment.createAtmosphericFog(scene);
      window.GTARealisticEnvironment.createContactShadows(scene);
    }

    // 5. Add city filler buildings with collision bounding boxes
    this.addCityFillerBuildings(scene, gameInstance);

    // 6. Add street-level detail & intersections
    this.addStreetDetails(scene);

    // 7. On-Ready Real Asset Dynamic Replacement
    if (window.GTAModelLoader) {
      window.GTAModelLoader.onReady(() => {
        if (gameInstance) {
          // 0. Replace player with Real 3D Rigged Hamna Character
          if (gameInstance.player && !gameInstance.player.userData.isRealGLB) {
            console.log('[GTA REALISM] 👩 Dynamically swapping player to Real 3D Hamna character...');
            const oldPos = gameInstance.player.position.clone();
            const oldRot = gameInstance.player.rotation.clone();
            gameInstance.scene.remove(gameInstance.player);
            gameInstance.player = window.GTAModelLoader.createRealHamnaCharacter(envMap);
            gameInstance.player.position.copy(oldPos);
            gameInstance.player.rotation.copy(oldRot);
            gameInstance.scene.add(gameInstance.player);
          }

          // 1-4. Upgrade vehicles via centralized game engine method (prevents double swapping)
          if (gameInstance.upgradeAllCityVehicles && !gameInstance._vehiclesUpgraded) {
            gameInstance.upgradeAllCityVehicles();
          }
        }
      });
    }

    console.log('[GTA REALISM] ✅ Photorealistic city upgrade with real 3D models installed');
  }
};

window.GTARealismUpgrade = GTARealismUpgrade;
