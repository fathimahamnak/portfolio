// ========================================================
// GTA REALISTIC 3D MODEL LOADER & INSTANCING PIPELINE
// Loads and manages genuine GLTF/GLB models for:
// - Photorealistic Sports Supercar (Ferrari with 51 meshes)
// - Real Traffic Vehicles (Sedans, Coupes, SUVs)
// - Real California Palm Trees & Foliage Trees
// - Real Architectural 3D Buildings & Retail Shops
// - Real Street Furniture (Streetlights, Traffic Lights, Benches, Trash)
// - Real Animated 3D Characters (Soldier / Highway Patrol & Pedestrians)
// ========================================================

const GTAModelLoader = {
  isInitialized: false,
  isReady: false,
  loader: null,
  dracoLoader: null,

  // Cached parsed GLTF scenes / templates
  templates: {
    supercar: null,
    palm: null,
    building: null,
    soldier: null,
    character: null,
    cityProps: {
      cars: [],
      sedans: [],
      coupes: [],
      suvs: [],
      trees: [],
      lights: [],
      trafficLights: [],
      benches: [],
      trashCans: [],
      houses: []
    }
  },

  // Active animation mixers for animated characters
  activeMixers: [],

  // Callbacks waiting for models to be ready
  readyCallbacks: [],

  // Original model methods captured before any overrides to prevent infinite recursion
  originalGTAModels: null,

  captureOriginalModels() {
    if (this.originalGTAModels) return;
    if (window.GTAModels) {
      this.originalGTAModels = {
        createSupercar: window.GTAModels.createSupercar ? window.GTAModels.createSupercar.bind(window.GTAModels) : null,
        createPoliceCruiser: window.GTAModels.createPoliceCruiser ? window.GTAModels.createPoliceCruiser.bind(window.GTAModels) : null,
        createPlayerCharacter: window.GTAModels.createPlayerCharacter ? window.GTAModels.createPlayerCharacter.bind(window.GTAModels) : null,
        createPhotorealisticPalmTree: window.GTAModels.createPhotorealisticPalmTree ? window.GTAModels.createPhotorealisticPalmTree.bind(window.GTAModels) : null,
        createPhotorealisticOakTree: window.GTAModels.createPhotorealisticOakTree ? window.GTAModels.createPhotorealisticOakTree.bind(window.GTAModels) : null,
        createHighwayStreetlight: window.GTAModels.createHighwayStreetlight ? window.GTAModels.createHighwayStreetlight.bind(window.GTAModels) : null,
        createSkyscraper: window.GTAModels.createSkyscraper ? window.GTAModels.createSkyscraper.bind(window.GTAModels) : null
      };
    }
  },

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    this.captureOriginalModels();

    // 1. Setup Three.js DRACOLoader and GLTFLoader
    if (window.THREE && window.THREE.DRACOLoader && window.THREE.GLTFLoader) {
      this.dracoLoader = new THREE.DRACOLoader();
      this.dracoLoader.setDecoderPath('js/libs/draco/gltf/');
      this.dracoLoader.setDecoderConfig({ type: 'js' });

      this.loader = new THREE.GLTFLoader();
      this.loader.setDRACOLoader(this.dracoLoader);
    } else {
      console.warn('[GTAModelLoader] GLTFLoader or DRACOLoader not found on window.THREE');
      return;
    }

    // 2. Load all real 3D models in parallel
    this.loadAllModels();
  },

  onReady(callback) {
    if (this.isReady) {
      callback();
    } else {
      this.readyCallbacks.push(callback);
    }
  },

  notifyReady() {
    if (this.isReady) return;
    this.isReady = true;
    console.log('[GTAModelLoader] 🚀 All real 3D assets loaded and ready for rendering!');
    if (window.updateLoadingProgress) {
      window.updateLoadingProgress(100, 'METROPOLIS READY! WELCOME TO LOS SANTOS');
    }
    this.readyCallbacks.forEach(cb => {
      try { cb(); } catch (e) { console.error(e); }
    });
    if (window.game && typeof window.game.upgradeAllCityVehicles === 'function') {
      try { window.game.upgradeAllCityVehicles(); } catch (e) { console.error(e); }
    }
    if (typeof window.dismissLoadingScreen === 'function') {
      setTimeout(() => {
        try { window.dismissLoadingScreen(); } catch (e) { console.error(e); }
      }, 350);
    }
  },

  loadAllModels() {
    const promises = [];
    let loadedCount = 0;
    const totalCount = 6;

    const report = (name) => {
      loadedCount++;
      const pct = loadedCount >= totalCount ? 100 : Math.round(30 + (loadedCount / totalCount) * 65);
      if (window.updateLoadingProgress) {
        window.updateLoadingProgress(pct, loadedCount >= totalCount 
          ? 'METROPOLIS READY! WELCOME TO LOS SANTOS' 
          : `LOADING REAL ASSETS: ${name.toUpperCase()} (${loadedCount}/${totalCount})...`);
      }
      if (loadedCount >= totalCount) {
        setTimeout(() => this.notifyReady(), 100);
      }
    };

    // 1. Photorealistic Supercar (Ferrari GLB)
    promises.push(new Promise(resolve => {
      this.loader.load('assets/models/ferrari.glb', gltf => {
        this.templates.supercar = gltf.scene;
        console.log('[GTAModelLoader] ✅ Ferrari supercar model loaded');
        report('Ferrari Supercar');
        resolve();
      }, undefined, err => {
        console.warn('[GTAModelLoader] Ferrari load error:', err);
        report('Ferrari Supercar (Fallback)');
        resolve();
      });
    }));

    // 2. Real California Palm Tree (Palm GLB)
    promises.push(new Promise(resolve => {
      this.loader.load('assets/models/palm.glb', gltf => {
        this.templates.palm = gltf.scene;
        console.log('[GTAModelLoader] ✅ Palm tree model loaded');
        report('California Palm Trees');
        resolve();
      }, undefined, err => {
        console.warn('[GTAModelLoader] Palm load error:', err);
        report('California Palm Trees (Fallback)');
        resolve();
      });
    }));

    // 3. Real 3D Building Complex (Building GLB - 381 meshes)
    promises.push(new Promise(resolve => {
      this.loader.load('assets/models/building.glb', gltf => {
        this.templates.building = gltf.scene;
        console.log('[GTAModelLoader] ✅ Architectural building model loaded');
        report('Architectural 3D Buildings');
        resolve();
      }, undefined, err => {
        console.warn('[GTAModelLoader] Building load error:', err);
        report('Architectural 3D Buildings (Fallback)');
        resolve();
      });
    }));

    // 4. City Props & Traffic Vehicles (City GLB - 102 meshes)
    promises.push(new Promise(resolve => {
      this.loader.load('assets/models/city.glb', gltf => {
        this.extractCityAssets(gltf.scene);
        console.log('[GTAModelLoader] ✅ City assets & vehicles loaded');
        report('City Vehicles & Street Furniture');
        resolve();
      }, undefined, err => {
        console.warn('[GTAModelLoader] City load error:', err);
        report('City Vehicles (Fallback)');
        resolve();
      });
    }));

    // 5. Rigged Animated Character / Police (Soldier GLB)
    promises.push(new Promise(resolve => {
      this.loader.load('assets/models/soldier.glb', gltf => {
        this.templates.soldier = { scene: gltf.scene, animations: gltf.animations };
        console.log('[GTAModelLoader] ✅ Soldier/Police character model loaded');
        report('Patrol Character');
        resolve();
      }, undefined, err => {
        console.warn('[GTAModelLoader] Soldier load error:', err);
        report('Patrol Character (Fallback)');
        resolve();
      });
    }));

    // 6. Rigged Human Pedestrian (Character GLB)
    promises.push(new Promise(resolve => {
      this.loader.load('assets/models/character.glb', gltf => {
        this.templates.character = { scene: gltf.scene, animations: gltf.animations };
        console.log('[GTAModelLoader] ✅ Human civilian character model loaded');
        report('Civilian Pedestrians');
        resolve();
      }, undefined, err => {
        console.warn('[GTAModelLoader] Character load error:', err);
        report('Civilian Pedestrians (Fallback)');
        resolve();
      });
    }));

    Promise.all(promises).then(() => {
      this.notifyReady();
    });

    // Safety fallback: Never freeze on loading screen even if network or GLB stalls
    setTimeout(() => {
      if (!this.isReady) {
        console.warn('[GTAModelLoader] Safety fallback triggered: forcing ready state');
        this.notifyReady();
      }
    }, 2500);
  },

  // Separate the 102-mesh city asset into categorized templates
  extractCityAssets(cityScene) {
    cityScene.traverse(child => {
      if (!child.name) return;
      const name = child.name.toLowerCase();

      if (name.includes('car_03')) {
        this.templates.cityProps.sedans.push(child);
        this.templates.cityProps.cars.push(child);
      } else if (name.includes('car_04')) {
        this.templates.cityProps.coupes.push(child);
        this.templates.cityProps.cars.push(child);
      } else if (name.includes('car_08')) {
        this.templates.cityProps.suvs.push(child);
        this.templates.cityProps.cars.push(child);
      } else if (name.includes('car_')) {
        this.templates.cityProps.cars.push(child);
      } else if (name.includes('tree') || name.includes('firtree') || name.includes('bushes')) {
        this.templates.cityProps.trees.push(child);
      } else if (name.includes('traffic:light')) {
        this.templates.cityProps.trafficLights.push(child);
      } else if (name.includes('light') && !name.includes('traffic')) {
        this.templates.cityProps.lights.push(child);
      } else if (name.includes('bench') || name.includes('behch')) {
        this.templates.cityProps.benches.push(child);
      } else if (name.includes('trash')) {
        this.templates.cityProps.trashCans.push(child);
      } else if (name.includes('house') || name.includes('shop')) {
        this.templates.cityProps.houses.push(child);
      }
    });

    console.log(`[GTAModelLoader] Extracted: ${this.templates.cityProps.cars.length} cars ` +
      `(${this.templates.cityProps.sedans.length} sedans, ${this.templates.cityProps.coupes.length} coupes, ${this.templates.cityProps.suvs.length} suvs), ` +
      `${this.templates.cityProps.trees.length} trees, ` +
      `${this.templates.cityProps.lights.length} streetlights, ` +
      `${this.templates.cityProps.trafficLights.length} traffic lights, ` +
      `${this.templates.cityProps.houses.length} buildings/shops`);
  },

  // ----------------------------------------------------
  // FACTORY 1: REAL 3D SUPERCAR (FERRARI)
  // ----------------------------------------------------
  createRealSupercar(bodyColorHex = 0xf59e0b, envMap = null) {
    const group = new THREE.Group();

    if (this.templates.supercar) {
      const car = this.templates.supercar.clone();

      // Configure materials and shadows
      let taillightMesh = null;
      car.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          // Replace or enhance materials for photorealism
          if (child.material) {
            const matName = child.material.name || '';

            // Body paint with metallic clearcoat lacquer
            if (matName.includes('Body_Color') || matName.includes('Ferrari_Yellow') || matName.includes('_0098_DodgerBlue')) {
              child.material = new THREE.MeshPhysicalMaterial({
                color: bodyColorHex,
                metalness: 0.92,
                roughness: 0.15,
                clearcoat: 1.0,
                clearcoatRoughness: 0.03,
                envMap: envMap,
                envMapIntensity: 2.2,
                reflectivity: 1.0
              });
            } else if (matName.includes('Carbon_Fiber')) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0x18181b,
                metalness: 0.6,
                roughness: 0.35,
                envMap: envMap,
                envMapIntensity: 0.8
              });
            } else if (matName.includes('Glass')) {
              child.material = new THREE.MeshPhysicalMaterial({
                color: 0x0a192f,
                metalness: 0.92,
                roughness: 0.08,
                transparent: true,
                opacity: 0.85,
                envMap: envMap,
                envMapIntensity: 1.8,
                clearcoat: 0.8
              });
            } else if (matName.includes('Taillight')) {
              child.material = new THREE.MeshBasicMaterial({ color: 0xef4444 });
              taillightMesh = child;
            } else if (matName.includes('chrome') || matName.includes('metal')) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0xf8fafc,
                metalness: 0.98,
                roughness: 0.08,
                envMap: envMap,
                envMapIntensity: 1.8
              });
            }
          }
        }
      });

      // Scale and align to fit game physics (original is ~4.5m, scale to ~34 units long)
      const scale = 7.6;
      car.scale.set(scale, scale, scale);
      car.rotation.y = Math.PI; // Face forward (+Z direction in GTA coordinates)
      car.position.y = 0;

      group.add(car);
      group.userData.taillightMesh = taillightMesh;
      group.userData.isRealGLB = true;
      return group;
    }

    // Safe Non-Recursive Fallback: Use original GTAModels supercar
    if (this.originalGTAModels && this.originalGTAModels.createSupercar) {
      return this.originalGTAModels.createSupercar(bodyColorHex);
    }
    if (window.GTARealisticEntities && window.GTARealisticEntities.createRealisticVehicle) {
      return window.GTARealisticEntities.createRealisticVehicle('sport', bodyColorHex, envMap);
    }
    return group;
  },

  // ----------------------------------------------------
  // FACTORY 2: REAL 3D TRAFFIC VEHICLES (SEDANS, SUVS, COUPES)
  // ----------------------------------------------------
  createRealTrafficVehicle(index = 0, colorHex = 0x1e3a8a, envMap = null) {
    const group = new THREE.Group();
    const cars = this.templates.cityProps.cars;
    const sedans = this.templates.cityProps.sedans;
    const coupes = this.templates.cityProps.coupes;
    const suvs = this.templates.cityProps.suvs;

    // Feature authentic Benz, BMW, Audi, Innova, Tesla & Rolls-Royce in city traffic
    if (window.GTARealisticEntities) {
      const realCarGenerators = [
        () => window.GTARealisticEntities.createMercedesBenzGWagon ? window.GTARealisticEntities.createMercedesBenzGWagon(colorHex, envMap) : null,
        () => window.GTARealisticEntities.createBmwM4Competition ? window.GTARealisticEntities.createBmwM4Competition(colorHex, envMap) : null,
        () => window.GTARealisticEntities.createAudiR8Supercar ? window.GTARealisticEntities.createAudiR8Supercar(colorHex, envMap) : null,
        () => window.GTARealisticEntities.createToyotaInnovaCrysta ? window.GTARealisticEntities.createToyotaInnovaCrysta(colorHex, envMap) : null,
        () => window.GTARealisticEntities.createTeslaModelSPlaid ? window.GTARealisticEntities.createTeslaModelSPlaid(colorHex, envMap) : null,
        () => window.GTARealisticEntities.createRollsRoycePhantom ? window.GTARealisticEntities.createRollsRoycePhantom(colorHex, envMap) : null,
        () => window.GTARealisticEntities.createPorscheGT3Coupe ? window.GTARealisticEntities.createPorscheGT3Coupe(colorHex, envMap) : null,
        () => window.GTARealisticEntities.createVintageShelbyMuscle ? window.GTARealisticEntities.createVintageShelbyMuscle(colorHex, envMap) : null
      ];
      const gen = realCarGenerators[index % realCarGenerators.length];
      if (gen) {
        const built = gen();
        if (built) return built;
      }
    }

    if (cars && cars.length > 0) {
      let template;
      let scale = 3.8;
      const typeMod = index % 3;

      if (typeMod === 0 && suvs.length > 0) {
        template = suvs[Math.floor(index / 3) % suvs.length];
        scale = 4.2;
      } else if (typeMod === 1 && coupes.length > 0) {
        template = coupes[Math.floor(index / 3) % coupes.length];
        scale = 3.8;
      } else if (sedans.length > 0) {
        template = sedans[Math.floor(index / 3) % sedans.length];
        scale = 3.9;
      } else {
        template = cars[index % cars.length];
      }

      const carMesh = template.clone();

      carMesh.traverse(c => {
        if (c.isMesh) {
          c.castShadow = false;
          c.receiveShadow = false;
          if (c.material) {
            c.material = new THREE.MeshStandardMaterial({
              color: colorHex,
              metalness: 0.82,
              roughness: 0.22,
              envMap: envMap
            });
          }
        }
      });

      carMesh.scale.set(scale, scale, scale);
      group.add(carMesh);

      const tl = new THREE.Mesh(
        new THREE.BoxGeometry(9.5, 1.2, 0.4),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      tl.position.set(0, 3.6, -14.2);
      group.add(tl);
      group.userData.taillightMesh = tl;
      group.userData.isRealGLB = true;

      return group;
    }

    return group;
  },

  // ----------------------------------------------------
  // FACTORY 2B: REAL 3D POLICE INTERCEPTOR CRUISER
  // ----------------------------------------------------
  createRealPoliceCruiser(envMap = null) {
    const group = new THREE.Group();

    // Priority 1: High-Polygon Real 3D Curved Interceptor using Real GLB Mesh
    if (this.templates.supercar) {
      const car = this.templates.supercar.clone();
      let taillightMesh = null;

      // Two-Tone LAPD Interceptor Metallic Gloss Paint Finish
      car.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.material) {
            const matName = child.material.name || '';

            if (matName.includes('Carpaint') || matName.includes('body')) {
              child.material = new THREE.MeshPhysicalMaterial({
                color: 0x09090b, // Midnight Police Black
                metalness: 0.88,
                roughness: 0.16,
                clearcoat: 1.0,
                clearcoatRoughness: 0.04,
                envMap: envMap,
                envMapIntensity: 1.8
              });
            } else if (matName.includes('Window') || matName.includes('glass')) {
              child.material = new THREE.MeshPhysicalMaterial({
                color: 0x050d1a,
                metalness: 0.95,
                roughness: 0.05,
                transparent: true,
                opacity: 0.85,
                envMap: envMap,
                envMapIntensity: 1.8,
                clearcoat: 0.8
              });
            } else if (matName.includes('Taillight')) {
              child.material = new THREE.MeshBasicMaterial({ color: 0xef4444 });
              taillightMesh = child;
            } else if (matName.includes('chrome') || matName.includes('metal') || matName.includes('rim')) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0xf8fafc,
                metalness: 0.98,
                roughness: 0.08,
                envMap: envMap,
                envMapIntensity: 1.8
              });
            }
          }
        }
      });

      const scale = 7.6;
      car.scale.set(scale, scale, scale);
      car.rotation.y = Math.PI; // Face forward (+Z direction)
      group.add(car);

      // Two-Tone White Doors with High-Res Police Decals ("POLICE 911 // HIGHWAY PATROL")
      const doorCanvas = document.createElement('canvas');
      doorCanvas.width = 512; doorCanvas.height = 256;
      const dctx = doorCanvas.getContext('2d');
      dctx.fillStyle = '#f8fafc'; dctx.fillRect(0, 0, 512, 256);
      dctx.fillStyle = '#0f172a'; dctx.font = '900 68px sans-serif'; dctx.textAlign = 'center';
      dctx.fillText('POLICE', 256, 85);
      dctx.fillStyle = '#ef4444'; dctx.font = '700 42px sans-serif';
      dctx.fillText('★ 911 ★', 256, 142);
      dctx.fillStyle = '#1e293b'; dctx.font = '600 24px monospace';
      dctx.fillText('HIGHWAY PATROL // METRO DIV 9', 256, 192);
      const doorTex = new THREE.CanvasTexture(doorCanvas);
      const doorMat = new THREE.MeshStandardMaterial({ map: doorTex, roughness: 0.2, metalness: 0.5 });

      // Left Door Decal Panel
      const doorL = new THREE.Mesh(new THREE.PlaneGeometry(13.8, 5.2), doorMat);
      doorL.position.set(-8.82, 4.2, 0);
      doorL.rotation.y = -Math.PI / 2;
      group.add(doorL);

      // Right Door Decal Panel
      const doorR = new THREE.Mesh(new THREE.PlaneGeometry(13.8, 5.2), doorMat);
      doorR.position.set(8.82, 4.2, 0);
      doorR.rotation.y = Math.PI / 2;
      group.add(doorR);

      // White Center Roof Panel (Authentic LAPD Cruiser)
      const roofMat = new THREE.MeshPhysicalMaterial({ color: 0xf8fafc, metalness: 0.8, roughness: 0.2, clearcoat: 0.9, envMap });
      const whiteRoof = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.4, 11.5), roofMat);
      whiteRoof.position.set(0, 7.8, -1.2);
      group.add(whiteRoof);

      // Heavy-Duty Front Steel Push-Bumper (Bull-Bar)
      const pushBarMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4, metalness: 0.8 });
      const pushBarGroup = new THREE.Group();
      const mainBar = new THREE.Mesh(new THREE.BoxGeometry(14, 3.6, 1.2), pushBarMat);
      mainBar.position.set(0, 3.2, 17.5);
      pushBarGroup.add(mainBar);
      [-4.5, 4.5].forEach(vx => {
        const pad = new THREE.Mesh(new THREE.BoxGeometry(1.6, 6.2, 1.8), pushBarMat);
        pad.position.set(vx, 3.8, 17.6);
        pushBarGroup.add(pad);
      });
      group.add(pushBarGroup);

      // Aerodynamic Rooftop Emergency LED Strobe Lightbar (Alternating Red & Blue)
      const lightbar = new THREE.Group();
      const barBase = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.6, 2.8), pushBarMat);
      lightbar.add(barBase);

      const redLight = new THREE.Mesh(
        new THREE.BoxGeometry(4.4, 1.5, 2.5),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      redLight.position.set(-2.5, 0.9, 0);
      lightbar.add(redLight);

      const blueLight = new THREE.Mesh(
        new THREE.BoxGeometry(4.4, 1.5, 2.5),
        new THREE.MeshBasicMaterial({ color: 0x3b82f6 })
      );
      blueLight.position.set(2.5, 0.9, 0);
      lightbar.add(blueLight);

      lightbar.position.set(0, 8.8, -1.2);
      group.add(lightbar);

      // Iconic A-Pillar Police Spotlight (Searchlight)
      const spotMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.9, roughness: 0.2 });
      const spotlight = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.6, 12), spotMat);
      spotlight.rotation.z = Math.PI / 3;
      spotlight.position.set(-5.6, 6.2, 4.5);
      group.add(spotlight);

      // Dual Trunk Whip Antennas
      [-3.2, 3.2].forEach(ax => {
        const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.15, 6, 6), pushBarMat);
        antenna.position.set(ax, 7.5, -13);
        antenna.rotation.x = -0.15;
        group.add(antenna);
      });

      // Functional Taillights
      if (!taillightMesh) {
        const tl = new THREE.Mesh(new THREE.BoxGeometry(11, 1.4, 0.5), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        tl.position.set(0, 3.8, -16.8);
        group.add(tl);
        taillightMesh = tl;
      }

      group.userData = {
        redLight,
        blueLight,
        taillightMesh,
        isRealGLB: true
      };

      return group;
    }

    // Fallback: GTARealisticEntities police cruiser
    if (window.GTARealisticEntities && window.GTARealisticEntities.createRealisticVehicle) {
      return window.GTARealisticEntities.createRealisticVehicle('police', 0x09090b, envMap);
    }
    if (this.originalGTAModels && this.originalGTAModels.createPoliceCruiser) {
      return this.originalGTAModels.createPoliceCruiser();
    }
    return group;
  },

  // ----------------------------------------------------
  // FACTORY 2C: REAL 3D YELLOW TAXI CAB
  // ----------------------------------------------------
  createRealTaxi(envMap = null) {
    const group = new THREE.Group();
    const sedans = this.templates.cityProps.sedans;
    const cars = this.templates.cityProps.cars;

    if (cars && cars.length > 0) {
      const template = (sedans.length > 0 ? sedans[0] : cars[0]);
      const carMesh = template.clone();

      // High-Gloss NYC Yellow Cab Metallic Paint
      carMesh.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
          if (c.material) {
            c.material = new THREE.MeshPhysicalMaterial({
              color: 0xfacc15,
              metalness: 0.65,
              roughness: 0.22,
              clearcoat: 1.0,
              clearcoatRoughness: 0.05,
              envMap: envMap,
              envMapIntensity: 1.6
            });
          }
        }
      });

      const scale = 3.9;
      carMesh.scale.set(scale, scale, scale);
      group.add(carMesh);

      // Roof-Mounted Illuminated 3D "TAXI" Medallion
      const signGroup = new THREE.Group();
      const signBase = new THREE.Mesh(
        new THREE.BoxGeometry(5.4, 0.4, 2.2),
        new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 })
      );
      signGroup.add(signBase);

      const signBox = new THREE.Mesh(
        new THREE.BoxGeometry(4.8, 1.5, 1.8),
        new THREE.MeshStandardMaterial({
          color: 0xfef08a,
          emissive: 0xeab308,
          emissiveIntensity: 0.45,
          roughness: 0.2
        })
      );
      signBox.position.y = 0.95;
      signGroup.add(signBox);

      signGroup.position.set(0, 8.6, -1.2);
      group.add(signGroup);

      // Functional Taillights
      const tl = new THREE.Mesh(
        new THREE.BoxGeometry(9.5, 1.2, 0.4),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      tl.position.set(0, 3.6, -14.2);
      group.add(tl);

      group.userData = {
        taillightMesh: tl,
        isRealGLB: true
      };

      return group;
    }

    if (window.GTARealisticEntities && window.GTARealisticEntities.createRealisticVehicle) {
      return window.GTARealisticEntities.createRealisticVehicle('taxi', 0xfacc15, envMap);
    }
    return group;
  },

  // ----------------------------------------------------
  // FACTORY 3: REAL CALIFORNIA PALM TREES
  // ----------------------------------------------------
  createRealPalmTree(scale = 5.8) {
    const group = new THREE.Group();

    if (this.templates.palm) {
      const palm = this.templates.palm.clone();
      palm.scale.set(scale, scale, scale);
      palm.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });
      group.add(palm);
      group.userData.isRealGLB = true;
      return group;
    }

    // Safe Fallback: procedural palm
    if (this.originalGTAModels && this.originalGTAModels.createPhotorealisticPalmTree) {
      return this.originalGTAModels.createPhotorealisticPalmTree(28);
    }
    return group;
  },

  // ----------------------------------------------------
  // FACTORY 4: REAL OAK & PINE TREES
  // ----------------------------------------------------
  createRealTree(index = 0, scale = 4.5) {
    const group = new THREE.Group();
    const trees = this.templates.cityProps.trees;

    if (trees && trees.length > 0) {
      const template = trees[index % trees.length];
      const tree = template.clone();
      tree.scale.set(scale, scale, scale);
      tree.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });
      group.add(tree);
      group.userData.isRealGLB = true;
      return group;
    }

    if (this.originalGTAModels && this.originalGTAModels.createPhotorealisticOakTree) {
      return this.originalGTAModels.createPhotorealisticOakTree(26);
    }
    return group;
  },

  // ----------------------------------------------------
  // FACTORY 5: REAL STREET FURNITURE & LIGHTS
  // ----------------------------------------------------
  createRealStreetlight(scale = 4.2) {
    const group = new THREE.Group();
    const lights = this.templates.cityProps.lights;

    if (lights && lights.length > 0) {
      const light = lights[0].clone();
      light.scale.set(scale, scale, scale);
      light.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
        }
      });
      group.add(light);
      group.userData.isRealGLB = true;
      return group;
    }

    if (this.originalGTAModels && this.originalGTAModels.createHighwayStreetlight) {
      return this.originalGTAModels.createHighwayStreetlight();
    }
    return group;
  },

  createRealTrafficLight(scale = 4.0) {
    const group = new THREE.Group();
    const tLights = this.templates.cityProps.trafficLights;

    if (tLights && tLights.length > 0) {
      const tl = tLights[0].clone();
      tl.scale.set(scale, scale, scale);
      tl.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
        }
      });
      group.add(tl);
      group.userData.isRealGLB = true;
      return group;
    }

    if (window.GTARealisticEntities && window.GTARealisticEntities.createTrafficSignalPole) {
      return window.GTARealisticEntities.createTrafficSignalPole(0, 0);
    }
    return group;
  },

  createRealBench(scale = 3.6) {
    const group = new THREE.Group();
    const benches = this.templates.cityProps.benches;

    if (benches && benches.length > 0) {
      const b = benches[0].clone();
      b.scale.set(scale, scale, scale);
      group.add(b);
      group.userData.isRealGLB = true;
      return group;
    }
    return null;
  },

  createRealTrashCan(scale = 3.2) {
    const group = new THREE.Group();
    const trash = this.templates.cityProps.trashCans;

    if (trash && trash.length > 0) {
      const t = trash[0].clone();
      t.scale.set(scale, scale, scale);
      group.add(t);
      group.userData.isRealGLB = true;
      return group;
    }
    return null;
  },

  // ----------------------------------------------------
  // FACTORY 6: REAL 3D ARCHITECTURAL BUILDINGS & SHOPS
  // ----------------------------------------------------
  createRealBuilding(width = 90, height = 260, depth = 90, envMap = null) {
    const group = new THREE.Group();

    // If Google 3D building complex is available:
    if (this.templates.building) {
      const bldg = this.templates.building.clone();

      // Original is ~20 x 13 x 7. Scale up to city scale
      const sx = width / 20;
      const sy = height / 13;
      const sz = depth / 7;
      bldg.scale.set(sx, sy, sz);

      bldg.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
          if (c.material) {
            c.material.envMap = envMap;
            c.material.envMapIntensity = 0.8;
            c.material.needsUpdate = true;
          }
        }
      });

      group.add(bldg);
      group.userData.isRealGLB = true;
      return group;
    }

    // Secondary: Use shop/house from city.glb
    const houses = this.templates.cityProps.houses;
    if (houses && houses.length > 0) {
      const house = houses[Math.floor(Math.random() * houses.length)].clone();
      house.scale.set(5.5, 5.5, 5.5);
      group.add(house);
      group.userData.isRealGLB = true;
      return group;
    }

    // Fallback: Detailed skyscraper from GTARealismUpgrade
    if (window.GTARealismUpgrade && window.GTARealismUpgrade.createDetailedSkyscraper) {
      return window.GTARealismUpgrade.createDetailedSkyscraper(width, height, depth, 'azure', envMap);
    }

    return group;
  },

  // ----------------------------------------------------
  // FACTORY 7: REAL RIGGED 3D HUMAN CHARACTERS
  // ----------------------------------------------------
  createRealCharacter(isPolice = false, isStudent = false) {
    const group = new THREE.Group();

    const charSource = isPolice ? this.templates.soldier : (this.templates.character || this.templates.soldier);

    if (charSource && charSource.scene) {
      const charMesh = THREE.SkeletonUtils ? THREE.SkeletonUtils.clone(charSource.scene) : charSource.scene.clone();

      // Scale to human height (~14 units)
      const scale = isPolice ? 0.085 : 7.8;
      charMesh.scale.set(scale, scale, scale);
      charMesh.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
        }
      });

      group.add(charMesh);

      // Set up AnimationMixer if animations exist
      if (charSource.animations && charSource.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(charMesh);
        const walkClip = charSource.animations.find(a => a.name.toLowerCase().includes('walk') || a.name.toLowerCase().includes('run')) || charSource.animations[0];
        if (walkClip) {
          const action = mixer.clipAction(walkClip);
          action.play();
        }
        this.activeMixers.push(mixer);
        group.userData.mixer = mixer;
      }

      group.userData.isRealGLB = true;
      return group;
    }

    // Fallback: Real human from GTARealisticEntities
    if (window.GTARealisticEntities && window.GTARealisticEntities.createRealisticHuman) {
      return window.GTARealisticEntities.createRealisticHuman({
        type: isPolice ? 'police' : (isStudent ? 'student' : 'casual')
      });
    }

    return group;
  },

  // ----------------------------------------------------
  // FACTORY 8: REAL 3D HAMNA DEVELOPER CHARACTER
  // ----------------------------------------------------
  createRealHamnaCharacter(envMap = null) {
    const group = new THREE.Group();
    const charSource = this.templates.character;

    if (charSource && charSource.scene) {
      const charMesh = THREE.SkeletonUtils ? THREE.SkeletonUtils.clone(charSource.scene) : charSource.scene.clone();

      // Human height ~12.8 units tall to match world scale
      const scale = 8.0;
      charMesh.scale.set(scale, scale, scale);

      // Customize materials for Hamna's developer attire (photo: charcoal top + slate trousers)
      // IMPORTANT: skinning must be true for SkinnedMesh in Three.js!
      const topMat = new THREE.MeshStandardMaterial({
        color: 0x18181b, // Charcoal / Black Developer Ribbed Top
        roughness: 0.72,
        metalness: 0.06,
        skinning: true,
        envMap: envMap
      });

      const pantsMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b, // Tailored Slate Trousers
        roughness: 0.78,
        metalness: 0.05,
        skinning: true,
        envMap: envMap
      });

      let headBone = null;
      charMesh.traverse(c => {
        if (c.name === 'mixamorigHead' || c.name === 'mixamorig:Head') {
          headBone = c;
        }
        if (c.isMesh || c.isSkinnedMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
          if (c.material) {
            c.material = (c.name && c.name.includes('Joints')) ? topMat : pantsMat;
            c.material.skinning = true;
          }
        }
      });

      // Elegant styled light-silver silk hijab & face portrait (bone local space coordinates in cm)
      const hijabMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0, // Soft light-silver grey silk hijab matching photo
        roughness: 0.75,
        metalness: 0.08
      });
      const scarf = new THREE.Mesh(new THREE.SphereGeometry(18, 18, 18), hijabMat);
      scarf.position.set(0, 10, -2);
      scarf.scale.set(0.96, 1.18, 1.08);

      // Flowing neck drape
      const drape = new THREE.Mesh(new THREE.CylinderGeometry(11, 16, 22, 16), hijabMat);
      drape.position.set(0, -4, 3);

      // Hamna's Real Face Photo Decal
      const faceMat = new THREE.MeshBasicMaterial({
        color: 0xd4a373, // Warm skin tone base while loading
        side: THREE.DoubleSide
      });
      const faceDecal = new THREE.Mesh(new THREE.PlaneGeometry(22, 28), faceMat);
      faceDecal.position.set(0, 10, 14);
      faceDecal.rotation.x = -0.05;

      const texLoader = new THREE.TextureLoader();
      texLoader.load('assets/hamna_face.jpg', (faceTex) => {
        faceTex.encoding = THREE.sRGBEncoding;
        faceMat.map = faceTex;
        faceMat.color.setHex(0xffffff);
        faceMat.needsUpdate = true;
      });

      if (headBone) {
        headBone.add(scarf);
        headBone.add(drape);
        headBone.add(faceDecal);
      } else {
        charMesh.add(scarf);
        charMesh.add(faceDecal);
      }

      group.add(charMesh);

      // Floating GTA 5 Nameplate Badge above Hamna
      const nameCanvas = document.createElement('canvas');
      nameCanvas.width = 256;
      nameCanvas.height = 64;
      const nctx = nameCanvas.getContext('2d');
      nctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      nctx.fillRect(0, 0, 256, 64);
      nctx.strokeStyle = '#f59e0b';
      nctx.lineWidth = 4;
      nctx.strokeRect(2, 2, 252, 60);
      nctx.font = '900 24px "Plus Jakarta Sans", sans-serif';
      nctx.fillStyle = '#f59e0b';
      nctx.textAlign = 'center';
      nctx.fillText('HAMNA // DEVELOPER', 128, 42);

      const nameTex = new THREE.CanvasTexture(nameCanvas);
      const nameSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: nameTex }));
      nameSprite.position.set(0, 17.2, 0);
      nameSprite.scale.set(16, 4.0, 1);
      group.add(nameSprite);

      // Set up AnimationMixer with Idle, Walk, and Run skeletal animations
      let actions = {};
      let mixer = null;
      if (charSource.animations && charSource.animations.length > 0) {
        mixer = new THREE.AnimationMixer(charMesh);
        const anims = charSource.animations;

        const idleClip = anims.find(a => a.name.toLowerCase() === 'idle') || anims[0];
        const walkClip = anims.find(a => a.name.toLowerCase() === 'walk') || anims[1] || anims[0];
        const runClip = anims.find(a => a.name.toLowerCase() === 'run') || walkClip;

        actions.idle = mixer.clipAction(idleClip);
        actions.walk = mixer.clipAction(walkClip);
        actions.run = mixer.clipAction(runClip);

        actions.idle.play();
        this.activeMixers.push(mixer);
      }

      group.userData = {
        mixer: mixer,
        actions: actions,
        currentAction: actions.idle || null,
        isRealGLB: true,
        isHamna: true
      };

      return group;
    }

    // Safe fallback to procedural Hamna if GLB still loading
    if (this.originalGTAModels && this.originalGTAModels.createPlayerCharacter) {
      return this.originalGTAModels.createPlayerCharacter();
    }
    return group;
  },

  // Update animation mixers per frame (auto-prunes orphaned mixers to preserve 60 FPS)
  update(delta = 0.016) {
    const clampedDelta = Math.min(delta, 0.05);
    for (let i = this.activeMixers.length - 1; i >= 0; i--) {
      const mixer = this.activeMixers[i];
      const root = mixer.getRoot ? mixer.getRoot() : null;
      if (!root || !root.parent) {
        try { mixer.stopAllAction(); } catch (e) {}
        this.activeMixers.splice(i, 1);
        continue;
      }
      mixer.update(clampedDelta);
    }
  }
};

window.GTAModelLoader = GTAModelLoader;
