// ========================================================
// GTA 5 REALISTIC US METROPOLIS OPEN-WORLD ENGINE
// Multi-Lane Highway, Central Park & Waterfall, Pedestrians,
// Hamna VIP Tower Security Guards, Police Siren Apprehension & GPS Map
// ========================================================

class OpenWorldGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Player (Hamna) State - Spawns on Campus Boulevard directly facing the American University Gates!
    this.player = null;
    this.playerPos = { x: 0, y: 0, z: -380 };
    this.playerRot = Math.PI; // Facing North towards University Campus Gates & Flex Billboard
    this.isSprinting = false;
    this.isJumping = false;
    this.jumpY = 0;
    this.jumpVelocity = 0;

    // Vehicles (Realistic Sports Supercar & Police Cruiser)
    this.car = null;
    this.carPos = { x: 28, y: 0, z: -380 }; // Curbside on Campus Boulevard
    this.carRot = Math.PI;
    this.carSpeed = 0;
    this.carMaxSpeed = 8.5;
    this.carAcceleration = 0.18;
    this.carFriction = 0.96;
    this.isDriving = false;

    // Realistic Car Collision, Roll-Over & Tumble Physics
    this.carRoll = 0;
    this.carPitch = 0;
    this.carY = 0;
    this.carVy = 0;
    this._lastCrashSoundTime = 0;

    // GTA Wanted Level & Police Patrol Pursuit System
    this.wantedLevel = 0; // 0 = clear, 1 = 1 star, 2 = 2 stars, 3 = 3 stars
    this.lastWantedTime = 0;
    this.isPolicePursuing = false;

    // Police Cruiser
    this.policeCar = null;
    this.policeCarPos = { x: 65, y: 0, z: -360 };
    this.policeCarRot = 0;
    this.policeSirenLights = [];

    // Animated Traffic Cars
    this.trafficCars = [];

    // Animated Pedestrians & Campus Students
    this.pedestrians = [];

    // Fountain & Waterfall Particles
    this.waterfallParticles = [];
    this.fountainParticles = [];

    // Rocket & Orbit
    this.rocket = null;
    this.rocketPos = { x: 600, y: 0, z: 0 };
    this.isRocketLaunching = false;
    this.isInSpace = false;
    this.rocketAltitude = 0;

    // Input
    this.keys = {};

    // Landmarks / Interaction Zones (5 Dedicated Villages & Authentic Buildings)
    this.landmarks = [
      {
        id: 'village_education',
        name: "Academic Education Village (APJ KTU & Calicut University)",
        x: -200, z: -360, radius: 95,
        modalId: 'education-village-modal',
        icon: '🎓'
      },
      {
        id: 'village_skills',
        name: "Tech & Fullstack Skills Village (Core Matrix)",
        x: -120, z: -120, radius: 75,
        modalId: 'skills-village-modal',
        icon: '⚡'
      },
      {
        id: 'village_experience',
        name: "Corporate Experience Tech Park (Cognilearn & Softroniics)",
        x: 250, z: -125, radius: 85,
        modalId: 'experience-village-modal',
        icon: '💼'
      },
      {
        id: 'village_projects',
        name: "Innovation & Projects Village (Collab-Hub & Trendrove)",
        x: 320, z: 250, radius: 85,
        modalId: 'projects-village-modal',
        icon: '🚀'
      },
      {
        id: 'village_profile',
        name: "Hamna Profile & Heritage Residence (Bio & Contact)",
        x: -320, z: -125, radius: 70,
        modalId: 'profile-village-modal',
        icon: '🏠'
      },
      {
        id: 'home',
        name: "Fathima Hamna K — Developer Profile & Residence",
        x: -320, z: -125, radius: 45,
        modalId: 'profile-village-modal',
        icon: '🏠'
      },
      {
        id: 'cognilearn',
        name: "Cognilearn R&D Software Tech Park",
        x: 320, z: -125, radius: 45,
        modalId: 'cognilearn-experience-modal',
        icon: '💼'
      },
      {
        id: 'softroniics',
        name: "Softroniics Fullstack Hub (Calicut)",
        x: 240, z: 125, radius: 45,
        modalId: 'softroniics-experience-modal',
        icon: '💻'
      },
      {
        id: 'ktu_mca',
        name: "APJ KTU — Master of Computer Application (MCA)",
        x: -260, z: -360, radius: 60,
        modalId: 'ktu-mca-building-modal',
        icon: '🎓'
      },
      {
        id: 'calicut_bca',
        name: "University of Calicut — BCA Honors Hall",
        x: -140, z: -360, radius: 45,
        modalId: 'calicut-bca-building-modal',
        icon: '📜'
      },
      {
        id: 'collabhub',
        name: "Collab-Hub Venture Platform HQ",
        x: 340, z: 125, radius: 50,
        modalId: 'collabhub-project-modal',
        icon: '🚀'
      },
      {
        id: 'trendrove',
        name: "Trendrove AI Fashion Studio",
        x: 300, z: 380, radius: 50,
        modalId: 'trendrove-project-modal',
        icon: '👗'
      },
      {
        id: 'skills',
        name: "Fullstack Skills & Tech Matrix Pavilion",
        x: -120, z: -120, radius: 45,
        modalId: 'skills-village-modal',
        icon: '⚡'
      },
      {
        id: 'beacon',
        name: "Calicut Dev Beacon // Contact Uplink & CV",
        x: -640, z: -40, radius: 50,
        modalId: 'contact-beacon-modal',
        icon: '🗼'
      },
      {
        id: 'ktu_gate',
        name: "APJ KTU Campus Gates & Honors Billboard",
        x: -200, z: -360, radius: 55,
        modalId: 'education-village-modal',
        icon: '🎓'
      },
      {
        id: 'vip_tower',
        name: "Hamna VIP Tower (Executive Penthouse)",
        x: 180, z: -125, radius: 60,
        modalId: 'vip-tower-interior-modal',
        icon: '🏢'
      },
      {
        id: 'security_gate',
        name: "Security Checkpoint // Intruder Breach",
        x: 180, z: -70, radius: 45,
        modalId: 'security-arrest-modal',
        icon: '🚨'
      },
      {
        id: 'waterfall',
        name: "Central Park Cascading Waterfall & Lagoon",
        x: -360, z: 125, radius: 85,
        modalId: 'waterfall-park-modal',
        icon: '🌊'
      },
      {
        id: 'mountains',
        name: "Mount Chiliad Alpine Horizon Ridge",
        x: 0, z: -1400, radius: 240,
        modalId: null,
        icon: '🏔️'
      },
      {
        id: 'spaceport',
        name: "International Spaceport & Rocket Gantry",
        x: 640, z: 0, radius: 65,
        modalId: 'spaceport-launch-modal',
        icon: '✈️'
      },
      {
        id: 'workshop',
        name: "Los Santos Customs Auto Repair & Tuning",
        x: -190, z: -125, radius: 55,
        modalId: 'workshop-modal',
        icon: '🔧'
      },
      {
        id: 'police_hq',
        name: "Metro Police Headquarters & Cybercrime Division",
        x: 130, z: -565, radius: 65,
        modalId: 'police-hq-modal',
        icon: '🚔'
      },
      {
        id: 'coastal_pier',
        name: "Santa Monica Pier & Ocean Boardwalk Marina",
        x: -640, z: 320, radius: 85,
        modalId: 'coastal-pier-modal',
        icon: '🏖️'
      },
      {
        id: 'silicon_towers',
        name: "Hamna AI Cloud & FinTech Skyscraper Plaza",
        x: 380, z: 390, radius: 85,
        modalId: 'silicon-towers-modal',
        icon: '🏙️'
      },
      {
        id: 'datacenter_park',
        name: "DevOps Datacenter & Distributed Cloud Systems",
        x: 320, z: -370, radius: 65,
        modalId: 'datacenter-modal',
        icon: '💻'
      },
      {
        id: 'beach_resort',
        name: "Pacific Golden Beach & Coastline Resort",
        x: -640, z: 200, radius: 105,
        modalId: 'beach-resort-modal',
        icon: '🏖️'
      },
      {
        id: 'gateway_bridge',
        name: "Golden Gateway Grand Suspension Bridge",
        x: -560, z: 0, radius: 95,
        modalId: 'gateway-bridge-modal',
        icon: '🌉'
      },
      {
        id: 'sports_arena',
        name: "Metropolitan Sports Arena & Athletic Playground",
        x: -260, z: 390, radius: 95,
        modalId: 'sports-arena-modal',
        icon: '⚽'
      },
      {
        id: 'certificates_pavilion',
        name: "Certificates & Academic Honors Pavilion",
        x: 220, z: 390, radius: 75,
        modalId: 'certificates-pavilion-modal',
        icon: '🏆'
      },
      {
        id: 'car_showroom',
        name: "Hamna Luxury Motorsports Showroom (Exotic & Vintage)",
        x: -200, z: 130, radius: 85,
        modalId: 'car-showroom-modal',
        icon: '🏎️'
      }
    ];

    this.activeInteraction = null;
    this.minimapCtx = document.getElementById('minimap-canvas') ? document.getElementById('minimap-canvas').getContext('2d') : null;

    // Vehicle control state
    this.currentVehicle = null; // 'car' | 'police' | null
    this.policeCarSpeed = 0;
    this.policeCarMaxSpeed = 8.2;
    this.policeCarAcceleration = 0.17;
    this.policeCarFriction = 0.96;
    this.isPlayerSirenActive = false;
    this.policeCruisers = []; // Multiple active & parked police cruisers across city
    this._minimapFrame = 0;
    this._cachedPromptEl = null;
    this._lastPromptLandmark = null;
    this._lastIsDrivingPrompt = null;
    this._speedEl = null;

    // Authentic GTA 5 Systems: Camera Modes, Radio, Time of Day, Drift
    this.cameraMode = 0; // 0: Normal 3rd, 1: Far 3rd, 2: Cinematic Action, 3: Hood/1st-Person
    this.cameraYaw = Math.PI;    // Camera horizontal angle (facing North initially)
    this.cameraPitch = 0.22;     // Camera pitch elevation (~13 degrees downward - spacious open framing)
    this.cameraDist = 72;        // Comfortable, grand distance on foot (Spacious, open GTA V view!)
    this.cameraTargetDist = 72;  // Default target distance
    this.isMouseLooking = false; // Mouse drag state
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.mouseSensitivity = 0.0032;
    this.lastMouseLookTime = 0;  // Timestamp of last mouse movement for smooth auto-centering
    this.timeOfDay = 0;  // 0: Noon, 1: Sunset, 2: Midnight
    this.radioStations = [
      '📻 LOS SANTOS ROCK RADIO',
      '📻 NON-STOP-POP FM',
      '📻 RADIO MIRROR PARK',
      '📻 FLYLO FM',
      '📻 WEST COAST TALK RADIO',
      '🔇 RADIO OFF'
    ];
    this.currentRadioIdx = 0;
    this.headlightsOn = true;
    this.skyDome = null;
    this.ambientLight = null;
    this.hemiLight = null;

    // Roadside Vehicles
    this.taxiCab = null;

    // Los Santos Customs Roadside Towing & Recovery Fleet
    this.towTruck = null;
    this.activeTowMission = null;
    this.workshopSpawnPos = { x: -120, y: 0, z: -215 };

    // Master Bounding Box Collision Registry for Buildings & Structures
    this.buildingColliders = [
      // North-West Block A: APJ KTU MCA Campus & Calicut BCA Hall
      { minX: -360, maxX: -160, minZ: -450, maxZ: -290, name: 'APJ KTU MCA Campus' },
      { minX: -190, maxX: -90, minZ: -450, maxZ: -290, name: 'Calicut BCA Hall' },

      // North-West Block B: Los Santos Customs & Hamna Residence Villa
      { minX: -240, maxX: -140, minZ: -170, maxZ: -80, name: 'Auto Repair Workshop' },
      { minX: -380, maxX: -260, minZ: -170, maxZ: -80, name: 'Hamna Residence Villa' },
      { minX: -140, maxX: -70, minZ: -150, maxZ: -70, name: 'Skills & Tech Pavilion' },

      // South-West Block C: Hamna Luxury Motorsports Showroom & Central Park
      { minX: -260, maxX: -140, minZ: 70, maxZ: 190, name: 'Hamna Luxury Motorsports Showroom' },
      { minX: -440, maxX: -280, minZ: 65, maxZ: 190, name: 'Central Park Waterfall Lake' },

      // South-West Block D: Metropolitan Sports Arena & Playground Bleachers
      { minX: -340, maxX: -180, minZ: 330, maxZ: 450, name: 'Metropolitan Sports Arena' },

      // West Coast: Pacific Golden Beach & Golden Gateway Bridge
      { minX: -720, maxX: -650, minZ: 120, maxZ: 200, name: 'Beach Lifeguard Tower' },
      { minX: -585, maxX: -535, minZ: -120, maxZ: -90, name: 'Bridge Tower North' },
      { minX: -585, maxX: -535, minZ: 60, maxZ: 90, name: 'Bridge Tower South' },

      // North-East Block E: Metro Police HQ & DevOps Datacenter
      { minX: 90, maxX: 230, minZ: -450, maxZ: -290, name: 'Metro Police Headquarters' },
      { minX: 250, maxX: 390, minZ: -450, maxZ: -290, name: 'DevOps Datacenter Park' },

      // North-East Block F: Hamna VIP Tower & Cognilearn Tech Park
      { minX: 120, maxX: 240, minZ: -170, maxZ: -80, name: 'Hamna VIP Skyscraper' },
      { minX: 260, maxX: 390, minZ: -170, maxZ: -80, name: 'Cognilearn Tech Park' },

      // South-East Block G: Gas Station, Softroniics & Collab-Hub
      { minX: 100, maxX: 190, minZ: 70, maxZ: 180, name: 'Ron Oil Service Station' },
      { minX: 200, maxX: 290, minZ: 70, maxZ: 180, name: 'Softroniics Fullstack Hub' },
      { minX: 300, maxX: 410, minZ: 70, maxZ: 180, name: 'Collab-Hub HQ' },

      // South-East Block H: Certificates Pavilion, Trendrove & Silicon Financial Towers
      { minX: 140, maxX: 260, minZ: 330, maxZ: 450, name: 'Certificates Pavilion' },
      { minX: 270, maxX: 350, minZ: 330, maxZ: 450, name: 'Trendrove AI Fashion Studio' },
      { minX: 360, maxX: 450, minZ: 330, maxZ: 450, name: 'Silicon Financial Towers' },

      // Far East: Spaceport Launch Complex
      { minX: 580, maxX: 720, minZ: -70, maxZ: 70, name: 'Spaceport Launch Gantry' },

      // Metropolis Outer Perimeter Boundary Walls (Solid Physical Limits)
      { minX: -760, maxX: 610, minZ: -760, maxZ: -735, name: 'North Mountain Boundary' },
      { minX: -760, maxX: 610, minZ: 675, maxZ: 700, name: 'South Perimeter Wall' },
      { minX: 585, maxX: 610, minZ: -750, maxZ: 690, name: 'East Tech Security Wall' },
      { minX: -765, maxX: -740, minZ: -750, maxZ: 690, name: 'West Ocean Sea Barrier' }
    ];

    this.init();
  }

  registerBuildingCollider(collider) {
    if (!this.buildingColliders) this.buildingColliders = [];
    this.buildingColliders.push(collider);
  }

  // Strict Road Collision Clearance: Ensures trees, statues or obstacles NEVER spawn on roadways
  isOnRoad(x, z, buffer = 14) {
    // 1. Central Interstate Highway (x in [-75, 75], z > -520)
    if (Math.abs(x) < 75 + buffer && z > -520) return true;
    // 2. Coastal Highway (x in [-535, -445], z between -1400 and 1400)
    if (x >= -535 - buffer && x <= -445 + buffer && Math.abs(z) < 1400) return true;
    // 3. Avenue 1 Express (z in [-55, 55], x between -800 and 900)
    if (Math.abs(z) < 55 + buffer && x >= -800 && x <= 900) return true;
    // 4. Avenue 2 (z in [-285, -195], x between -550 and 450)
    if (z >= -285 - buffer && z <= -195 + buffer && x >= -550 && x <= 450) return true;
    // 5. Avenue 3 (z in [195, 285], x between -450 and 550)
    if (z >= 195 - buffer && z <= 285 + buffer && x >= -450 && x <= 550) return true;
    // 6. Academic Parkway access (x in [-50, 50], z between -480 and -210)
    if (Math.abs(x) < 50 + buffer && z >= -480 - buffer && z <= -210 + buffer) return true;
    // 7. Avenue 4 South Boulevard (z in [480, 560], x between -600 and 520)
    if (z >= 480 - buffer && z <= 560 + buffer && x >= -600 && x <= 520) return true;
    // 8. Avenue 5 North Boulevard (z in [-520, -440], x between -580 and 300)
    if (z >= -520 - buffer && z <= -440 + buffer && x >= -580 && x <= 300) return true;
    // 9. Coastal Beach Promenade (x in [-600, -520], z between -700 and 700)
    if (x >= -600 - buffer && x <= -520 + buffer && Math.abs(z) < 700) return true;
    // 10. East Tech Parkway (x in [420, 500], z between -480 and 570)
    if (x >= 420 - buffer && x <= 500 + buffer && z >= -480 && z <= 570) return true;
    return false;
  }

  init() {
    if (!this.canvas) return;

    // 1. Three.js Scene Setup (Cinematic GTA 5 Atmosphere & Lighting)
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      4000
    );
    this.camera.position.set(this.playerPos.x, 18, this.playerPos.z + 72);
    this.clock = new THREE.Clock();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // Optimized pixel ratio eliminates high-DPI GPU fill-rate throttling and lag
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));

    // ACES Filmic Tone Mapping (Exact GTA 5 / Unreal Engine Cinematic Exposure)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    // Contact shadows and ambient occlusion provide full grounding without costly shadow map lag
    this.renderer.shadowMap.enabled = false;

    // 2. Giant Atmospheric Sky Dome with Horizon Gradient & Sun Disc
    if (window.GTATextures) {
      const skyGeo = new THREE.SphereGeometry(7500, 32, 24);
      const skyMat = new THREE.MeshBasicMaterial({
        map: window.GTATextures.createAtmosphericSkyDome(),
        side: THREE.BackSide
      });
      this.skyDome = new THREE.Mesh(skyGeo, skyMat);
      this.scene.add(this.skyDome);
    }
    this.scene.fog = new THREE.FogExp2(0xbae6fd, 0.00032);

    // 3. Realistic Sunlight & Ambient
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.35);
    this.sunLight.position.set(600, 1000, 500);
    this.sunLight.castShadow = false;
    this.scene.add(this.sunLight);

    this.hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x166534, 0.55);
    this.scene.add(this.hemiLight);

    // Photorealistic Realism System Pre-Init (Overrides architecture, textures, entities)
    if (window.GTARealismUpgrade) {
      window.GTARealismUpgrade.preInit(this);
    }

    // 4. Build US Metropolis Environment (Highways, Central Park, Waterfall, Buildings)
    this.buildUSMetropolis();

    // 5. Build Characters & Pedestrians
    this.buildPlayerCharacter();
    this.buildPedestrians();

    // 6. Build Driveable Vehicles (Sports Car & Police Interceptor)
    this.buildSportsCar();
    this.buildPoliceCruiser();

    // 7. Build Moving Traffic
    this.buildHighwayTraffic();

    // 8. Build Space Rocket
    this.buildSpaceRocket();

    // Install Photorealistic Environment Reflections, Lighting & Street Features
    if (window.GTARealismUpgrade) {
      window.GTARealismUpgrade.install(this.scene, this.renderer, this);
    }

    // 9. Event Listeners & Mouse Orbit Controls
    this.setupMouseControls();
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));

    this.animate();
  }

  buildUSMetropolis() {
    // 1. Lush Organic Ground Grass Terrain
    const grassTex = window.GTATextures ? window.GTATextures.createLushGrass() : null;
    if (grassTex) grassTex.repeat.set(65, 65);
    const groundMat = new THREE.MeshStandardMaterial({
      map: grassTex,
      color: 0xffffff,
      roughness: 0.88,
      metalness: 0.05
    });
    const groundGeo = new THREE.PlaneGeometry(5400, 5400);
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // 2. Multi-Lane Interstate Highway System (North-South Grand Freeway)
    const asphaltTex = window.GTATextures ? window.GTATextures.createHighwayAsphalt() : null;
    if (asphaltTex) asphaltTex.repeat.set(1, 32);
    const highwayMat = new THREE.MeshStandardMaterial({
      map: asphaltTex,
      roughness: 0.72,
      metalness: 0.18
    });
    const highwayGeo = new THREE.PlaneGeometry(120, 3800);
    const highway = new THREE.Mesh(highwayGeo, highwayMat);
    highway.rotation.x = -Math.PI / 2;
    highway.position.set(0, 0.35, 0);
    highway.receiveShadow = true;
    this.scene.add(highway);

    // 3. Concrete Curbs & Paved Sidewalks along Interstate Highway
    const paverTex = window.GTATextures ? window.GTATextures.createSidewalkPaver() : null;
    if (paverTex) paverTex.repeat.set(2, 60);
    const sidewalkMat = new THREE.MeshStandardMaterial({
      map: paverTex,
      roughness: 0.85,
      metalness: 0.1
    });
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.75, metalness: 0.1 });

    [-68, 68].forEach(sx => {
      const curb = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.4, 3800), curbMat);
      curb.position.set(sx > 0 ? 61.2 : -61.2, 0.7, 0);
      curb.castShadow = true;
      curb.receiveShadow = true;
      this.scene.add(curb);

      const sw = new THREE.Mesh(new THREE.PlaneGeometry(22, 3800), sidewalkMat);
      sw.rotation.x = -Math.PI / 2;
      sw.position.set(sx > 0 ? 73.5 : -73.5, 0.85, 0);
      sw.receiveShadow = true;
      this.scene.add(sw);
    });

    // 4. Pacific Ocean Water Surface & Scenic Coastal Highway along Western Bluffs
    if (window.GTAModels && window.GTAModels.createPacificOcean) {
      this.ocean = window.GTAModels.createPacificOcean(2400, 4200);
      this.scene.add(this.ocean);
    }

    const coastalAsphaltTex = window.GTATextures ? window.GTATextures.createCrosswayAsphalt() : null;
    if (coastalAsphaltTex) coastalAsphaltTex.repeat.set(1, 18);
    const coastalHwy = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 2600),
      new THREE.MeshStandardMaterial({ map: coastalAsphaltTex, roughness: 0.72, metalness: 0.18 })
    );
    coastalHwy.rotation.x = -Math.PI / 2;
    coastalHwy.position.set(-490, 0.36, 0);
    coastalHwy.receiveShadow = true;
    this.scene.add(coastalHwy);

    // 5. Connecting Systematic Grid Roads (Paved Avenues connecting Districts)
    const crosswayTex = window.GTATextures ? window.GTATextures.createCrosswayAsphalt() : null;
    const crosswayMat = new THREE.MeshStandardMaterial({
      map: crosswayTex,
      roughness: 0.72,
      metalness: 0.18
    });

    // Avenue 1 (East-West Express Avenue, z = 0): Connects Coastal Bluffs to International Spaceport
    if (crosswayTex) crosswayTex.repeat.set(24, 1);
    const ave1 = new THREE.Mesh(new THREE.PlaneGeometry(1600, 90), crosswayMat);
    ave1.rotation.x = -Math.PI / 2;
    ave1.position.set(50, 0.38, 0);
    ave1.receiveShadow = true;
    this.scene.add(ave1);

    // Avenue 2 (z = -240): Connects Villa Driveway to Hamna VIP Tower Plaza
    const ave2 = new THREE.Mesh(new THREE.PlaneGeometry(900, 70), crosswayMat);
    ave2.rotation.x = -Math.PI / 2;
    ave2.position.set(-50, 0.37, -240);
    ave2.receiveShadow = true;
    this.scene.add(ave2);

    // Avenue 3 (z = 240): Connects Collab-Hub Pavilion to Trendrove AI Studio
    const ave3 = new THREE.Mesh(new THREE.PlaneGeometry(900, 70), crosswayMat);
    ave3.rotation.x = -Math.PI / 2;
    ave3.position.set(50, 0.37, 240);
    ave3.receiveShadow = true;
    this.scene.add(ave3);

    // Academic Parkway (z = -420): Connects Central Highway directly into KTU Campus Gates
    const acadParkway = new THREE.Mesh(new THREE.PlaneGeometry(80, 220), crosswayMat);
    acadParkway.rotation.x = -Math.PI / 2;
    acadParkway.position.set(0, 0.37, -330);
    acadParkway.receiveShadow = true;
    this.scene.add(acadParkway);

    // 6. Overpass Glass Pedestrian Bridges
    this.buildOverpassBridge(0, 30, 200);
    this.buildOverpassBridge(0, 30, -200);

    // 7. Commercial Highway Billboards with Real Photographic Assets
    if (window.GTAModels && window.GTAModels.createRealAssetBillboard) {
      // Highway Patrol Billboard (security_arrest.jpg)
      const bbPolice = window.GTAModels.createRealAssetBillboard(64, 36, 'securityArrest', 'HIGHWAY PATROL', 'ENFORCEMENT');
      bbPolice.position.set(78, 0, -360);
      this.scene.add(bbPolice);

      // Grotti Turismo R Supercar Billboard (supercar_street.jpg)
      const bbSupercar = window.GTAModels.createRealAssetBillboard(64, 36, 'supercarStreet', 'GROTTI TURISMO R', 'SUPERCAR');
      bbSupercar.position.set(-78, 0, 360);
      bbSupercar.rotation.y = Math.PI;
      this.scene.add(bbSupercar);
    }

    // 8. Dedicated Real Buildings for Every CV Section & Metropolis Landmarks
    this.buildCentralParkAndWaterfall();
    this.buildHamnaVIPTower();
    this.buildHomeVilla();               // Profile & Developer Identity
    this.buildCognilearnTechPark();      // Experience 1: Cognilearn R&D Tech Park
    this.buildSoftroniicsHub();          // Experience 2: Softroniics Fullstack Hub (Calicut)
    this.buildCollabHubPavilion();       // Project 1: Collab-Hub Venture Platform
    this.buildTrendroveStudio();         // Project 2: Trendrove AI Fashion Studio
    this.buildKtuUniversity();           // Education 1: APJ KTU MCA Campus
    this.buildCalicutUniversityHall();   // Education 2: University of Calicut BCA Hall
    this.buildSkillsPavilion();          // Skills: Fullstack Core Matrix
    this.buildAirportSpaceport();        // International Spaceport & Orbital Rocket
    this.buildLighthouseLandmark();      // Calicut Dev Beacon & Direct CV Uplink
    this.buildThemedVillages();          // 5 Dedicated CV Villages (Portals & Royal Palms)
    this.buildMountainRanges();          // Majestic 3D Rocky Mountains (North & East Horizon)
    this.buildRoadsideDirectionalSignboards(); // 3D Directional Fingerposts & Overhead Highway Gantries
    this.buildAutoRepairWorkshop();      // Los Santos Customs 24/7 Workshop & Recovery Tow Fleet
    this.buildGasStation();              // Ron Oil 24/7 Service Station
    this.buildStreetInfrastructure();    // Bus Stops, Traffic Lights, Manhole Covers & Drains

    // 9. Distant Downtown Metropolis High-Rise Skyline
    this.buildDowntownMetropolisSkyline();

    // 10. Overhead Highway Interstate Streetlamps
    this.buildHighwayStreetlamps();

    // 11. Campus Boulevard Street Elements & Realistic Vehicles
    this.buildCampusBoulevardElements();
    this.buildCampusBoulevardVehicles();

    // 12. Expanded Infrastructure, Roads & Districts
    this.buildExpandedRoadNetwork();
    this.buildPoliceHeadquartersPrecinct();
    this.buildCoastalBeachPierAndMarina();
    this.buildSiliconFinancialTowers();
    this.buildDevOpsDatacenterPark();
    this.buildPacificGoldenBeach();
    this.buildGoldenGatewayBridge();
    this.buildMetropolitanSportsArena();
    this.buildCertificatesAndHonorsPavilion();
    this.buildHamnaLuxuryShowroom();
    this.buildMetropolisBoundarySystem();
    this.buildVillageEntrancePylons();
  }

  // ========================================================
  // 5 DEDICATED THEMED CV VILLAGES (GRAND 3D ENTRANCE PORTALS & VEGETATION)
  // ========================================================
  buildThemedVillages() {
    // 1. ACADEMIC & EDUCATION VILLAGE (KTU MCA & Calicut BCA)
    if (window.GTAModels && window.GTAModels.createVillageEntranceMonument) {
      const eduMonument = window.GTAModels.createVillageEntranceMonument(
        'ACADEMIC & EDUCATION VILLAGE',
        'APJ KTU MCA & UNIVERSITY OF CALICUT BCA CAMPUS',
        '#38bdf8',
        0x38bdf8
      );
      eduMonument.position.set(-90, 0, -350);
      this.scene.add(eduMonument);
    }

    // 2. TECH & FULLSTACK SKILLS VILLAGE (Silicon Matrix)
    if (window.GTAModels && window.GTAModels.createVillageEntranceMonument) {
      const skillsMonument = window.GTAModels.createVillageEntranceMonument(
        'TECH & FULLSTACK SKILLS VILLAGE',
        'PYTHON, DJANGO, REACT, MYSQL & FIGMA MATRIX',
        '#818cf8',
        0x818cf8
      );
      skillsMonument.position.set(-90, 0, -90);
      this.scene.add(skillsMonument);
    }

    // 3. CORPORATE INDUSTRY EXPERIENCE TECH PARK (Cognilearn & Softroniics)
    if (window.GTAModels && window.GTAModels.createVillageEntranceMonument) {
      const expMonument = window.GTAModels.createVillageEntranceMonument(
        'CORPORATE EXPERIENCE TECH PARK',
        'COGNILEARN R&D & SOFTRONIICS TECHNOLOGIES',
        '#10b981',
        0x10b981
      );
      expMonument.position.set(210, 0, -80);
      this.scene.add(expMonument);
    }

    // 4. INNOVATION & MAJOR PROJECTS VILLAGE (Collab-Hub & Trendrove)
    if (window.GTAModels && window.GTAModels.createVillageEntranceMonument) {
      const projMonument = window.GTAModels.createVillageEntranceMonument(
        'INNOVATION & PROJECTS VILLAGE',
        'COLLAB-HUB VENTURE PLATFORM & TRENDROVE AI',
        '#f43f5e',
        0xf43f5e
      );
      projMonument.position.set(220, 0, 160);
      this.scene.add(projMonument);
    }

    // 5. HAMNA PROFILE & HERITAGE RESIDENCE VILLAGE (Villa & Beacon)
    if (window.GTAModels && window.GTAModels.createVillageEntranceMonument) {
      const profMonument = window.GTAModels.createVillageEntranceMonument(
        'HAMNA PROFILE & RESIDENCE VILLAGE',
        'FATHIMA HAMNA K // CALICUT, KERALA',
        '#f59e0b',
        0xf59e0b
      );
      profMonument.position.set(-280, 0, -160);
      this.scene.add(profMonument);
    }

    // Photorealistic California Royal Palm Trees along Boulevards & Estates
    if (window.GTAModels && window.GTAModels.createPhotorealisticPalmTree) {
      // Coastal Driveway Palms
      for (let z = -500; z <= 500; z += 120) {
        if (!this.isOnRoad(-440, z)) {
          const palmL = window.GTAModels.createPhotorealisticPalmTree(28);
          palmL.position.set(-440, 0, z);
          this.scene.add(palmL);
        }

        if (!this.isOnRoad(-540, z)) {
          const palmR = window.GTAModels.createPhotorealisticPalmTree(30);
          palmR.position.set(-540, 0, z);
          this.scene.add(palmR);
        }
      }

      // Hamna Residence Private Driveway Palms
      [-200, -250, -300].forEach(pz => {
        if (!this.isOnRoad(-235, pz)) {
          const palm = window.GTAModels.createPhotorealisticPalmTree(28);
          palm.position.set(-235, 0, pz);
          this.scene.add(palm);
        }
      });

      // Experience Tech Park Corporate Palms
      [-120, -180, -240].forEach(pz => {
        if (!this.isOnRoad(130, pz)) {
          const palm = window.GTAModels.createPhotorealisticPalmTree(26);
          palm.position.set(130, 0, pz);
          this.scene.add(palm);
        }
      });

      // Innovation Projects Marina Palms
      [190, 250, 310].forEach(pz => {
        if (!this.isOnRoad(140, pz)) {
          const palm = window.GTAModels.createPhotorealisticPalmTree(26);
          palm.position.set(140, 0, pz);
          this.scene.add(palm);
        }
      });
    }
  }

  buildOverpassBridge(x, y, z) {
    const bridgeGeo = new THREE.BoxGeometry(160, 6, 20);
    const bridgeMat = new THREE.MeshLambertMaterial({ color: 0x0284c7, transparent: true, opacity: 0.8 });
    const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridge.position.set(x, y, z);
    bridge.castShadow = true;
    this.scene.add(bridge);
  }

  // Central Park with Lush Lagoon & 3D Cascading Waterfall (Located in West Parklands, strictly clear of roads)
  buildCentralParkAndWaterfall() {
    const parkGroup = new THREE.Group();
    const centerX = -360;
    const centerZ = 125;

    // 1. Emerald Lagoon / Lake (Glistening reflective water shader)
    const lakeGeo = new THREE.CylinderGeometry(75, 82, 2.5, 36);
    const lakeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.85,
      roughness: 0.12,
      transparent: true,
      opacity: 0.88
    });
    const lake = new THREE.Mesh(lakeGeo, lakeMat);
    lake.position.set(centerX, 1, centerZ);
    lake.receiveShadow = true;
    parkGroup.add(lake);

    // Lake Grassy Rim
    const rimGeo = new THREE.RingGeometry(74, 94, 36);
    const lawnTex = window.GTATextures ? window.GTATextures.createLushGrass() : null;
    const rimMat = new THREE.MeshStandardMaterial({ map: lawnTex, color: 0x15803d, roughness: 0.9 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = -Math.PI / 2;
    rim.position.set(centerX, 1.05, centerZ);
    rim.receiveShadow = true;
    parkGroup.add(rim);

    // 2. Multi-Tier Rocky Slate Waterfall Cliffs Textured with Real Nature Asset
    const rockTex = window.GTATextures ? window.GTATextures.getRealAssetTexture('realmNature', 2, 2) : null;
    const rockMat = new THREE.MeshStandardMaterial({
      map: rockTex,
      color: 0x475569,
      roughness: 0.92,
      metalness: 0.08
    });

    // Tier 1: Main High Cliff
    const cliffHigh = new THREE.Mesh(new THREE.BoxGeometry(82, 58, 38), rockMat);
    cliffHigh.position.set(centerX, 29, centerZ - 55);
    cliffHigh.castShadow = true;
    cliffHigh.receiveShadow = true;
    parkGroup.add(cliffHigh);

    // Tier 2: Mid-Height Cascading Shelf
    const cliffMid = new THREE.Mesh(new THREE.BoxGeometry(64, 32, 26), rockMat);
    cliffMid.position.set(centerX, 16, centerZ - 36);
    cliffMid.castShadow = true;
    cliffMid.receiveShadow = true;
    parkGroup.add(cliffMid);

    // Tier 3: Pool Spillway Boulders
    const cliffLow = new THREE.Mesh(new THREE.BoxGeometry(48, 14, 18), rockMat);
    cliffLow.position.set(centerX, 7, centerZ - 24);
    cliffLow.castShadow = true;
    cliffLow.receiveShadow = true;
    parkGroup.add(cliffLow);

    // 3. Cascading Water Meshes (Dual-Stage Water Descent with Foam Crest)
    const waterFallMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.88 });
    const waterCascade = new THREE.Mesh(new THREE.PlaneGeometry(38, 48), waterFallMat);
    waterCascade.position.set(centerX, 27, centerZ - 23);
    waterCascade.rotation.x = 0.22; // Natural angled cascade slope
    parkGroup.add(waterCascade);

    const foamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });
    const foam = new THREE.Mesh(new THREE.PlaneGeometry(42, 6), foamMat);
    foam.position.set(centerX, 3.2, centerZ - 14);
    foam.rotation.x = -Math.PI / 2;
    parkGroup.add(foam);

    // 4. Wooden Pedestrian Viewing Footbridge Crossing the Lagoon
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.75 });
    const bridgeDeck = new THREE.Mesh(new THREE.BoxGeometry(64, 1.8, 8), woodMat);
    bridgeDeck.position.set(centerX, 3.5, centerZ + 25);
    bridgeDeck.castShadow = true;
    parkGroup.add(bridgeDeck);

    [-3, 3].forEach(rz => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(64, 2.2, 0.6), woodMat);
      rail.position.set(centerX, 5, centerZ + 25 + rz);
      parkGroup.add(rail);
    });

    // 5. Photorealistic Park Trees (Strictly within park bounds, zero on roads)
    for (let i = 0; i < 28; i++) {
      const tx = centerX - 85 + Math.random() * 170;
      const tz = centerZ - 50 + Math.random() * 110;
      // Guarantee tree is not placed on any road surface
      if (!this.isOnRoad(tx, tz)) {
        this.createParkTree(parkGroup, tx, tz);
      }
    }

    // 6. Authentic GTA 5 Ground Waypoint Marker & Directory Totem
    if (window.GTAModels && window.GTAModels.createGTAWaypoint) {
      const wp = window.GTAModels.createGTAWaypoint({
        x: centerX, y: 0.5, z: centerZ,
        colorHex: '#10b981', colorNum: 0x10b981,
        icon: '🌊', title: 'Central Park Waterfall'
      });
      parkGroup.add(wp);
    }

    if (window.GTAModels && window.GTAModels.createBuildingTotemSign) {
      const totem = window.GTAModels.createBuildingTotemSign(
        'CENTRAL PARK RESERVE',
        'BOTANICAL LAGOON & NATURAL FALLS',
        'PARK',
        'emerald'
      );
      totem.position.set(centerX, 0, centerZ + 45);
      parkGroup.add(totem);
    }

    this.scene.add(parkGroup);
  }

  createParkTree(parent, x, z) {
    if (this.isOnRoad(x, z)) return; // Strict safety check
    if (window.GTAModels) {
      const tree = window.GTAModels.createLushTree(22 + Math.random() * 8, 0x15803d);
      tree.position.set(x, 0, z);
      parent.add(tree);
    } else {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 20, 8), new THREE.MeshStandardMaterial({ color: 0x78350f }));
      trunk.position.set(x, 10, z);
      parent.add(trunk);
    }
  }

  // Majestic 3D Rocky Mountains along the northern and eastern horizons
  buildMountainRanges() {
    if (!window.GTAModels || !window.GTAModels.createMountainRidge) return;

    // North Mountain Ridge (Mount Chiliad backdrop behind KTU Campus)
    const northRidge = window.GTAModels.createMountainRidge(3800, 1100, 520, 9);
    northRidge.position.set(0, 0, -1700);
    this.scene.add(northRidge);

    // East Mountain Horizon Ridge (Behind Spaceport & Tech Park)
    const eastRidge = window.GTAModels.createMountainRidge(3200, 950, 440, 7);
    eastRidge.position.set(1350, 0, 0);
    eastRidge.rotation.y = -Math.PI / 2;
    this.scene.add(eastRidge);
  }

  // Street Nameboards & Directional Fingerposts across Intersections
  buildRoadsideDirectionalSignboards() {
    if (!window.GTAModels) return;

    // 1. Overhead Gantry 1 (Main Highway North Entrance, z = -140)
    if (window.GTAModels.createHighwayDirectionGantry) {
      const gantryNorth = window.GTAModels.createHighwayDirectionGantry(
        'I-95 INTERSTATE // ACADEMIC & EXPERIENCE CORRIDOR',
        '⬅ EDUCATION VILLAGE (KTU/CALICUT) 200m',
        '⬆ MT. CHILIAD RIDGE & DOWNTOWN 400m',
        '➡ EXPERIENCE TECH PARK (COGNILEARN) 180m',
        92
      );
      gantryNorth.position.set(0, 0, -140);
      this.scene.add(gantryNorth);

      // Overhead Gantry 2 (Main Highway South Entrance, z = 140)
      const gantrySouth = window.GTAModels.createHighwayDirectionGantry(
        'I-95 INTERSTATE // INNOVATION & SKILLS JUNCTION',
        '⬅ CENTRAL PARK WATERFALL & LAGOON 120m',
        '⬆ PACIFIC BLUFFS & HAMNA RESIDENCE 280m',
        '➡ PROJECTS VILLAGE (COLLAB-HUB/TRENDROVE) 220m',
        92
      );
      gantrySouth.position.set(0, 0, 140);
      this.scene.add(gantrySouth);
    }

    // Roadside Street Direction Fingerposts at Sidewalk Corners
    if (window.GTAModels.createStreetDirectionSign) {
      // Corner 1: Highway & Avenue 2 North (East Sidewalk, x = 68, z = -140)
      const sign1 = window.GTAModels.createStreetDirectionSign([
        { dir: '⬅', dest: 'EDUCATION VILLAGE', dist: '200m', color: '#0284c7' },
        { dir: '⬆', dest: 'EXPERIENCE TECH PARK', dist: '180m', color: '#059669' },
        { dir: '➡', dest: 'SKILLS MATRIX', dist: '120m', color: '#7c3aed' }
      ]);
      sign1.position.set(68, 0, -140);
      sign1.rotation.y = -Math.PI / 2;
      this.scene.add(sign1);

      // Corner 2: Highway & Avenue 2 North (West Sidewalk, x = -68, z = -140)
      const sign2 = window.GTAModels.createStreetDirectionSign([
        { dir: '⬅', dest: 'HAMNA PROFILE & VILLA', dist: '140m', color: '#f59e0b' },
        { dir: '⬆', dest: 'KTU CAMPUS GATES', dist: '240m', color: '#0284c7' },
        { dir: '➡', dest: 'HIGHWAY NORTHBOUND', dist: '100m', color: '#334155' }
      ]);
      sign2.position.set(-68, 0, -140);
      sign2.rotation.y = Math.PI / 2;
      this.scene.add(sign2);

      // Corner 3: Highway & Avenue 1 Center (East Sidewalk, x = 68, z = 0)
      const sign3 = window.GTAModels.createStreetDirectionSign([
        { dir: '⬅', dest: 'CENTRAL WATERFALL', dist: '120m', color: '#0284c7' },
        { dir: '⬆', dest: 'SPACEPORT & ROCKET', dist: '480m', color: '#dc2626' },
        { dir: '➡', dest: 'PROJECTS VILLAGE', dist: '220m', color: '#7c3aed' }
      ]);
      sign3.position.set(68, 0, 0);
      sign3.rotation.y = -Math.PI / 2;
      this.scene.add(sign3);

      // Corner 4: Highway & Avenue 1 Center (West Sidewalk, x = -68, z = 0)
      const sign4 = window.GTAModels.createStreetDirectionSign([
        { dir: '⬅', dest: 'PACIFIC BEACON & CV', dist: '340m', color: '#f59e0b' },
        { dir: '⬆', dest: 'WATERFALL BOTANICAL', dist: '100m', color: '#059669' },
        { dir: '➡', dest: 'HIGHWAY INTERSTATE', dist: '80m', color: '#334155' }
      ]);
      sign4.position.set(-68, 0, 0);
      sign4.rotation.y = Math.PI / 2;
      this.scene.add(sign4);

      // Corner 5: Highway & Avenue 3 South (East Sidewalk, x = 68, z = 140)
      const sign5 = window.GTAModels.createStreetDirectionSign([
        { dir: '⬅', dest: 'SKILLS MATRIX', dist: '160m', color: '#7c3aed' },
        { dir: '⬆', dest: 'TRENDROVE AI STUDIO', dist: '200m', color: '#db2777' },
        { dir: '➡', dest: 'COLLAB-HUB VENTURES', dist: '180m', color: '#2563eb' }
      ]);
      sign5.position.set(68, 0, 140);
      sign5.rotation.y = -Math.PI / 2;
      this.scene.add(sign5);

      // Corner 6: Highway & Avenue 3 South (West Sidewalk, x = -68, z = 140)
      const sign6 = window.GTAModels.createStreetDirectionSign([
        { dir: '⬅', dest: 'WATERFALL FOOTBRIDGE', dist: '80m', color: '#0284c7' },
        { dir: '⬆', dest: 'LAGOON PROMENADE', dist: '60m', color: '#059669' },
        { dir: '➡', dest: 'HIGHWAY SOUTHBOUND', dist: '90m', color: '#334155' }
      ]);
      sign6.position.set(-68, 0, 140);
      sign6.rotation.y = Math.PI / 2;
      this.scene.add(sign6);

      // Corner 7: Academic Parkway Entrance (x = -42, z = -340)
      const sign7 = window.GTAModels.createStreetDirectionSign([
        { dir: '⬆', dest: 'APJ KTU MCA HALL', dist: '120m', color: '#0284c7' },
        { dir: '➡', dest: 'CALICUT BCA HONORS', dist: '90m', color: '#059669' }
      ]);
      sign7.position.set(-42, 0, -340);
      this.scene.add(sign7);
    }
  }

  // 15. Los Santos Customs Auto Repair Workshop & Recovery Fleet
  buildAutoRepairWorkshop() {
    if (!window.GTAModels || !window.GTAModels.createAutoRepairWorkshop) return;
    const workshopGroup = window.GTAModels.createAutoRepairWorkshop();
    workshopGroup.position.set(-190, 0, -140);
    this.scene.add(workshopGroup);

    this.workshopSpawnPos = { x: -160, z: -115 };

    // Flatbed Recovery Tow Truck stationed in bay apron
    if (window.GTAModels.createTowTruckModel) {
      this.towTruck = window.GTAModels.createTowTruckModel();
      this.towTruck.position.set(this.workshopSpawnPos.x, 0, this.workshopSpawnPos.z);
      this.towTruck.rotation.y = -Math.PI / 2;
      this.scene.add(this.towTruck);
    }
  }

  // 16. Ron Oil 24/7 Service Station & Convenience Mart
  buildGasStation() {
    if (!window.GTAModels || !window.GTAModels.createRonOilGasStation) return;
    const gasGroup = window.GTAModels.createRonOilGasStation();
    gasGroup.position.set(140, 0, 90);
    this.scene.add(gasGroup);
  }

  // 17. Street Infrastructure: Modern Bus Shelters, Manholes, Storm Drains & Changing Signals
  buildStreetInfrastructure() {
    // Bus Shelters along Avenues
    if (window.GTAModels && window.GTAModels.createBusStopShelter) {
      const bus1 = window.GTAModels.createBusStopShelter();
      bus1.position.set(-78, 0, -35);
      bus1.rotation.y = Math.PI / 2;
      this.scene.add(bus1);

      const bus2 = window.GTAModels.createBusStopShelter();
      bus2.position.set(82, 0, -215);
      bus2.rotation.y = -Math.PI / 2;
      this.scene.add(bus2);
    }

    // Cast-iron waffle manhole covers & storm drains along highway shoulders
    const manholeTex = window.GTATextures ? window.GTATextures.createManholeTexture() : null;
    if (manholeTex) {
      const mhMat = new THREE.MeshStandardMaterial({
        map: manholeTex,
        roughness: 0.8,
        metalness: 0.6
      });
      const mhGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.2, 16);

      [-600, -300, 0, 300, 600].forEach((z, idx) => {
        const mh = new THREE.Mesh(mhGeo, mhMat);
        mh.position.set(idx % 2 === 0 ? -52 : 52, 0.46, z);
        this.scene.add(mh);
      });
    }
  }

  // 1. Hamna VIP Tower (Modern High-Rise Glass Skyscraper)
  buildHamnaVIPTower() {
    const group = new THREE.Group();

    // High-Rise Glass Skyscraper with Real City Skyline Facade Texture
    if (window.GTAModels) {
      const tower = window.GTAModels.createSkyscraper(95, 270, 95, 'azure');
      // Apply real city skyline asset texture to curtain walls
      const skylineTex = window.GTATextures ? window.GTATextures.getRealAssetTexture('citySkyline', 1, 3) : null;
      if (skylineTex) {
        tower.traverse(child => {
          if (child.isMesh && child.material && child.geometry.type === 'BoxGeometry') {
            child.material.map = skylineTex;
            child.material.needsUpdate = true;
          }
        });
      }
      group.add(tower);
    }

    // Gold Crown Penthouse Terrace with Panoramic Executive Suite Glass
    const phGeo = new THREE.BoxGeometry(64, 32, 64);
    const execSuiteTex = window.GTATextures ? window.GTATextures.getRealAssetTexture('executiveSuite', 1, 1) : null;
    const phMat = new THREE.MeshStandardMaterial({
      map: execSuiteTex,
      color: 0xf59e0b,
      metalness: 0.7,
      roughness: 0.25
    });
    const penthouse = new THREE.Mesh(phGeo, phMat);
    penthouse.position.set(0, 282, 0);
    penthouse.castShadow = true;
    group.add(penthouse);

    // Giant Facade Billboard Display on Tower using Real Photographic Asset (supercar_street.jpg)
    if (window.GTAModels && window.GTAModels.createRealAssetBillboard) {
      const facadeBillboard = window.GTAModels.createRealAssetBillboard(60, 32, 'supercarStreet', 'GROTTI TURISMO R', 'LEGENDARY MOTORSPORT');
      facadeBillboard.position.set(0, 50, 52);
      group.add(facadeBillboard);
    }

    // Security Gate Barrier at Entrance
    const gateGeo = new THREE.BoxGeometry(40, 5, 2);
    const gateMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.5, roughness: 0.3 });
    const gate = new THREE.Mesh(gateGeo, gateMat);
    gate.position.set(0, 2.5, 60);
    group.add(gate);

    // Security Guard NPCs at the Gate
    this.createSecurityGuardNPC(group, -15, 60);
    this.createSecurityGuardNPC(group, 15, 60);

    // Intruder NPC Pacing Outside Barrier
    this.intruderNPC = this.createPedestrianMesh(0x1e293b, 0xef4444);
    this.intruderNPC.position.set(0, 0, 80);
    group.add(this.intruderNPC);

    // GTA 5 Ground Waypoints & Architectural Totem
    if (window.GTAModels && window.GTAModels.createGTAWaypoint) {
      const wpTower = window.GTAModels.createGTAWaypoint({
        x: 0, y: 0.5, z: 10,
        colorHex: '#f59e0b', colorNum: 0xf59e0b,
        icon: '🏢', title: 'Hamna VIP Tower'
      });
      group.add(wpTower);

      const wpSecurity = window.GTAModels.createGTAWaypoint({
        x: 0, y: 0.5, z: 75,
        colorHex: '#ef4444', colorNum: 0xef4444,
        icon: '🚨', title: 'Security Checkpoint'
      });
      group.add(wpSecurity);
    }

    if (window.GTAModels && window.GTAModels.createBuildingTotemSign) {
      const totem = window.GTAModels.createBuildingTotemSign(
        'HAMNA EXECUTIVE TOWER',
        'CHIEF ARCHITECT PENTHOUSE // LEVEL 88',
        'VIP SUITE',
        'gold'
      );
      totem.position.set(-25, 0, 55);
      group.add(totem);
    }

    group.position.set(180, 0, -125);
    this.scene.add(group);
  }

  // Distant Downtown Metropolis High-Rise Skyline (Surrounding City Realism)
  buildDowntownMetropolisSkyline() {
    if (!window.GTAModels) return;
    const skylineGroup = new THREE.Group();

    const towers = [
      { x: 380, z: -350, w: 75, h: 320, d: 75, tint: 'azure' },
      { x: -380, z: -360, w: 80, h: 250, d: 80, tint: 'gold' },
      { x: -420, z: 380, w: 85, h: 290, d: 75, tint: 'azure' },
      { x: 360, z: 360, w: 75, h: 220, d: 75, tint: 'azure' },
      { x: 260, z: -360, w: 70, h: 200, d: 70, tint: 'gold' },
      { x: -400, z: -125, w: 80, h: 280, d: 80, tint: 'azure' },
      { x: 530, z: 125, w: 75, h: 210, d: 75, tint: 'azure' }
    ];

    towers.forEach(t => {
      const skyscraper = window.GTAModels.createSkyscraper(t.w, t.h, t.d, t.tint);
      skyscraper.position.set(t.x, 0, t.z);
      skylineGroup.add(skyscraper);
    });

    this.scene.add(skylineGroup);
  }

  createSecurityGuardNPC(parent, x, z) {
    let guard;
    if (window.GTAModelLoader) {
      guard = window.GTAModelLoader.createRealCharacter(true);
    } else if (window.GTARealisticEntities) {
      guard = window.GTARealisticEntities.createRealisticHuman({ type: 'police' });
    } else {
      guard = new THREE.Group();
    }
    guard.position.set(x, 0, z);
    parent.add(guard);
    return guard;
  }

  createPedestrianMesh(pantsColor, shirtColor, isStudent = false) {
    const ped = new THREE.Group();

    const torso = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 5.5, 2.4),
      new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.65 })
    );
    torso.position.y = 8.5;
    torso.castShadow = true;
    ped.add(torso);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(1.6, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xf5d0b5, roughness: 0.55 })
    );
    head.position.y = 12.8;
    head.castShadow = true;
    ped.add(head);

    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(1.7, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 })
    );
    hair.position.set(0, 13.2, -0.2);
    ped.add(hair);

    const armGeo = new THREE.BoxGeometry(1, 4.5, 1);
    const armMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.65 });
    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-2.4, 8, 0);
    ped.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(2.4, 8, 0);
    ped.add(rightArm);

    const legGeo = new THREE.BoxGeometry(1.3, 6, 1.4);
    const legMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.7 });
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-1, 3, 0);
    ped.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(1, 3, 0);
    ped.add(rightLeg);

    if (isStudent) {
      const pack = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 3.8, 1.8),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6 })
      );
      pack.position.set(0, 8.5, -1.8);
      ped.add(pack);
    }

    ped.userData = { leftLeg, rightLeg, leftArm, rightArm };
    return ped;
  }

  // 2. Hamna's Luxury Villa (Rockford Hills Architectural Villa)
  buildHomeVilla() {
    const group = new THREE.Group();

    const stuccoMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.05 });
    const woodDeckMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.65 });
    const execTex = window.GTATextures ? window.GTATextures.getRealAssetTexture('executiveSuite', 1, 1) : null;
    const glassMat = new THREE.MeshPhysicalMaterial({
      map: execTex,
      color: 0x0284c7,
      metalness: 0.6,
      roughness: 0.15,
      transparent: true,
      opacity: 0.92
    });
    const poolMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.8, roughness: 0.1, transparent: true, opacity: 0.9 });

    // Elevated Terrace Base
    const terraceBase = new THREE.Mesh(
      new THREE.BoxGeometry(90, 4, 70),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 })
    );
    terraceBase.position.set(0, 2, 20);
    group.add(terraceBase);

    // Main 2-Story Modern Villa Structure
    const mainWing = new THREE.Mesh(new THREE.BoxGeometry(65, 26, 45), stuccoMat);
    mainWing.position.set(0, 17, 0);
    mainWing.castShadow = true;
    group.add(mainWing);

    // Cantilever Second-Story Master Suite & Balcony
    const upperWing = new THREE.Mesh(new THREE.BoxGeometry(50, 16, 40), stuccoMat);
    upperWing.position.set(10, 34, 4);
    upperWing.castShadow = true;
    group.add(upperWing);

    // Panoramic Tinted Glass Front with Real Photographic Executive Suite Interior
    const glassFacade = new THREE.Mesh(new THREE.BoxGeometry(45, 22, 1.5), glassMat);
    glassFacade.position.set(0, 17, 23);
    group.add(glassFacade);

    // Hardwood Pool Sun Deck
    const deck = new THREE.Mesh(new THREE.BoxGeometry(75, 1.2, 35), woodDeckMat);
    deck.position.set(0, 4.6, 42);
    deck.receiveShadow = true;
    group.add(deck);

    // Luxury Infinity Swimming Pool
    const pool = new THREE.Mesh(new THREE.BoxGeometry(48, 1.8, 22), poolMat);
    pool.position.set(0, 4.9, 44);
    group.add(pool);

    // Modern Cantilever Overhang Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(68, 2, 48), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 }));
    roof.position.set(10, 43, 4);
    roof.castShadow = true;
    group.add(roof);

    // Rockford Hills Palm Trees along Villa Entrance
    [-35, 35].forEach(px => {
      if (window.GTAModels) {
        const tree = window.GTAModels.createLushTree(26, 0x15803d);
        tree.position.set(px, 4, 10);
        group.add(tree);
      }
    });

    // GTA 5 Ground Waypoint & Architectural Gate Totem
    if (window.GTAModels && window.GTAModels.createGTAWaypoint) {
      const wp = window.GTAModels.createGTAWaypoint({
        x: 0, y: 4.8, z: 25,
        colorHex: '#38bdf8', colorNum: 0x38bdf8,
        icon: '🏠', title: "Hamna's Residence"
      });
      group.add(wp);
    }

    if (window.GTAModels && window.GTAModels.createBuildingTotemSign) {
      const totem = window.GTAModels.createBuildingTotemSign(
        'PRIVATE RESIDENCE',
        'ROCKFORD HILLS ESTATE // FATHIMA HAMNA K',
        'RESIDENCE',
        'azure', 12, 18
      );
      totem.position.set(25, 4, 45);
      group.add(totem);
    }

    group.position.set(-320, 0, -125);
    this.scene.add(group);
  }

  // 3. Collab-Hub Silicon Pavilion (Glass & Steel Tech Hub)
  buildCollabHubPavilion() {
    const group = new THREE.Group();
    if (window.GTAModels) {
      const hub = window.GTAModels.createSkyscraper(85, 75, 70, 'azure');
      const studioTex = window.GTATextures ? window.GTATextures.getRealAssetTexture('realmStudio', 2, 2) : null;
      if (studioTex) {
        hub.traverse(child => {
          if (child.isMesh && child.material && child.geometry.type === 'BoxGeometry') {
            child.material.map = studioTex;
            child.material.needsUpdate = true;
          }
        });
      }
      group.add(hub);
    }

    // Giant Illuminated Facade Billboard with Real Capstone Asset (collabhub.jpg)
    if (window.GTAModels && window.GTAModels.createRealAssetBillboard) {
      const billboard = window.GTAModels.createRealAssetBillboard(56, 32, 'collabhub', 'COLLAB-HUB INC', 'VENTURE AI');
      billboard.position.set(0, 10, 38);
      group.add(billboard);
    }

    // GTA 5 Ground Waypoint & Directory Totem
    if (window.GTAModels && window.GTAModels.createGTAWaypoint) {
      const wp = window.GTAModels.createGTAWaypoint({
        x: 0, y: 0.5, z: 45,
        colorHex: '#0284c7', colorNum: 0x0284c7,
        icon: '🚀', title: 'Collab-Hub Silicon Pavilion'
      });
      group.add(wp);
    }

    if (window.GTAModels && window.GTAModels.createBuildingTotemSign) {
      const totem = window.GTAModels.createBuildingTotemSign(
        'COLLAB-HUB INC',
        'STARTUP & INVESTOR VENTURE MATCHMAKING PLATFORM',
        'TECH HQ',
        'azure'
      );
      totem.position.set(25, 0, 45);
      group.add(totem);
    }

    group.position.set(340, 0, 125);
    this.scene.add(group);
  }

  // 4. Trendrove AI Studio (Rose-Gold Fashion AI Lab)
  buildTrendroveStudio() {
    const group = new THREE.Group();
    if (window.GTAModels) {
      const studio = window.GTAModels.createSkyscraper(80, 70, 65, 'gold');
      const fashionTex = window.GTATextures ? window.GTATextures.getRealAssetTexture('realmFashion', 2, 2) : null;
      if (fashionTex) {
        studio.traverse(child => {
          if (child.isMesh && child.material && child.geometry.type === 'BoxGeometry') {
            child.material.map = fashionTex;
            child.material.needsUpdate = true;
          }
        });
      }
      group.add(studio);
    }

    // Giant Illuminated Facade Billboard with Real Capstone Asset (trendrove.jpg)
    if (window.GTAModels && window.GTAModels.createRealAssetBillboard) {
      const billboard = window.GTAModels.createRealAssetBillboard(56, 32, 'trendrove', 'TRENDROVE AI LAB', 'COMPUTER VISION');
      billboard.position.set(0, 10, 35);
      group.add(billboard);
    }

    // GTA 5 Ground Waypoint & Directory Totem
    if (window.GTAModels && window.GTAModels.createGTAWaypoint) {
      const wp = window.GTAModels.createGTAWaypoint({
        x: 0, y: 0.5, z: 42,
        colorHex: '#f43f5e', colorNum: 0xf43f5e,
        icon: '👗', title: 'Trendrove AI Fashion Studio'
      });
      group.add(wp);
    }

    if (window.GTAModels && window.GTAModels.createBuildingTotemSign) {
      const totem = window.GTAModels.createBuildingTotemSign(
        'TRENDROVE AI LAB',
        'COMPUTER VISION SKIN UNDERTONE MATCHING PLATFORM',
        'AI LAB',
        'rose'
      );
      totem.position.set(-25, 0, 42);
      group.add(totem);
    }

    group.position.set(300, 0, 380);
    this.scene.add(group);
  }

  // Experience Building 1: Cognilearn R&D Software Tech Park
  buildCognilearnTechPark() {
    const group = new THREE.Group();

    // High-Rise Corporate R&D Tower (Modern Architecture with Glass & Carbon Trim)
    if (window.GTAModels) {
      const tower = window.GTAModels.createSkyscraper(75, 145, 75, 'azure');
      const skylineTex = window.GTATextures ? window.GTATextures.getRealAssetTexture('citySkyline', 1, 2) : null;
      if (skylineTex) {
        tower.traverse(child => {
          if (child.isMesh && child.material && child.geometry.type === 'BoxGeometry') {
            child.material.map = skylineTex;
            child.material.needsUpdate = true;
          }
        });
      }
      group.add(tower);
    }

    // Skybridge connecting R&D Wing
    const bridgeGeo = new THREE.BoxGeometry(35, 12, 18);
    const bridgeMat = new THREE.MeshPhysicalMaterial({ color: 0x0284c7, transparent: true, opacity: 0.85, metalness: 0.8 });
    const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridge.position.set(-45, 75, 0);
    group.add(bridge);

    const wing = new THREE.Mesh(new THREE.BoxGeometry(45, 90, 55), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 }));
    wing.position.set(-75, 45, 0);
    wing.castShadow = true;
    group.add(wing);

    // Illuminated R&D Lab Entrance Canopy
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(48, 2.5, 20), new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9 }));
    canopy.position.set(0, 8, 45);
    group.add(canopy);

    // GTA 5 Ground Waypoint & Architectural Directory Totem
    if (window.GTAModels && window.GTAModels.createGTAWaypoint) {
      const wp = window.GTAModels.createGTAWaypoint({
        x: 0, y: 0.5, z: 45,
        colorHex: '#0284c7', colorNum: 0x0284c7,
        icon: '💼', title: 'Cognilearn R&D Tech Park'
      });
      group.add(wp);
    }

    if (window.GTAModels && window.GTAModels.createBuildingTotemSign) {
      const totem = window.GTAModels.createBuildingTotemSign(
        'COGNILEARN R&D LABS',
        'DEVELOPMENT INTERN // REAL-WORLD SOFTWARE & R&D INITIATIVES',
        'EXPERIENCE',
        'azure'
      );
      totem.position.set(30, 0, 48);
      group.add(totem);
    }

    group.position.set(320, 0, -125);
    this.scene.add(group);
  }

  // Experience Building 2: Softroniics Fullstack Hub (Calicut, India)
  buildSoftroniicsHub() {
    const group = new THREE.Group();

    // Multi-Story Glass & Steel Software Engineering Complex
    if (window.GTAModels) {
      const complex = window.GTAModels.createSkyscraper(70, 95, 70, 'emerald');
      const townTex = window.GTATextures ? window.GTATextures.getRealAssetTexture('realmTown', 2, 2) : null;
      if (townTex) {
        complex.traverse(child => {
          if (child.isMesh && child.material && child.geometry.type === 'BoxGeometry') {
            child.material.map = townTex;
            child.material.needsUpdate = true;
          }
        });
      }
      group.add(complex);
    }

    // Modern Atrium Lobby Wing with Emerald Glow
    const lobbyGeo = new THREE.BoxGeometry(50, 22, 35);
    const lobbyMat = new THREE.MeshPhysicalMaterial({ color: 0x10b981, transparent: true, opacity: 0.82, metalness: 0.7 });
    const lobby = new THREE.Mesh(lobbyGeo, lobbyMat);
    lobby.position.set(0, 11, 40);
    group.add(lobby);

    // Landscaped Courtyard with Palm Trees
    [-30, 30].forEach(tx => {
      if (window.GTAModels) {
        const tree = window.GTAModels.createLushTree(22, 0x10b981);
        tree.position.set(tx, 0, 45);
        group.add(tree);
      }
    });

    // GTA 5 Ground Waypoint & Architectural Directory Totem
    if (window.GTAModels && window.GTAModels.createGTAWaypoint) {
      const wp = window.GTAModels.createGTAWaypoint({
        x: 0, y: 0.5, z: 45,
        colorHex: '#10b981', colorNum: 0x10b981,
        icon: '💻', title: 'Softroniics Fullstack Hub'
      });
      group.add(wp);
    }

    if (window.GTAModels && window.GTAModels.createBuildingTotemSign) {
      const totem = window.GTAModels.createBuildingTotemSign(
        'SOFTRONIICS SOFTWARE HUB',
        'PYTHON FULLSTACK INTERN // CALICUT, INDIA // DJANGO & REACT',
        'EXPERIENCE',
        'emerald'
      );
      totem.position.set(-28, 0, 48);
      group.add(totem);
    }

    group.position.set(240, 0, 120);
    this.scene.add(group);
  }

  // Education Building 2: University of Calicut - BCA Honors Hall
  buildCalicutUniversityHall() {
    const group = new THREE.Group();

    // Historic Collegiate Stone & Brick Academic Library
    const campusTex = window.GTATextures ? window.GTATextures.getRealAssetTexture('universityCampus', 2, 2) : null;
    const stoneMat = new THREE.MeshStandardMaterial({
      map: campusTex,
      color: 0xe2e8f0,
      roughness: 0.85,
      metalness: 0.05
    });

    const mainHall = new THREE.Mesh(new THREE.BoxGeometry(85, 48, 60), stoneMat);
    mainHall.position.set(0, 24, 0);
    mainHall.castShadow = true;
    group.add(mainHall);

    // Arched Entrance Portico with Stone Pillars
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
    const archRoof = new THREE.Mesh(new THREE.BoxGeometry(45, 4, 18), trimMat);
    archRoof.position.set(0, 24, 34);
    group.add(archRoof);

    [-18, -6, 6, 18].forEach(px => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 22, 12), trimMat);
      col.position.set(px, 11, 34);
      col.castShadow = true;
      group.add(col);
    });

    // Copper Verdigris Spire & Academic Crest
    const spire = new THREE.Mesh(new THREE.ConeGeometry(12, 28, 4), new THREE.MeshLambertMaterial({ color: 0x0f766e }));
    spire.position.set(0, 62, 0);
    spire.rotation.y = Math.PI / 4;
    group.add(spire);

    // GTA 5 Ground Waypoint & University Directory Totem
    if (window.GTAModels && window.GTAModels.createGTAWaypoint) {
      const wp = window.GTAModels.createGTAWaypoint({
        x: 0, y: 0.5, z: 42,
        colorHex: '#10b981', colorNum: 0x10b981,
        icon: '📜', title: 'University of Calicut BCA Hall'
      });
      group.add(wp);
    }

    if (window.GTAModels && window.GTAModels.createBuildingTotemSign) {
      const totem = window.GTAModels.createBuildingTotemSign(
        'UNIVERSITY OF CALICUT',
        'BACHELOR OF COMPUTER APPLICATION (BCA) // FIRST CLASS HONORS',
        'EDUCATION',
        'emerald'
      );
      totem.position.set(30, 0, 42);
      group.add(totem);
    }

    group.position.set(-140, 0, -360);
    this.scene.add(group);
  }

  // Skills Building: Core Fullstack Technology & Skills Matrix Pavilion
  buildSkillsPavilion() {
    const group = new THREE.Group();

    // Futuristic Hexagonal Glass & Steel Pavilion
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.35, metalness: 0.85 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xa855f7, transparent: true, opacity: 0.75, metalness: 0.6 });

    const basePlatform = new THREE.Mesh(new THREE.CylinderGeometry(40, 44, 3, 6), frameMat);
    basePlatform.position.y = 1.5;
    basePlatform.receiveShadow = true;
    group.add(basePlatform);

    const atrium = new THREE.Mesh(new THREE.CylinderGeometry(34, 38, 28, 6), glassMat);
    atrium.position.y = 17;
    group.add(atrium);

    const roofCap = new THREE.Mesh(new THREE.ConeGeometry(36, 12, 6), frameMat);
    roofCap.position.y = 37;
    group.add(roofCap);

    // 4 Glowing Core Tech Columns inside the Pavilion
    const techCores = [
      { name: 'FRONTEND', color: 0x38bdf8, x: -14, z: -14 },
      { name: 'BACKEND', color: 0xf59e0b, x: 14, z: -14 },
      { name: 'DATABASE', color: 0x10b981, x: -14, z: 14 },
      { name: 'TOOLS & UI', color: 0xa855f7, x: 14, z: 14 }
    ];
    techCores.forEach(tc => {
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(2.5, 2.5, 24, 12),
        new THREE.MeshLambertMaterial({ color: tc.color, emissive: tc.color, emissiveIntensity: 0.4 })
      );
      pillar.position.set(tc.x, 14, tc.z);
      group.add(pillar);
    });

    // GTA 5 Ground Waypoint & Skills Directory Totem
    if (window.GTAModels && window.GTAModels.createGTAWaypoint) {
      const wp = window.GTAModels.createGTAWaypoint({
        x: 0, y: 0.5, z: 38,
        colorHex: '#a855f7', colorNum: 0xa855f7,
        icon: '⚡', title: 'Fullstack Skills Matrix Pavilion'
      });
      group.add(wp);
    }

    if (window.GTAModels && window.GTAModels.createBuildingTotemSign) {
      const totem = window.GTAModels.createBuildingTotemSign(
        'FULLSTACK SKILLS MATRIX',
        'PYTHON, DJANGO, REACT, MYSQL, GIT & FIGMA',
        'SKILLS',
        'purple'
      );
      totem.position.set(-28, 0, 38);
      group.add(totem);
    }

    group.position.set(-120, 0, -120);
    this.scene.add(group);
  }

  // 5. APJ KTU MCA University Hall & Grand American Collegiate Campus
  buildKtuUniversity() {
    const group = new THREE.Group();

    // 1. Sprawling Collegiate Quad Lawn with Turf Texture
    const lawnGeo = new THREE.PlaneGeometry(440, 360);
    const lawnTex = window.GTATextures ? window.GTATextures.createLushGrass() : null;
    if (lawnTex) lawnTex.repeat.set(12, 10);
    const lawnMat = new THREE.MeshStandardMaterial({
      map: lawnTex,
      roughness: 0.88,
      metalness: 0.05
    });
    const lawn = new THREE.Mesh(lawnGeo, lawnMat);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.set(0, 0.4, 0);
    lawn.receiveShadow = true;
    group.add(lawn);

    // Perimeter Stone Curbing
    const curbMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, roughness: 0.7, metalness: 0.1 });
    const curbFront = new THREE.Mesh(new THREE.BoxGeometry(440, 1.2, 3), curbMat);
    curbFront.position.set(0, 0.6, 178);
    group.add(curbFront);

    // 2. Wide Stone Walkways (Flagstone Main Avenue & Crossways with Paver Texture)
    const walkTex = window.GTATextures ? window.GTATextures.createSidewalkPaver() : null;
    if (walkTex) walkTex.repeat.set(1, 10);
    const walkMat = new THREE.MeshStandardMaterial({
      map: walkTex,
      roughness: 0.82,
      metalness: 0.1
    });
    const mainAvenue = new THREE.Mesh(new THREE.PlaneGeometry(30, 320), walkMat);
    mainAvenue.rotation.x = -Math.PI / 2;
    mainAvenue.position.set(0, 0.45, 10);
    mainAvenue.receiveShadow = true;
    group.add(mainAvenue);

    const crosswalkA = new THREE.Mesh(new THREE.PlaneGeometry(420, 22), walkMat);
    crosswalkA.rotation.x = -Math.PI / 2;
    crosswalkA.position.set(0, 0.45, 25);
    crosswalkA.receiveShadow = true;
    group.add(crosswalkA);

    const crosswalkB = new THREE.Mesh(new THREE.PlaneGeometry(380, 18), walkMat);
    crosswalkB.rotation.x = -Math.PI / 2;
    crosswalkB.position.set(0, 0.45, -45);
    crosswalkB.receiveShadow = true;
    group.add(crosswalkB);

    // 3. Grand Classical Entrance Gate (Ivy League Brick & Stone)
    const campusPhotoTex = window.GTATextures ? window.GTATextures.getRealAssetTexture('universityCampus', 2, 2) : null;
    const brickTex = window.GTATextures ? window.GTATextures.createCollegiateBrick() : null;
    if (brickTex) brickTex.repeat.set(1, 4);
    const brickMat = new THREE.MeshStandardMaterial({
      map: campusPhotoTex || brickTex,
      roughness: 0.85,
      metalness: 0.05
    });
    const stoneTrimMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5, metalness: 0.1 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.8 });

    // 4 Grand Gate Pillars
    [-45, -20, 20, 45].forEach(px => {
      const pillar = new THREE.Group();
      const pBody = new THREE.Mesh(new THREE.BoxGeometry(8, 32, 8), brickMat);
      pBody.position.y = 16;
      pBody.castShadow = true;
      pillar.add(pBody);

      // Stone Cap & Finial
      const pCap = new THREE.Mesh(new THREE.BoxGeometry(10, 2.5, 10), stoneTrimMat);
      pCap.position.y = 33;
      pillar.add(pCap);

      const finial = new THREE.Mesh(new THREE.SphereGeometry(2, 12, 12), new THREE.MeshLambertMaterial({ color: 0xf59e0b }));
      finial.position.y = 36;
      pillar.add(finial);

      pillar.position.set(px, 0, 140);
      group.add(pillar);
    });

    // Decorative Wrought-Iron Arch Beam
    const archBeam = new THREE.Mesh(new THREE.BoxGeometry(98, 5, 4), ironMat);
    archBeam.position.set(0, 34, 140);
    group.add(archBeam);

    // Ground Waypoint & Campus Directory Totem at Gate
    if (window.GTAModels && window.GTAModels.createGTAWaypoint) {
      const wpGate = window.GTAModels.createGTAWaypoint({
        x: 0, y: 0.5, z: 140,
        colorHex: '#f59e0b', colorNum: 0xf59e0b,
        icon: '🎓', title: 'University Grand Gates'
      });
      group.add(wpGate);
    }
    if (window.GTAModels && window.GTAModels.createBuildingTotemSign) {
      const totemGate = window.GTAModels.createBuildingTotemSign(
        'APJ KTU COLLEGIATE ALLIANCE',
        'CALIFORNIA STATE TECH // FACULTY OF COMPUTER APPLICATIONS',
        'CAMPUS',
        'gold'
      );
      totemGate.position.set(-35, 0, 150);
      group.add(totemGate);
    }

    // 4. HAMNA'S GIANT 3D EDUCATIONAL FLEX HOARDING (Directly on Front Lawn)
    this.createHamnaEducationBillboard(group, -65, 85);

    // 5. FOUR WALK-THROUGH ACADEMIC EXHIBITION PAVILIONS ALONG PROMENADE
    // Exhibit 1: APJ KTU MCA
    this.createAcademicExhibitionKiosk(
      group, -28, 65,
      "APJ ABDUL KALAM TECHNOLOGICAL UNIVERSITY (KTU)",
      "MASTER OF COMPUTER APPLICATIONS (MCA) // 2026 – PRESENT",
      [
        "• Advanced Distributed Cloud Architecture & Scalability",
        "• Enterprise Database Systems & Advanced Normalization",
        "• High-Performance Python & Django Backend Microservices",
        "• Object-Oriented System Modeling & API Design"
      ],
      0x0284c7, "🎓"
    );

    // Exhibit 2: Calicut BCA
    this.createAcademicExhibitionKiosk(
      group, 28, 25,
      "UNIVERSITY OF CALICUT (FIRST CLASS HONORS)",
      "BACHELOR OF COMPUTER APPLICATIONS (BCA) // 2022 – 2025",
      [
        "• Graduated with First Class Academic Distinction",
        "• Core Computer Programming (Python 3, C++, Java)",
        "• Data Structures, Algorithm Complexity & Optimization",
        "• Web Technology, Responsive UI Layouts & Scripting"
      ],
      0x10b981, "📜"
    );

    // Exhibit 3: Professional Fellowships
    this.createAcademicExhibitionKiosk(
      group, -28, -15,
      "INDUSTRY R&D FELLOWSHIPS & PRACTICUM",
      "COGNILEARN SOLUTIONS & SOFTRONIICS TECHNOLOGIES",
      [
        "• Cognilearn R&D Fellow (08/2026 – Present): Real-world projects",
        "• Softroniics Fullstack Fellow (05/2025 – 06/2026): Python & Django",
        "• Frontend React components, Bootstrap & Figma prototypes",
        "• MySQL relational schema, Git workflows & code reviews"
      ],
      0xf59e0b, "💼"
    );

    // Exhibit 4: Live Capstone Platforms
    this.createAcademicExhibitionKiosk(
      group, 28, -55,
      "VERIFIED PRODUCTION CAPSTONES",
      "COLLAB-HUB & TRENDROVE AI PLATFORMS",
      [
        "• Collab-Hub: Startup-Investor Venture Matchmaking Platform",
        "• Trendrove: Computer Vision AI Skin Undertone Matcher",
        "• Deployed live with responsive fullstack architectures",
        "• Press [E] anywhere to inspect full coursework & source code"
      ],
      0xa855f7, "🚀"
    );

    // 6. Central Campus Quad Features: Water Fountain & American Flagpole
    this.createCollegiateFountain(group, 0, 25);
    this.createAmericanFlagpole(group, 0, 85);

    // 7. Main Collegiate Academic Hall (Ivy League Red Brick)
    const hallBody = new THREE.Mesh(
      new THREE.BoxGeometry(125, 58, 65),
      brickMat
    );
    hallBody.position.set(-45, 29, -80);
    hallBody.castShadow = true;
    group.add(hallBody);

    // Hall Portico with 6 White Classical Columns
    const portico = new THREE.Mesh(new THREE.BoxGeometry(50, 4, 18), stoneTrimMat);
    portico.position.set(-45, 30, -45);
    group.add(portico);

    const pediment = new THREE.Mesh(new THREE.ConeGeometry(32, 14, 4), stoneTrimMat);
    pediment.position.set(-45, 41, -45);
    pediment.rotation.y = Math.PI / 4;
    group.add(pediment);

    [-20, -12, -4, 4, 12, 20].forEach(cx => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 28, 12), stoneTrimMat);
      col.position.set(-45 + cx, 14, -45);
      col.castShadow = true;
      group.add(col);
    });

    // Hall Double Entrance Doors
    const door = new THREE.Mesh(new THREE.BoxGeometry(14, 22, 1), new THREE.MeshLambertMaterial({ color: 0x451a03 }));
    door.position.set(-45, 11, -47.2);
    group.add(door);

    // Collegiate Clock Tower Rising from Main Hall
    const towerMesh = new THREE.Mesh(
      new THREE.BoxGeometry(26, 115, 26),
      new THREE.MeshLambertMaterial({ color: 0x5b1313 })
    );
    towerMesh.position.set(-45, 57.5, -80);
    towerMesh.castShadow = true;
    group.add(towerMesh);

    // Spire Roof (Copper Verdigris Green)
    const spire = new THREE.Mesh(
      new THREE.ConeGeometry(17, 34, 4),
      new THREE.MeshLambertMaterial({ color: 0x0f766e })
    );
    spire.position.set(-45, 132, -80);
    spire.rotation.y = Math.PI / 4;
    group.add(spire);

    // 4 Functional Clock Faces on Tower
    const clockGeo = new THREE.CylinderGeometry(8, 8, 1, 24);
    const clockMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const clockFaceFront = new THREE.Mesh(clockGeo, clockMat);
    clockFaceFront.rotation.x = Math.PI / 2;
    clockFaceFront.position.set(-45, 98, -66.5);
    group.add(clockFaceFront);

    // 8. Modern Glass Computer Science & AI Research Pavilion
    const csPavilion = new THREE.Mesh(
      new THREE.BoxGeometry(95, 52, 70),
      new THREE.MeshLambertMaterial({ color: 0x0284c7, transparent: true, opacity: 0.85 })
    );
    csPavilion.position.set(80, 26, -80);
    csPavilion.castShadow = true;
    group.add(csPavilion);

    // Ground Waypoint at APJ KTU Academic Hall
    if (window.GTAModels && window.GTAModels.createGTAWaypoint) {
      const wpHall = window.GTAModels.createGTAWaypoint({
        x: -45, y: 0.5, z: -55,
        colorHex: '#0284c7', colorNum: 0x0284c7,
        icon: '🏛️', title: 'APJ KTU Academic Hall'
      });
      group.add(wpHall);
    }

    // 9. Autumn Maple & Green Oak Campus Trees
    const treeColors = [0xd97706, 0xef4444, 0x15803d, 0xb45309, 0xeab308];
    for (let i = 0; i < 24; i++) {
      const tx = -160 + Math.random() * 320;
      const tz = -110 + Math.random() * 220;
      if (Math.abs(tx) > 22 || tz > 115) { // Keep main walk and gate clear
        this.createCollegiateTree(group, tx, tz, treeColors[i % treeColors.length]);
      }
    }

    // 10. Campus Park Benches & Sitting Students on Laptops
    [
      [-22, 10], [22, 10], [-22, 45], [22, 45], [-22, -25], [22, -25],
      [-65, 10], [65, 10], [-65, -30], [65, -30]
    ].forEach(bPos => {
      this.createCampusBench(group, bPos[0], bPos[1]);
      const student = this.createSittingStudentMesh();
      student.position.set(bPos[0], 0, bPos[1]);
      group.add(student);
    });

    // 11. Study Circles on Lawn (Students in Circles with Books & Laptops)
    this.createStudyCircle(group, -85, 35);
    this.createStudyCircle(group, 85, 35);
    this.createStudyCircle(group, -85, -20);
    this.createStudyCircle(group, 85, -20);

    // 12. Bicycle Racks with Bicycles
    this.createBicycleRack(group, -48, 120);
    this.createBicycleRack(group, 48, 120);

    // Position the entire university quad
    group.position.set(-260, 0, -360);
    this.scene.add(group);
  }

  // HAMNA'S GIANT 3D EDUCATIONAL FLEX HOARDING (Ultra-Realistic with Hamna's Real Photo)
  createHamnaEducationBillboard(parent, x, z) {
    const billboardGroup = new THREE.Group();

    // Heavy Industrial Steel Truss Columns & Concrete Bases
    const trussMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    const concMat = new THREE.MeshLambertMaterial({ color: 0x94a3b8 });

    [-24, 24].forEach(bx => {
      const base = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 6), concMat);
      base.position.set(bx, 2, 0);
      billboardGroup.add(base);

      const post = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 38, 8), trussMat);
      post.position.set(bx, 20, 0);
      billboardGroup.add(post);
    });

    // Billboard Backing Frame (56 units wide x 32 units tall)
    const frameGeo = new THREE.BoxGeometry(56, 32, 2.4);
    const frameMesh = new THREE.Mesh(frameGeo, new THREE.MeshLambertMaterial({ color: 0x0f172a }));
    frameMesh.position.set(0, 26, 0);
    billboardGroup.add(frameMesh);

    // 4 Angled Overhead Floodlights Casting Light Down
    const lampFixtureMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    [-20, -7, 7, 20].forEach(lx => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 6), lampFixtureMat);
      arm.position.set(lx, 42.5, 3);
      billboardGroup.add(arm);

      const lamp = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 2), lampFixtureMat);
      lamp.position.set(lx, 42, 6);
      lamp.rotation.x = 0.45;
      billboardGroup.add(lamp);

      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), bulbMat);
      bulb.position.set(lx, 41.5, 6);
      billboardGroup.add(bulb);
    });

    // High-Resolution Procedural Flex Texture (2048 x 1080 px)
    const flexCanvas = document.createElement('canvas');
    flexCanvas.width = 2048;
    flexCanvas.height = 1080;
    const fctx = flexCanvas.getContext('2d');

    const drawFlexCanvas = (hamnaImg = null) => {
      // 1. Rich Collegiate Midnight Background Gradient
      const grad = fctx.createLinearGradient(0, 0, 2048, 1080);
      grad.addColorStop(0, '#060d1f');
      grad.addColorStop(0.5, '#0f172a');
      grad.addColorStop(1, '#1e293b');
      fctx.fillStyle = grad;
      fctx.fillRect(0, 0, 2048, 1080);

      // 2. Gold Ornate Double Borders
      fctx.strokeStyle = '#f59e0b';
      fctx.lineWidth = 18;
      fctx.strokeRect(16, 16, 2016, 1048);

      fctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      fctx.lineWidth = 5;
      fctx.strokeRect(32, 32, 1984, 1016);

      // 3. Top Header Banner Ribbon
      fctx.fillStyle = '#f59e0b';
      fctx.fillRect(36, 36, 1976, 92);
      fctx.fillStyle = '#0f172a';
      fctx.font = '900 36px "Plus Jakarta Sans", sans-serif';
      fctx.textAlign = 'center';
      fctx.fillText('🏛️ CALIFORNIA STATE TECH & APJ KTU COLLEGIATE ALLIANCE // OFFICIAL HONORS EXHIBITION', 1024, 98);

      // 4. Left Side: Hamna's Real Portrait Photo Frame
      const px = 80;
      const py = 160;
      const pw = 580;
      const ph = 760;

      fctx.fillStyle = '#020617';
      fctx.fillRect(px, py, pw, ph);
      fctx.strokeStyle = '#f59e0b';
      fctx.lineWidth = 12;
      fctx.strokeRect(px, py, pw, ph);

      if (hamnaImg && hamnaImg.complete && hamnaImg.naturalWidth > 0) {
        fctx.drawImage(hamnaImg, px + 8, py + 8, pw - 16, ph - 16);
      } else {
        fctx.fillStyle = '#f59e0b';
        fctx.font = 'bold 32px sans-serif';
        fctx.fillText('🎓 FATHIMA HAMNA K', px + pw / 2, py + ph / 2);
      }

      // Scholar Badge Below Photo
      fctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      fctx.fillRect(px + 14, py + ph - 80, pw - 28, 64);
      fctx.strokeStyle = '#f59e0b';
      fctx.lineWidth = 4;
      fctx.strokeRect(px + 14, py + ph - 80, pw - 28, 64);

      fctx.fillStyle = '#f59e0b';
      fctx.font = '900 24px "Plus Jakarta Sans", sans-serif';
      fctx.textAlign = 'center';
      fctx.fillText('⭐ DISTINGUISHED ACADEMIC SCHOLAR ⭐', px + pw / 2, py + ph - 40);

      // 5. Right Side: Academic Typography & Dossier
      const tx = 710;
      fctx.textAlign = 'left';

      fctx.fillStyle = '#38bdf8';
      fctx.font = 'bold 30px "JetBrains Mono", monospace';
      fctx.fillText('// ACADEMIC & ENGINEERING DOSSIER', tx, 200);

      fctx.fillStyle = '#ffffff';
      fctx.font = '900 66px "Plus Jakarta Sans", sans-serif';
      fctx.fillText('FATHIMA HAMNA K', tx, 275);

      // Degree 1: KTU MCA
      fctx.fillStyle = '#f59e0b';
      fctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
      fctx.fillText('🎓 MASTER OF COMPUTER APPLICATIONS (MCA)', tx, 345);

      fctx.fillStyle = '#e2e8f0';
      fctx.font = '500 28px sans-serif';
      fctx.fillText('APJ Abdul Kalam Technological University (KTU) | 08/2026 – Present', tx, 390);

      // Degree 2: Calicut BCA
      fctx.fillStyle = '#10b981';
      fctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
      fctx.fillText('📜 BACHELOR OF COMPUTER APPLICATIONS (BCA)', tx, 465);

      fctx.fillStyle = '#e2e8f0';
      fctx.font = '500 28px sans-serif';
      fctx.fillText('University of Calicut | First Class Honors Graduate (2022 – 2025)', tx, 510);

      // Fellowships
      fctx.fillStyle = '#fbbf24';
      fctx.font = 'bold 32px sans-serif';
      fctx.fillText('💼 INDUSTRY FELLOWSHIPS & PRACTICUM:', tx, 585);

      fctx.fillStyle = '#cbd5e1';
      fctx.font = '26px sans-serif';
      fctx.fillText('• Cognilearn Innovative Solutions — Software Intern & Researcher (Current)', tx, 630);
      fctx.fillText('• Softroniics Technologies, Calicut — Fullstack Python & Django Fellow', tx, 675);

      // Tech Stack Ribbon
      fctx.fillStyle = '#0284c7';
      fctx.fillRect(tx, 715, 1240, 65);
      fctx.fillStyle = '#ffffff';
      fctx.font = 'bold 26px "JetBrains Mono", monospace';
      fctx.fillText('CORE: Python 3 • Django • React.js • MySQL • REST APIs • OOP Architecture', tx + 24, 756);

      // Call to Action
      fctx.fillStyle = '#f59e0b';
      fctx.font = 'bold 28px sans-serif';
      fctx.fillText('▼ WALK THROUGH CAMPUS GATES TO EXPLORE ACADEMIC EXHIBITIONS [PRESS E] ▼', tx, 840);
    };

    drawFlexCanvas();

    const flexTexture = new THREE.CanvasTexture(flexCanvas);
    const hamnaImg = new Image();
    hamnaImg.crossOrigin = 'anonymous';
    hamnaImg.src = 'assets/hamna_real.jpg';
    hamnaImg.onload = () => {
      drawFlexCanvas(hamnaImg);
      flexTexture.needsUpdate = true;
    };

    const flexMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(55, 31),
      new THREE.MeshBasicMaterial({ map: flexTexture })
    );
    flexMesh.position.set(0, 26, 1.3);
    billboardGroup.add(flexMesh);

    billboardGroup.position.set(x, 0, z);
    parent.add(billboardGroup);
  }

  // Interactive 3D Academic Exhibition Kiosk
  createAcademicExhibitionKiosk(parent, x, z, title, code, bullets, colorHex, icon) {
    const kiosk = new THREE.Group();

    // Carved Granite Pedestal Base
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(10, 5, 10),
      new THREE.MeshLambertMaterial({ color: 0x334155 })
    );
    base.position.y = 2.5;
    kiosk.add(base);

    // Brass Plinth Collar
    const collar = new THREE.Mesh(
      new THREE.BoxGeometry(9, 1.2, 9),
      new THREE.MeshLambertMaterial({ color: 0xf59e0b })
    );
    collar.position.y = 5.6;
    kiosk.add(collar);

    // Floating Glowing 3D Crystal Polyhedron
    const crystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(2.4, 0),
      new THREE.MeshLambertMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 0.5 })
    );
    crystal.position.y = 9.5;
    kiosk.add(crystal);

    // Kiosk Display Board (Canvas Plaque)
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 1024, 640);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 12;
    ctx.strokeRect(8, 8, 1008, 624);

    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(8, 8, 1008, 70);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${icon} ACADEMIC EXHIBIT // PRESS [E] TO INSPECT`, 512, 54);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(code, 40, 140);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 42px sans-serif';
    ctx.fillText(title, 40, 205);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '28px sans-serif';
    bullets.forEach((b, idx) => {
      ctx.fillText(b, 40, 280 + idx * 60);
    });

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('★ Verified Transcripts & Curriculum in University Hall ★', 40, 560);

    const tex = new THREE.CanvasTexture(canvas);
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(16, 10, 0.8),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    board.position.set(0, 14, 0);
    kiosk.add(board);

    // Ground Waypoint Marker in front of Kiosk
    if (window.GTAModels && window.GTAModels.createGTAWaypoint) {
      const hexStr = typeof colorHex === 'number' ? '#' + colorHex.toString(16).padStart(6, '0') : '#f59e0b';
      const wp = window.GTAModels.createGTAWaypoint({
        x: 0, y: 0.2, z: 8,
        colorHex: hexStr,
        colorNum: colorHex,
        icon: icon,
        title: title
      });
      kiosk.add(wp);
    }

    kiosk.position.set(x, 0, z);
    parent.add(kiosk);
  }

  // Concentric 3-Tiered Stone Water Fountain
  createCollegiateFountain(parent, x, z) {
    const fountain = new THREE.Group();
    const stoneMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
    const waterMat = new THREE.MeshLambertMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 });

    // Lower Tier Basin (Diameter 28)
    const basin1 = new THREE.Mesh(new THREE.CylinderGeometry(14, 15, 3.5, 24), stoneMat);
    basin1.position.y = 1.75;
    fountain.add(basin1);

    const water1 = new THREE.Mesh(new THREE.CylinderGeometry(13, 13, 0.5, 24), waterMat);
    water1.position.y = 3.2;
    fountain.add(water1);

    // Mid Tier Basin
    const basin2 = new THREE.Mesh(new THREE.CylinderGeometry(8, 9, 2.5, 20), stoneMat);
    basin2.position.y = 6.5;
    fountain.add(basin2);

    const water2 = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 7.2, 0.5, 20), waterMat);
    water2.position.y = 7.5;
    fountain.add(water2);

    // Top Jet Column
    const column = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.2, 10, 16), stoneMat);
    column.position.y = 8;
    fountain.add(column);

    const jet = new THREE.Mesh(new THREE.SphereGeometry(2.4, 12, 12), waterMat);
    jet.position.y = 13.5;
    fountain.add(jet);

    fountain.position.set(x, 0, z);
    parent.add(fountain);
  }

  // 45-Foot American Flagpole
  createAmericanFlagpole(parent, x, z) {
    const poleGroup = new THREE.Group();
    const poleMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
    const goldMat = new THREE.MeshLambertMaterial({ color: 0xf59e0b });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(2, 2.5, 3, 12), new THREE.MeshLambertMaterial({ color: 0x334155 }));
    base.position.y = 1.5;
    poleGroup.add(base);

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.9, 44, 12), poleMat);
    mast.position.y = 24;
    poleGroup.add(mast);

    const finial = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 12), goldMat);
    finial.position.y = 46.5;
    poleGroup.add(finial);

    // American Flag Texture
    const flagCanvas = document.createElement('canvas');
    flagCanvas.width = 512;
    flagCanvas.height = 300;
    const fctx = flagCanvas.getContext('2d');

    // 13 Stripes
    for (let i = 0; i < 13; i++) {
      fctx.fillStyle = (i % 2 === 0 ? '#b91c1c' : '#ffffff');
      fctx.fillRect(0, i * (300 / 13), 512, 300 / 13);
    }
    // Blue Canton
    fctx.fillStyle = '#1e3a8a';
    fctx.fillRect(0, 0, 210, (300 / 13) * 7);

    // White Stars
    fctx.fillStyle = '#ffffff';
    fctx.font = '14px sans-serif';
    fctx.fillText('★ ★ ★ ★ ★', 25, 40);
    fctx.fillText('★ ★ ★ ★', 40, 75);
    fctx.fillText('★ ★ ★ ★ ★', 25, 110);
    fctx.fillText('★ ★ ★ ★', 40, 140);

    const flagTex = new THREE.CanvasTexture(flagCanvas);
    const flagMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 9.5),
      new THREE.MeshBasicMaterial({ map: flagTex, side: THREE.DoubleSide })
    );
    flagMesh.position.set(8.2, 40, 0);
    poleGroup.add(flagMesh);

    poleGroup.position.set(x, 0, z);
    parent.add(poleGroup);
  }

  // Campus Study Circle on Grass
  createStudyCircle(parent, x, z) {
    const circle = new THREE.Group();
    const matGeo = new THREE.CylinderGeometry(8, 8, 0.2, 16);
    const matMesh = new THREE.Mesh(matGeo, new THREE.MeshLambertMaterial({ color: 0x0284c7 }));
    matMesh.position.y = 0.5;
    circle.add(matMesh);

    // 3 Students Sitting Cross-Legged
    const angles = [0, 2.1, 4.2];
    angles.forEach(ang => {
      const student = this.createSittingStudentMesh();
      student.position.set(Math.sin(ang) * 4.5, 0, Math.cos(ang) * 4.5);
      student.rotation.y = ang + Math.PI;
      circle.add(student);
    });

    circle.position.set(x, 0, z);
    parent.add(circle);
  }

  // Campus Bicycle Rack with Bicycles
  createBicycleRack(parent, x, z) {
    const rack = new THREE.Group();
    const steelMat = new THREE.MeshLambertMaterial({ color: 0x64748b });

    for (let i = -8; i <= 8; i += 4) {
      const loop = new THREE.Mesh(new THREE.TorusGeometry(2, 0.3, 8, 16, Math.PI), steelMat);
      loop.position.set(i, 2, 0);
      rack.add(loop);

      // Bicycle Silhouette
      const bikeBody = new THREE.Mesh(new THREE.BoxGeometry(4.5, 2, 0.4), new THREE.MeshLambertMaterial({ color: 0xef4444 }));
      bikeBody.position.set(i, 2, 0);
      rack.add(bikeBody);
    }

    rack.position.set(x, 0, z);
    parent.add(rack);
  }

  createCollegiateTree(parent, x, z, leafColor = 0xd97706) {
    if (window.GTAModels) {
      const tree = window.GTAModels.createLushTree(22 + Math.random() * 6, leafColor);
      tree.position.set(x, 0, z);
      parent.add(tree);
    } else {
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.8, 22, 8),
        new THREE.MeshStandardMaterial({ color: 0x451a03 })
      );
      trunk.position.set(x, 11, z);
      parent.add(trunk);
    }
  }

  createCampusBench(parent, x, z) {
    const benchGroup = new THREE.Group();
    const woodMat = new THREE.MeshLambertMaterial({ color: 0x78350f });
    const metalMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });

    const seat = new THREE.Mesh(new THREE.BoxGeometry(10, 0.8, 3.5), woodMat);
    seat.position.set(0, 2.8, 0);
    benchGroup.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(10, 3, 0.8), woodMat);
    back.position.set(0, 5, -1.5);
    benchGroup.add(back);

    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.8, 3.2), metalMat);
    legL.position.set(-4, 1.4, 0);
    benchGroup.add(legL);

    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.8, 3.2), metalMat);
    legR.position.set(4, 1.4, 0);
    benchGroup.add(legR);

    benchGroup.position.set(x, 0, z);
    parent.add(benchGroup);
  }

  createSittingStudentMesh() {
    const student = new THREE.Group();
    const shirtColors = [0xef4444, 0x0284c7, 0x10b981, 0x8b5cf6, 0xf59e0b];
    const sColor = shirtColors[Math.floor(Math.random() * shirtColors.length)];

    const torso = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 4.8, 2.2),
      new THREE.MeshLambertMaterial({ color: sColor })
    );
    torso.position.set(0, 5.2, 0);
    student.add(torso);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 12, 12),
      new THREE.MeshLambertMaterial({ color: 0xf5d0b5 })
    );
    head.position.set(0, 9, 0);
    student.add(head);

    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(1.6, 12, 12),
      new THREE.MeshLambertMaterial({ color: 0x1e293b })
    );
    hair.position.set(0, 9.4, -0.2);
    student.add(hair);

    const thighs = new THREE.Mesh(
      new THREE.BoxGeometry(3, 1.2, 3.8),
      new THREE.MeshLambertMaterial({ color: 0x1e293b })
    );
    thighs.position.set(0, 3.2, 1.6);
    student.add(thighs);

    const shins = new THREE.Mesh(
      new THREE.BoxGeometry(3, 3, 1.2),
      new THREE.MeshLambertMaterial({ color: 0x1e293b })
    );
    shins.position.set(0, 1.5, 3.2);
    student.add(shins);

    const laptop = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 0.3, 2.2),
      new THREE.MeshLambertMaterial({ color: 0x94a3b8 })
    );
    laptop.position.set(0, 4.2, 1.8);
    student.add(laptop);

    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 2, 0.2),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    screen.position.set(0, 5.2, 2.7);
    screen.rotation.x = -0.2;
    student.add(screen);

    return student;
  }

  // American Campus Boulevard Street Elements (Crosswalks, Signals, Signs, Hydrants)
  buildCampusBoulevardElements() {
    const group = new THREE.Group();

    // 1. Large Zebra Pedestrian Crosswalk Leading to Gate
    const crosswalkMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    for (let x = -40; x <= 40; x += 8) {
      const stripe = new THREE.Mesh(new THREE.PlaneGeometry(5, 20), crosswalkMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(x, 0.46, -395);
      group.add(stripe);
    }

    // 2. American Traffic Light Posts
    [-55, 55].forEach(tx => {
      const pole = new THREE.Group();
      const mast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 1, 30, 8),
        new THREE.MeshLambertMaterial({ color: 0xfacc15 }) // American Signal Yellow
      );
      mast.position.y = 15;
      pole.add(mast);

      const arm = new THREE.Mesh(new THREE.BoxGeometry(16, 0.8, 0.8), new THREE.MeshLambertMaterial({ color: 0xfacc15 }));
      arm.position.set((tx > 0 ? -8 : 8), 29, 0);
      pole.add(arm);

      // Signal Light Housing
      const housing = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 2), new THREE.MeshLambertMaterial({ color: 0x1e293b }));
      housing.position.set((tx > 0 ? -12 : 12), 27, 0);
      pole.add(housing);

      // Red, Yellow, Green Lenses
      const red = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      red.position.set((tx > 0 ? -12 : 12), 29, 1.1);
      pole.add(red);

      const green = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
      green.position.set((tx > 0 ? -12 : 12), 25, 1.1);
      pole.add(green);

      pole.position.set(tx, 0, -385);
      group.add(pole);
    });

    // 3. American Street Signs (CAMPUS BLVD / TECH WAY)
    const signGroup = new THREE.Group();
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 20, 8), new THREE.MeshLambertMaterial({ color: 0x64748b }));
    post.position.y = 10;
    signGroup.add(post);

    const sBlade1 = new THREE.Mesh(new THREE.BoxGeometry(10, 1.8, 0.3), new THREE.MeshLambertMaterial({ color: 0x15803d }));
    sBlade1.position.set(0, 19, 0);
    signGroup.add(sBlade1);

    const sBlade2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.8, 10), new THREE.MeshLambertMaterial({ color: 0x15803d }));
    sBlade2.position.set(0, 17, 0);
    signGroup.add(sBlade2);

    signGroup.position.set(-35, 0, -380);
    group.add(signGroup);

    // 4. Fire Hydrants
    const hydrant = new THREE.Group();
    const hBody = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 4.5, 8), new THREE.MeshLambertMaterial({ color: 0xef4444 }));
    hBody.position.y = 2.25;
    hydrant.add(hBody);
    hydrant.position.set(38, 0, -380);
    group.add(hydrant);

    this.scene.add(group);
  }

  // Realistic Fleet & Parked Original Cars along Campus Parkway & Showroom Avenue
  buildCampusBoulevardVehicles() {
    const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;

    // 1. Curbside Yellow NYC Taxi
    let taxi;
    if (window.GTAModelLoader && window.GTAModelLoader.createRealTaxi) {
      taxi = window.GTAModelLoader.createRealTaxi(envMap);
    } else if (window.GTARealisticEntities) {
      taxi = window.GTARealisticEntities.createRealisticVehicle('taxi', 0xfacc15, envMap);
    } else {
      taxi = new THREE.Group();
    }
    taxi.position.set(-36, 0, -380);
    taxi.rotation.y = Math.PI;
    this.taxiCab = taxi;
    this.scene.add(taxi);

    // 2. Curbside Parked Real Cars for Immediate Inspection & Driving
    if (window.GTARealisticEntities) {
      // BMW M4 Competition Coupe (Portimao Blue)
      if (window.GTARealisticEntities.createBmwM4Competition) {
        const bmw = window.GTARealisticEntities.createBmwM4Competition(0x0284c7, envMap);
        bmw.position.set(-36, 0, -260);
        bmw.rotation.y = Math.PI;
        this.scene.add(bmw);
      }

      // Toyota Innova Crysta MPV (Pearl White)
      if (window.GTARealisticEntities.createToyotaInnovaCrysta) {
        const innova = window.GTARealisticEntities.createToyotaInnovaCrysta(0xe2e8f0, envMap);
        innova.position.set(36, 0, -260);
        innova.rotation.y = 0;
        this.scene.add(innova);
      }

      // Tesla Model S Plaid (Red Multi-Coat)
      if (window.GTARealisticEntities.createTeslaModelSPlaid) {
        const tesla = window.GTARealisticEntities.createTeslaModelSPlaid(0xdc2626, envMap);
        tesla.position.set(36, 0, -320);
        tesla.rotation.y = 0;
        this.scene.add(tesla);
      }

      // Audi R8 V10 Plus Quattro (Vegas Yellow)
      if (window.GTARealisticEntities.createAudiR8Supercar) {
        const audi = window.GTARealisticEntities.createAudiR8Supercar(0xf59e0b, envMap);
        audi.position.set(-36, 0, -200);
        audi.rotation.y = Math.PI;
        this.scene.add(audi);
      }

      // Rolls-Royce Phantom VIII (Royal Midnight Obsidian)
      if (window.GTARealisticEntities.createRollsRoycePhantom) {
        const rr = window.GTARealisticEntities.createRollsRoycePhantom(0x090d16, envMap);
        rr.position.set(36, 0, -200);
        rr.rotation.y = 0;
        this.scene.add(rr);
      }
    }
  }

  // ========================================================
  // 12. EXPANDED METROPOLITAN ROAD NETWORK
  // Avenue 4 (South), Avenue 5 (North), Ocean Promenade & East Beltway
  // ========================================================
  buildExpandedRoadNetwork() {
    const crosswayTex = window.GTATextures ? window.GTATextures.createCrosswayAsphalt() : null;
    const roadMat = new THREE.MeshStandardMaterial({
      map: crosswayTex,
      roughness: 0.72,
      metalness: 0.18
    });
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.75, metalness: 0.1 });

    // 1. Avenue 4 (South Metropolis Boulevard, z = 520): Connects Coastal Beach to Silicon Towers
    const ave4 = new THREE.Mesh(new THREE.PlaneGeometry(1100, 80), roadMat);
    ave4.rotation.x = -Math.PI / 2;
    ave4.position.set(-30, 0.38, 520);
    ave4.receiveShadow = true;
    this.scene.add(ave4);

    // Avenue 4 Sidewalks & Curbs
    [-42, 42].forEach(offZ => {
      const curb = new THREE.Mesh(new THREE.BoxGeometry(1100, 1.4, 2.5), curbMat);
      curb.position.set(-30, 0.7, 520 + (offZ > 0 ? 41.2 : -41.2));
      this.scene.add(curb);
    });

    // 2. Avenue 5 (North Boulevard, z = -480): Connects West Bluffs to Police HQ & KTU
    const ave5 = new THREE.Mesh(new THREE.PlaneGeometry(880, 75), roadMat);
    ave5.rotation.x = -Math.PI / 2;
    ave5.position.set(-130, 0.38, -480);
    ave5.receiveShadow = true;
    this.scene.add(ave5);

    // 3. Scenic Pacific Ocean Coastal Promenade (x = -560, z from -700 to 700)
    const coastalPromenade = new THREE.Mesh(new THREE.PlaneGeometry(75, 1400), roadMat);
    coastalPromenade.rotation.x = -Math.PI / 2;
    coastalPromenade.position.set(-560, 0.38, 0);
    coastalPromenade.receiveShadow = true;
    this.scene.add(coastalPromenade);

    // Coastal Ocean Seawall Barrier along x = -600
    const seawallMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85, metalness: 0.15 });
    const seawall = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.2, 1400), seawallMat);
    seawall.position.set(-600, 1.6, 0);
    this.scene.add(seawall);

    // 4. East Technology Parkway (x = 460, z from -480 to 570)
    const eastParkway = new THREE.Mesh(new THREE.PlaneGeometry(75, 1050), roadMat);
    eastParkway.rotation.x = -Math.PI / 2;
    eastParkway.position.set(460, 0.38, 45);
    eastParkway.receiveShadow = true;
    this.scene.add(eastParkway);

    // Overhead Directional Highway Signboards
    this.buildHighwayGantrySign(0, 0, 480);
    this.buildHighwayGantrySign(0, 0, -480);
  }

  // ========================================================
  // 13. METRO POLICE DEPARTMENT HQ & PRECINCT PLAZA
  // ========================================================
  buildPoliceHeadquartersPrecinct() {
    const policeGroup = new THREE.Group();
    const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;

    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7, metalness: 0.3, envMap });
    const blueWallMat = new THREE.MeshStandardMaterial({ color: 0x0f274a, roughness: 0.45, metalness: 0.6, envMap });
    const whiteTrimMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.2, envMap });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.75, envMap });

    // 1. Concrete Plaza Plinth
    const plaza = new THREE.Mesh(new THREE.BoxGeometry(110, 2, 95), baseMat);
    plaza.position.set(130, 1, -560);
    policeGroup.add(plaza);

    // 2. Main 3-Story Police Headquarters Building
    const mainHQ = new THREE.Mesh(new THREE.BoxGeometry(85, 38, 70), blueWallMat);
    mainHQ.position.set(130, 20, -565);
    policeGroup.add(mainHQ);

    // White Architectural Accent Panels & Parapet
    const parapet = new THREE.Mesh(new THREE.BoxGeometry(89, 2.5, 74), whiteTrimMat);
    parapet.position.set(130, 39.5, -565);
    policeGroup.add(parapet);

    // Ribbon Glass Windows on Floors
    [10, 20, 30].forEach(wy => {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(78, 5.5), glassMat);
      win.position.set(130, wy, -529.6);
      policeGroup.add(win);
    });

    // 3. Entrance Canopy with Illuminated Police Badge & Sign
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(42, 2.2, 18), whiteTrimMat);
    canopy.position.set(130, 8, -522);
    policeGroup.add(canopy);

    const signCanvas = document.createElement('canvas');
    signCanvas.width = 512; signCanvas.height = 128;
    const sctx = signCanvas.getContext('2d');
    sctx.fillStyle = '#0f172a'; sctx.fillRect(0, 0, 512, 128);
    sctx.strokeStyle = '#38bdf8'; sctx.lineWidth = 6; sctx.strokeRect(4, 4, 504, 120);
    sctx.fillStyle = '#38bdf8'; sctx.font = '900 28px "Orbitron", sans-serif'; sctx.textAlign = 'center';
    sctx.fillText('LOS SANTOS POLICE DEPT', 256, 52);
    sctx.fillStyle = '#f8fafc'; sctx.font = 'bold 20px "JetBrains Mono", monospace';
    sctx.fillText('METRO PRECINCT // CYBERCRIME DIVISION', 256, 92);
    const signTex = new THREE.CanvasTexture(signCanvas);
    const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(36, 9), new THREE.MeshBasicMaterial({ map: signTex }));
    signMesh.position.set(130, 13.5, -521.5);
    policeGroup.add(signMesh);

    // 4. Rooftop Communications Antenna Tower with Blinking Beacon
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.3 });
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.8, 48, 8), mastMat);
    mast.position.set(155, 63, -580);
    policeGroup.add(mast);

    const beaconLight = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 12), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    beaconLight.position.set(155, 87.5, -580);
    policeGroup.add(beaconLight);
    this.policeBeaconLight = beaconLight;

    // 5. Rooftop Helipad
    const heliPad = new THREE.Mesh(new THREE.CylinderGeometry(16, 16, 1, 32), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 }));
    heliPad.position.set(108, 40, -565);
    policeGroup.add(heliPad);

    const hCanvas = document.createElement('canvas');
    hCanvas.width = 256; hCanvas.height = 256;
    const hctx = hCanvas.getContext('2d');
    hctx.fillStyle = '#334155'; hctx.fillRect(0, 0, 256, 256);
    hctx.strokeStyle = '#facc15'; hctx.lineWidth = 14;
    hctx.beginPath(); hctx.arc(128, 128, 100, 0, Math.PI * 2); hctx.stroke();
    hctx.fillStyle = '#facc15'; hctx.font = '900 130px sans-serif'; hctx.textAlign = 'center'; hctx.textBaseline = 'middle';
    hctx.fillText('H', 128, 128);
    const hTex = new THREE.CanvasTexture(hCanvas);
    const hMesh = new THREE.Mesh(new THREE.PlaneGeometry(28, 28), new THREE.MeshBasicMaterial({ map: hTex, transparent: true }));
    hMesh.rotation.x = -Math.PI / 2;
    hMesh.position.set(108, 40.6, -565);
    policeGroup.add(hMesh);

    // 6. Parked LAPD Patrol Cruisers in Front Parking Stalls
    const cruiserXPositions = [82, 104, 156];
    cruiserXPositions.forEach((cx) => {
      let cruiser;
      if (window.GTAModelLoader && window.GTAModelLoader.createRealPoliceCruiser) {
        cruiser = window.GTAModelLoader.createRealPoliceCruiser(envMap);
      } else if (window.GTARealisticEntities) {
        cruiser = window.GTARealisticEntities.createRealisticVehicle('police', 0x09090b, envMap);
      } else {
        cruiser = new THREE.Group();
      }
      cruiser.position.set(cx, 1, -518);
      cruiser.rotation.y = 0;
      policeGroup.add(cruiser);
      this.policeCruisers.push(cruiser);
    });

    // Waypoint Marker at Entrance
    if (window.GTAModels && window.GTAModels.createWaypointMarker) {
      const wp = window.GTAModels.createWaypointMarker('POLICE HQ', 0x3b82f6);
      wp.position.set(130, 0, -510);
      policeGroup.add(wp);
    }

    this.scene.add(policeGroup);
  }

  // ========================================================
  // 14. PACIFIC MARINA & SANTA MONICA BOARDWALK PIER
  // ========================================================
  buildCoastalBeachPierAndMarina() {
    const pierGroup = new THREE.Group();
    const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;

    const plankMat = new THREE.MeshStandardMaterial({ color: 0x78533b, roughness: 0.88, metalness: 0.05, envMap });
    const woodPilingMat = new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.95 });
    const railMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4, metalness: 0.6 });

    // 1. Giant Wooden Boardwalk Deck reaching out over the ocean (x: -520 to -740, z: 320)
    const pierLength = 220;
    const pierWidth = 46;
    const deck = new THREE.Mesh(new THREE.BoxGeometry(pierLength, 2.4, pierWidth), plankMat);
    deck.position.set(-630, 3.2, 320);
    deck.receiveShadow = true;
    pierGroup.add(deck);

    // Support Pilings underneath
    for (let px = -540; px >= -730; px -= 35) {
      [-18, 18].forEach(pzOff => {
        const piling = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 28, 8), woodPilingMat);
        piling.position.set(px, -6, 320 + pzOff);
        pierGroup.add(piling);
      });
    }

    // Safety Railings along the Boardwalk
    const railL = new THREE.Mesh(new THREE.BoxGeometry(pierLength, 2.2, 0.4), railMat);
    railL.position.set(-630, 5.2, 320 - 22.5);
    pierGroup.add(railL);

    const railR = new THREE.Mesh(new THREE.BoxGeometry(pierLength, 2.2, 0.4), railMat);
    railR.position.set(-630, 5.2, 320 + 22.5);
    pierGroup.add(railR);

    // 2. Glowing Neon Boardwalk Ferris Wheel at Pier Head
    const wheelGroup = new THREE.Group();
    const wheelCenter = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 2, 16), new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8 }));
    wheelCenter.rotation.x = Math.PI / 2;
    wheelGroup.add(wheelCenter);

    const rimGeo = new THREE.TorusGeometry(26, 0.8, 12, 36);
    const rimMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const wheelRim = new THREE.Mesh(rimGeo, rimMat);
    wheelGroup.add(wheelRim);

    // Spokes
    for (let s = 0; s < 12; s++) {
      const angle = (s / 12) * Math.PI * 2;
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 52, 6), new THREE.MeshBasicMaterial({ color: 0xf43f5e }));
      spoke.rotation.z = angle;
      wheelGroup.add(spoke);
    }

    wheelGroup.position.set(-730, 35, 320);
    pierGroup.add(wheelGroup);
    this.ferrisWheel = wheelGroup;

    // Support Legs for Ferris Wheel
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 38, 8), woodPilingMat);
    legL.position.set(-730, 18, 305);
    legL.rotation.x = 0.25;
    pierGroup.add(legL);

    const legR = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 38, 8), woodPilingMat);
    legR.position.set(-730, 18, 335);
    legR.rotation.x = -0.25;
    pierGroup.add(legR);

    // 3. Colorful Boardwalk Kiosks & Shacks
    const shackColors = [0x0284c7, 0xf43f5e, 0xf59e0b, 0x10b981];
    [-680, -640, -600, -560].forEach((sx, idx) => {
      const shack = new THREE.Mesh(new THREE.BoxGeometry(16, 10, 12), new THREE.MeshStandardMaterial({ color: shackColors[idx], roughness: 0.6 }));
      shack.position.set(sx, 9.4, 320 + (idx % 2 === 0 ? 12 : -12));
      pierGroup.add(shack);

      // Awning roof
      const awning = new THREE.Mesh(new THREE.BoxGeometry(18, 1, 14), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 }));
      awning.position.set(sx, 14.8, 320 + (idx % 2 === 0 ? 12 : -12));
      pierGroup.add(awning);
    });

    // 4. Moored Speedboats at Pier Marina Dock
    [-670, -620].forEach((bx, bIdx) => {
      const boat = new THREE.Group();
      const hull = new THREE.Mesh(new THREE.BoxGeometry(22, 5, 8), new THREE.MeshStandardMaterial({ color: bIdx === 0 ? 0xdc2626 : 0x0284c7, roughness: 0.3, metalness: 0.7 }));
      boat.add(hull);
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(10, 4, 6), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 }));
      cabin.position.set(-2, 3.8, 0);
      boat.add(cabin);

      boat.position.set(bx, 0.8, 275);
      pierGroup.add(boat);
    });

    // Waypoint Marker at Entrance
    if (window.GTAModels && window.GTAModels.createWaypointMarker) {
      const wp = window.GTAModels.createWaypointMarker('SANTA MONICA PIER', 0xf59e0b);
      wp.position.set(-530, 0, 320);
      pierGroup.add(wp);
    }

    this.scene.add(pierGroup);
  }

  // ========================================================
  // 15. HAMNA AI CLOUD & FINTECH SKYSCRAPER PLAZA
  // ========================================================
  buildSiliconFinancialTowers() {
    const siliconGroup = new THREE.Group();
    const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;

    // Granite Plaza Base with Reflecting Pool
    const plaza = new THREE.Mesh(new THREE.BoxGeometry(140, 2, 140), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8, metalness: 0.2, envMap }));
    plaza.position.set(380, 1, 390);
    siliconGroup.add(plaza);

    const pool = new THREE.Mesh(new THREE.BoxGeometry(45, 0.8, 45), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.05, metalness: 0.9, transparent: true, opacity: 0.88, envMap }));
    pool.position.set(380, 2.1, 390);
    siliconGroup.add(pool);

    // Tower A: Hamna AI Cloud Tower (Azure Skyscraper)
    if (window.GTAModels && window.GTAModels.createSkyscraper) {
      const towerA = window.GTAModels.createSkyscraper(80, 310, 80, 'azure');
      towerA.position.set(340, 0, 390);
      siliconGroup.add(towerA);

      // Tower B: Cyber Matrix FinTech Center (Gold/Emerald Skyscraper)
      const towerB = window.GTAModels.createSkyscraper(76, 260, 76, 'gold');
      towerB.position.set(425, 0, 390);
      siliconGroup.add(towerB);
    }

    // Skybridge connecting Tower A and Tower B at Height 135
    const bridgeMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.8, envMap });
    const skybridge = new THREE.Mesh(new THREE.BoxGeometry(55, 9, 14), bridgeMat);
    skybridge.position.set(382, 135, 390);
    siliconGroup.add(skybridge);

    const bridgeFrame = new THREE.Mesh(new THREE.BoxGeometry(57, 1.2, 16), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.8 }));
    bridgeFrame.position.set(382, 130, 390);
    siliconGroup.add(bridgeFrame);

    // Spire Antennas with Pulsing Red Beacon on Tower A
    const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 1.5, 42, 8), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 }));
    spire.position.set(340, 331, 390);
    siliconGroup.add(spire);

    const towerBeacon = new THREE.Mesh(new THREE.SphereGeometry(1.8, 12, 12), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    towerBeacon.position.set(340, 353, 390);
    siliconGroup.add(towerBeacon);

    // Waypoint Marker at Entrance
    if (window.GTAModels && window.GTAModels.createWaypointMarker) {
      const wp = window.GTAModels.createWaypointMarker('AI CLOUD TOWERS', 0x38bdf8);
      wp.position.set(380, 0, 325);
      siliconGroup.add(wp);
    }

    this.scene.add(siliconGroup);
  }

  // ========================================================
  // 16. DEVOPS DATACENTER & SERVER FARM INNOVATION PARK
  // ========================================================
  buildDevOpsDatacenterPark() {
    const dcGroup = new THREE.Group();
    const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.4, envMap });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7, metalness: 0.5 });
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.2, metalness: 0.85, envMap });

    // Main Datacenter Modular Complex (x: 480, z: -80)
    const building = new THREE.Mesh(new THREE.BoxGeometry(90, 26, 70), wallMat);
    building.position.set(480, 13, -80);
    dcGroup.add(building);

    // Parapet trim
    const parapet = new THREE.Mesh(new THREE.BoxGeometry(92, 1.8, 72), darkMat);
    parapet.position.set(480, 26.5, -80);
    dcGroup.add(parapet);

    // Glass Server Bay Window showing illuminated server racks
    const bayGlass = new THREE.Mesh(new THREE.PlaneGeometry(54, 14), new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.6 }));
    bayGlass.position.set(480, 11, -44.8);
    dcGroup.add(bayGlass);

    // Glowing Server Racks inside window
    for (let rx = -20; rx <= 20; rx += 10) {
      const rack = new THREE.Mesh(new THREE.BoxGeometry(6, 12, 4), new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.7 }));
      rack.position.set(480 + rx, 9, -52);
      dcGroup.add(rack);

      const led = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 9), new THREE.MeshBasicMaterial({ color: (rx % 20 === 0) ? 0x10b981 : 0x06b6d4 }));
      led.position.set(480 + rx, 9, -49.8);
      dcGroup.add(led);
    }

    // 4 Giant Rooftop Industrial Cooling Ventilation Towers
    for (let cx = -22; cx <= 22; cx += 44) {
      for (let cz = -18; cz <= 18; cz += 36) {
        const fanHousing = new THREE.Mesh(new THREE.CylinderGeometry(7, 8, 8, 16), darkMat);
        fanHousing.position.set(480 + cx, 30, -80 + cz);
        dcGroup.add(fanHousing);

        const fanCenter = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 9, 8), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 }));
        fanCenter.position.set(480 + cx, 30.5, -80 + cz);
        dcGroup.add(fanCenter);
      }
    }

    // Solar Panel Array Canopy over roof center
    const solarCanopy = new THREE.Mesh(new THREE.BoxGeometry(38, 1.2, 54), solarMat);
    solarCanopy.position.set(480, 33, -80);
    solarCanopy.rotation.x = 0.08;
    dcGroup.add(solarCanopy);

    // High-Bandwidth Satellite Dish Uplinks
    [445, 515].forEach((sx, idx) => {
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 14, 8), darkMat);
      mast.position.set(sx, 33, -118);
      dcGroup.add(mast);

      const dish = new THREE.Mesh(new THREE.SphereGeometry(6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2.5), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.5, side: THREE.DoubleSide }));
      dish.position.set(sx, 40, -118);
      dish.rotation.x = -0.55;
      dish.rotation.y = idx === 0 ? 0.3 : -0.3;
      dcGroup.add(dish);
    });

    // Waypoint Marker at Entrance
    if (window.GTAModels && window.GTAModels.createWaypointMarker) {
      const wp = window.GTAModels.createWaypointMarker('DATACENTER PARK', 0x10b981);
      wp.position.set(480, 0, -32);
      dcGroup.add(wp);
    }

    this.scene.add(dcGroup);
  }

  buildHighwayGantrySign(x, y, z) {
    const group = new THREE.Group();
    const trussMat = new THREE.MeshLambertMaterial({ color: 0x475569 });
    const postL = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 34, 8), trussMat);
    postL.position.set(-65, 17, 0);
    group.add(postL);

    const postR = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 34, 8), trussMat);
    postR.position.set(65, 17, 0);
    group.add(postR);

    const beam = new THREE.Mesh(new THREE.BoxGeometry(132, 2.5, 2.5), trussMat);
    beam.position.set(0, 32, 0);
    group.add(beam);

    const signGeo = new THREE.BoxGeometry(70, 16, 1);
    const sign = new THREE.Mesh(signGeo, new THREE.MeshLambertMaterial({ color: 0x15803d }));
    sign.position.set(0, 30, 0);
    group.add(sign);

    const scanvas = document.createElement('canvas');
    scanvas.width = 512;
    scanvas.height = 128;
    const sctx = scanvas.getContext('2d');
    sctx.fillStyle = '#15803d';
    sctx.fillRect(0, 0, 512, 128);
    sctx.strokeStyle = '#ffffff';
    sctx.lineWidth = 6;
    sctx.strokeRect(6, 6, 500, 116);
    sctx.fillStyle = '#ffffff';
    sctx.font = 'bold 26px sans-serif';
    sctx.textAlign = 'center';
    sctx.fillText('⬆️ I-95 NORTH // TECH DISTRICT // KTU MCA', 256, 48);
    sctx.fillStyle = '#fef08a';
    sctx.font = '22px sans-serif';
    sctx.fillText('HAMNA VIP TOWER EXIT 2B // NEXT RIGHT', 256, 92);

    const stex = new THREE.CanvasTexture(scanvas);
    const smesh = new THREE.Mesh(new THREE.PlaneGeometry(69, 15), new THREE.MeshBasicMaterial({ map: stex }));
    smesh.position.set(0, 30, 0.6);
    group.add(smesh);

    group.position.set(x, 0, z);
    this.scene.add(group);
  }

  // ========================================================
  // 17. PACIFIC GOLDEN BEACH & COASTLINE RESORT
  // ========================================================
  buildPacificGoldenBeach() {
    const beachGroup = new THREE.Group();

    // 1. Golden Sand Shoreline Plane (x: -540 to -780, z: 60 to 450)
    const sandTex = (window.GTATextures && typeof window.GTATextures.createBeachSand === 'function')
      ? window.GTATextures.createBeachSand()
      : null;
    if (sandTex) sandTex.repeat.set(16, 24);
    const sandMat = new THREE.MeshStandardMaterial({
      color: 0xdfbc85,
      map: sandTex,
      roughness: 0.95,
      metalness: 0.05
    });
    const sandGeo = new THREE.PlaneGeometry(240, 390);
    const sandPlane = new THREE.Mesh(sandGeo, sandMat);
    sandPlane.rotation.x = -Math.PI / 2;
    sandPlane.position.set(-660, 0.45, 255);
    sandPlane.receiveShadow = true;
    beachGroup.add(sandPlane);

    // 2. Foaming Ocean Water Edge
    const foamMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.65 });
    const foamStrip = new THREE.Mesh(new THREE.PlaneGeometry(18, 390), foamMat);
    foamStrip.rotation.x = -Math.PI / 2;
    foamStrip.position.set(-775, 0.5, 255);
    beachGroup.add(foamStrip);

    // 3. Beach Volleyball Court
    const courtGroup = new THREE.Group();
    const courtBorder = new THREE.Mesh(new THREE.PlaneGeometry(42, 24), new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true }));
    courtBorder.rotation.x = -Math.PI / 2;
    courtBorder.position.set(-620, 0.52, 210);
    courtGroup.add(courtBorder);

    const postMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.3 });
    [-13, 13].forEach(nz => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 11, 8), postMat);
      post.position.set(-620, 5.5, 210 + nz);
      courtGroup.add(post);
    });
    const netMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75, side: THREE.DoubleSide, wireframe: true });
    const net = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 26), netMat);
    net.rotation.x = -Math.PI / 2;
    net.rotation.z = Math.PI / 2;
    net.position.set(-620, 8.5, 210);
    courtGroup.add(net);

    const ball = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 12), new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 }));
    ball.position.set(-616, 2.5, 214);
    courtGroup.add(ball);
    beachGroup.add(courtGroup);

    // 4. Lifeguard Watchtower
    const towerMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 });
    const guardTower = new THREE.Group();
    [[-4, -4], [4, -4], [-4, 4], [4, 4]].forEach(sp => {
      const stilt = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 18, 6), towerMat);
      stilt.position.set(sp[0], 9, sp[1]);
      guardTower.add(stilt);
    });
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(11, 9, 11), new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.6 }));
    cabin.position.set(0, 20, 0);
    guardTower.add(cabin);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(9.5, 5, 4), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
    roof.position.set(0, 27, 0);
    roof.rotation.y = Math.PI / 4;
    guardTower.add(roof);
    const ladder = new THREE.Mesh(new THREE.BoxGeometry(2, 18, 0.4), towerMat);
    ladder.position.set(0, 9, 5.8);
    guardTower.add(ladder);
    guardTower.position.set(-690, 0, 160);
    beachGroup.add(guardTower);

    // 5. Sun Umbrellas & Beach Loungers
    const umbrellaColors = [0xef4444, 0x0284c7, 0xf59e0b, 0x10b981];
    [-700, -665, -630].forEach((ux, uidx) => {
      [270, 310, 350].forEach((uz, vzidx) => {
        const uColor = umbrellaColors[(uidx + vzidx) % umbrellaColors.length];
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 12, 6), postMat);
        pole.position.set(ux, 6, uz);
        pole.rotation.z = 0.08;
        beachGroup.add(pole);

        const shade = new THREE.Mesh(new THREE.ConeGeometry(5.5, 2.8, 12), new THREE.MeshStandardMaterial({ color: uColor, roughness: 0.5 }));
        shade.position.set(ux, 12, uz);
        beachGroup.add(shade);

        const lounger = new THREE.Mesh(new THREE.BoxGeometry(7, 0.8, 3), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 }));
        lounger.position.set(ux + 2.5, 0.8, uz - 1.5);
        lounger.rotation.y = 0.2;
        beachGroup.add(lounger);
      });
    });

    // 6. Surfboards stuck in the sand
    const surfColors = [0xf43f5e, 0x06b6d4, 0x8b5cf6];
    surfColors.forEach((sc, sidx) => {
      const board = new THREE.Mesh(new THREE.BoxGeometry(1.6, 9, 0.3), new THREE.MeshStandardMaterial({ color: sc, metalness: 0.5, roughness: 0.2 }));
      board.position.set(-720 + sidx * 6, 4.2, 120 + sidx * 5);
      board.rotation.z = 0.22;
      board.rotation.y = 0.4;
      beachGroup.add(board);
    });

    this.scene.add(beachGroup);
  }

  // ========================================================
  // 18. GOLDEN GATEWAY GRAND SUSPENSION BRIDGE (PALAM)
  // ========================================================
  buildGoldenGatewayBridge() {
    const bridgeGroup = new THREE.Group();
    const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;

    const towerMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4, metalness: 0.6, envMap });
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7, metalness: 0.2 });
    const cableMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.8 });
    const railMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3, metalness: 0.7 });

    // 1. Elevated Bridge Roadway Deck (Width: 54, Length: 240, Elevation: y = 12, x = -560)
    const roadDeck = new THREE.Mesh(new THREE.BoxGeometry(54, 4.5, 240), deckMat);
    roadDeck.position.set(-560, 12, 0);
    bridgeGroup.add(roadDeck);

    // Asphalt surface layer with highway road markings
    const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.75 });
    const asphalt = new THREE.Mesh(new THREE.PlaneGeometry(50, 240), asphaltMat);
    asphalt.rotation.x = -Math.PI / 2;
    asphalt.position.set(-560, 14.3, 0);
    bridgeGroup.add(asphalt);

    // Center divider strip
    const centerLine = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 240), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
    centerLine.rotation.x = -Math.PI / 2;
    centerLine.position.set(-560, 14.35, 0);
    bridgeGroup.add(centerLine);

    // Safety Side Barriers
    [-26, 26].forEach(rx => {
      const barrier = new THREE.Mesh(new THREE.BoxGeometry(2, 4.2, 240), railMat);
      barrier.position.set(-560 + rx, 15.5, 0);
      bridgeGroup.add(barrier);
    });

    // 2. Driveable Approach Incline Ramps (Connects coastal highway up to bridge deck)
    // South Ramp: z = 120 to 200, slopes from y = 12 down to y = 0.5
    const southRamp = new THREE.Mesh(new THREE.BoxGeometry(54, 3.5, 82), deckMat);
    southRamp.position.set(-560, 6.2, 160);
    southRamp.rotation.x = -0.145;
    bridgeGroup.add(southRamp);

    const southAsphalt = new THREE.Mesh(new THREE.PlaneGeometry(50, 82), asphaltMat);
    southAsphalt.position.set(-560, 8.0, 160);
    southAsphalt.rotation.x = -Math.PI / 2 - 0.145;
    bridgeGroup.add(southAsphalt);

    // North Ramp: z = -120 to -200, slopes from y = 12 down to y = 0.5
    const northRamp = new THREE.Mesh(new THREE.BoxGeometry(54, 3.5, 82), deckMat);
    northRamp.position.set(-560, 6.2, -160);
    northRamp.rotation.x = 0.145;
    bridgeGroup.add(northRamp);

    const northAsphalt = new THREE.Mesh(new THREE.PlaneGeometry(50, 82), asphaltMat);
    northAsphalt.position.set(-560, 8.0, -160);
    northAsphalt.rotation.x = -Math.PI / 2 + 0.145;
    bridgeGroup.add(northAsphalt);

    // 3. 2 Massive Red Suspension Towers (Tower North at z = -70, Tower South at z = 70)
    [-70, 70].forEach(tz => {
      const tGroup = new THREE.Group();
      [-24, 24].forEach(tx => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(6, 85, 6), towerMat);
        leg.position.set(-560 + tx, 42.5, tz);
        tGroup.add(leg);
      });
      const topBeam = new THREE.Mesh(new THREE.BoxGeometry(54, 8, 7), towerMat);
      topBeam.position.set(-560, 80, tz);
      tGroup.add(topBeam);
      const midBeam = new THREE.Mesh(new THREE.BoxGeometry(54, 5, 5), towerMat);
      midBeam.position.set(-560, 50, tz);
      tGroup.add(midBeam);

      const bLight = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 12), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      bLight.position.set(-560, 86, tz);
      tGroup.add(bLight);

      bridgeGroup.add(tGroup);
    });

    // Main Suspension Cables
    [-24, 24].forEach(cx => {
      const cableGeo = new THREE.CylinderGeometry(0.8, 0.8, 250, 8);
      const cable = new THREE.Mesh(cableGeo, cableMat);
      cable.position.set(-560 + cx, 46, 0);
      cable.rotation.x = Math.PI / 2;
      bridgeGroup.add(cable);

      for (let sz = -100; sz <= 100; sz += 20) {
        const suspender = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 28, 6), cableMat);
        suspender.position.set(-560 + cx, 28, sz);
        bridgeGroup.add(suspender);
      }
    });

    this.scene.add(bridgeGroup);
  }

  // ========================================================
  // 19. METROPOLITAN SPORTS ARENA & ATHLETIC STADIUM
  // ========================================================
  buildMetropolitanSportsArena() {
    const arenaGroup = new THREE.Group();

    // 1. Lush Green Turf Football Pitch (x: -260, z: 390, size: 130 x 75)
    const pitchMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.85 });
    const pitch = new THREE.Mesh(new THREE.PlaneGeometry(130, 75), pitchMat);
    pitch.rotation.x = -Math.PI / 2;
    pitch.position.set(-260, 0.5, 390);
    arenaGroup.add(pitch);

    // White Football Markings
    const outline = new THREE.Mesh(new THREE.PlaneGeometry(122, 68), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }));
    outline.rotation.x = -Math.PI / 2;
    outline.position.set(-260, 0.52, 390);
    arenaGroup.add(outline);

    const halfLine = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 68), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    halfLine.rotation.x = -Math.PI / 2;
    halfLine.position.set(-260, 0.53, 390);
    arenaGroup.add(halfLine);

    const centerCircle = new THREE.Mesh(new THREE.RingGeometry(11, 12, 32), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    centerCircle.rotation.x = -Math.PI / 2;
    centerCircle.position.set(-260, 0.54, 390);
    arenaGroup.add(centerCircle);

    // Regulation Goalposts at both ends
    const postMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.8, roughness: 0.2 });
    [-320, -200].forEach((gx, idx) => {
      const gGroup = new THREE.Group();
      [-6, 6].forEach(gz => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 8, 8), postMat);
        post.position.set(gx, 4, 390 + gz);
        gGroup.add(post);
      });
      const cross = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 12.4, 8), postMat);
      cross.rotation.x = Math.PI / 2;
      cross.position.set(gx, 8, 390);
      gGroup.add(cross);
      const net = new THREE.Mesh(new THREE.BoxGeometry(4, 7.8, 12), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.6 }));
      net.position.set(gx + (idx === 0 ? -2 : 2), 4, 390);
      gGroup.add(net);
      arenaGroup.add(gGroup);
    });

    // 2. Full Basketball Court Section (East of pitch)
    const bCourtMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.7 });
    const bCourt = new THREE.Mesh(new THREE.PlaneGeometry(40, 26), bCourtMat);
    bCourt.rotation.x = -Math.PI / 2;
    bCourt.position.set(-170, 0.52, 390);
    arenaGroup.add(bCourt);

    [-188, -152].forEach((bx, bidx) => {
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 12, 8), postMat);
      stand.position.set(bx, 6, 390);
      arenaGroup.add(stand);

      const board = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4, 6), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }));
      board.position.set(bx + (bidx === 0 ? 1.5 : -1.5), 11, 390);
      arenaGroup.add(board);

      const rim = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.15, 8, 16), new THREE.MeshBasicMaterial({ color: 0xea580c }));
      rim.rotation.x = Math.PI / 2;
      rim.position.set(bx + (bidx === 0 ? 2.8 : -2.8), 9.8, 390);
      arenaGroup.add(rim);
    });

    // 3. Grandstand Spectator Bleachers (North of pitch at z = 340)
    const bleacherMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6, roughness: 0.4 });
    const bleacher = new THREE.Group();
    for (let row = 0; row < 5; row++) {
      const tier = new THREE.Mesh(new THREE.BoxGeometry(130, 1.8, 4), bleacherMat);
      tier.position.set(-260, 1.2 + row * 1.8, 345 - row * 3.8);
      bleacher.add(tier);

      const seatColor = row % 2 === 0 ? 0xef4444 : 0x0284c7;
      const seat = new THREE.Mesh(new THREE.BoxGeometry(126, 1.2, 3), new THREE.MeshStandardMaterial({ color: seatColor, roughness: 0.5 }));
      seat.position.set(-260, 2.3 + row * 1.8, 345 - row * 3.8);
      bleacher.add(seat);
    }
    arenaGroup.add(bleacher);

    // 4. Tall Stadium Floodlight Towers (4 corners)
    [[-325, 345], [-155, 345], [-325, 435], [-155, 435]].forEach(fp => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.4, 42, 8), postMat);
      pole.position.set(fp[0], 21, fp[1]);
      arenaGroup.add(pole);

      const lightHead = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 1.5), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      lightHead.position.set(fp[0], 43, fp[1]);
      arenaGroup.add(lightHead);
    });

    this.scene.add(arenaGroup);
  }

  // ========================================================
  // 20. ACADEMIC & PROFESSIONAL CERTIFICATES EXHIBITION PAVILION
  // ========================================================
  buildCertificatesAndHonorsPavilion() {
    const certGroup = new THREE.Group();
    const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;

    const marbleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.1, envMap });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.25, metalness: 0.9, envMap });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.05, metalness: 0.9, transparent: true, opacity: 0.75, envMap });

    // Grand Marble Pavilion Hall (x: 220, z: 390)
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(76, 2.5, 56), marbleMat);
    plinth.position.set(220, 1.25, 390);
    certGroup.add(plinth);

    // Facade Columns
    [-32, -16, 0, 16, 32].forEach(colX => {
      const column = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.0, 22, 16), marbleMat);
      column.position.set(220 + colX, 12, 365);
      certGroup.add(column);
    });

    const roof = new THREE.Mesh(new THREE.BoxGeometry(76, 2.5, 56), marbleMat);
    roof.position.set(220, 23.5, 390);
    certGroup.add(roof);

    const skylight = new THREE.Mesh(new THREE.ConeGeometry(24, 8, 4), glassMat);
    skylight.position.set(220, 28, 390);
    skylight.rotation.y = Math.PI / 4;
    certGroup.add(skylight);

    // 3D Visual Framed Certificates inside Hall
    const certList = [
      { title: "KTU MCA DEGREE", sub: "APJ Abdul Kalam Tech University // Master of Computer Applications", color: "#38bdf8", zOff: -12 },
      { title: "CALICUT BCA HONORS", sub: "University of Calicut // Bachelor of Computer Applications 1st Class", color: "#f59e0b", zOff: 0 },
      { title: "COGNILEARN R&D", sub: "Python 3 & Django Enterprise Web Applications Architecture", color: "#10b981", zOff: 12 }
    ];

    certList.forEach((cItem, cIdx) => {
      const pX = 220 + (cIdx - 1) * 22;
      const pedestal = new THREE.Mesh(new THREE.BoxGeometry(8, 5, 8), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 }));
      pedestal.position.set(pX, 4.5, 390 + cItem.zOff);
      certGroup.add(pedestal);

      const frame = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 0.6), goldMat);
      frame.position.set(pX, 11, 390 + cItem.zOff);
      frame.rotation.x = -0.15;
      certGroup.add(frame);

      const cCanvas = document.createElement('canvas');
      cCanvas.width = 512; cCanvas.height = 384;
      const cctx = cCanvas.getContext('2d');
      cctx.fillStyle = '#f8fafc'; cctx.fillRect(0, 0, 512, 384);
      cctx.strokeStyle = cItem.color; cctx.lineWidth = 14;
      cctx.strokeRect(12, 12, 488, 360);
      cctx.fillStyle = '#0f172a'; cctx.font = '900 36px sans-serif'; cctx.textAlign = 'center';
      cctx.fillText(cItem.title, 256, 75);
      cctx.fillStyle = '#64748b'; cctx.font = '600 22px sans-serif';
      cctx.fillText('OFFICIAL CREDENTIAL // FATHIMA HAMNA K', 256, 125);
      cctx.fillStyle = '#1e293b'; cctx.font = '700 24px sans-serif';
      cctx.fillText(cItem.sub.substring(0, 32), 256, 180);
      cctx.fillText(cItem.sub.substring(32), 256, 215);
      cctx.fillStyle = '#f59e0b'; cctx.font = '900 48px sans-serif';
      cctx.fillText('★ ★ ★ ★ ★', 256, 290);
      cctx.fillStyle = '#10b981'; cctx.font = '700 20px monospace';
      cctx.fillText('VERIFIED & AUTHENTICATED // HONORS', 256, 340);

      const cTex = new THREE.CanvasTexture(cCanvas);
      const cMesh = new THREE.Mesh(new THREE.PlaneGeometry(9.2, 7.2), new THREE.MeshBasicMaterial({ map: cTex }));
      cMesh.position.set(pX, 11, 390 + cItem.zOff + 0.35);
      cMesh.rotation.x = -0.15;
      certGroup.add(cMesh);
    });

    const trophyBase = new THREE.Mesh(new THREE.CylinderGeometry(2, 2.5, 3, 12), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    trophyBase.position.set(220, 8, 390);
    certGroup.add(trophyBase);
    const trophyCup = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 0.8, 5, 12), goldMat);
    trophyCup.position.set(220, 12, 390);
    certGroup.add(trophyCup);

    // Interactive Ground Waypoint
    if (window.GTAModels && window.GTAModels.createGTAWaypoint) {
      const wp = window.GTAModels.createGTAWaypoint({
        x: 220, y: 0.5, z: 360,
        colorHex: '#f59e0b', colorNum: 0xf59e0b,
        icon: '🏆', title: 'Certificates Pavilion'
      });
      certGroup.add(wp);
    }

    this.scene.add(certGroup);
  }

  // ========================================================
  // 20B. HAMNA LUXURY MOTORSPORTS // EXOTIC & VINTAGE SHOWROOM
  // ========================================================
  buildHamnaLuxuryShowroom() {
    const showroomGroup = new THREE.Group();
    const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;

    const graniteMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.15, metalness: 0.85, envMap });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x0284c7, roughness: 0.04, metalness: 0.95, transparent: true, opacity: 0.65, envMap });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.25, metalness: 0.9, envMap });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.08, metalness: 0.98, envMap });

    // 1. Showroom Main Plinth & Floor (x: -200, z: 130, size: 85 x 95)
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(85, 2.0, 95), graniteMat);
    plinth.position.set(-200, 1.0, 130);
    plinth.receiveShadow = true;
    showroomGroup.add(plinth);

    // 2. Glass Atrium Curtain Walls (Curved front, glass sides)
    const glassFacade = new THREE.Mesh(new THREE.BoxGeometry(84, 22, 94), glassMat);
    glassFacade.position.set(-200, 12, 130);
    showroomGroup.add(glassFacade);

    // 3. Golden Roof Fascia & Crown Canopy
    const roof = new THREE.Mesh(new THREE.BoxGeometry(88, 3.2, 98), goldMat);
    roof.position.set(-200, 23.5, 130);
    showroomGroup.add(roof);

    // 4. Illuminated Showroom Facade Neon Sign
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 1024; signCanvas.height = 256;
    const sctx = signCanvas.getContext('2d');
    sctx.fillStyle = '#020617'; sctx.fillRect(0, 0, 1024, 256);
    sctx.strokeStyle = '#f59e0b'; sctx.lineWidth = 10; sctx.strokeRect(8, 8, 1008, 240);
    sctx.fillStyle = '#f59e0b'; sctx.font = '900 44px "Orbitron", sans-serif'; sctx.textAlign = 'center';
    sctx.fillText('HAMNA LUXURY MOTORSPORTS', 512, 105);
    sctx.fillStyle = '#f8fafc'; sctx.font = 'bold 30px "JetBrains Mono", monospace';
    sctx.fillText('EXOTIC & VINTAGE CAR SHOWROOM // 2026 EDITION', 512, 180);

    const signTex = new THREE.CanvasTexture(signCanvas);
    const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(62, 15.5), new THREE.MeshBasicMaterial({ map: signTex }));
    signMesh.position.set(-200, 24.0, 179.5);
    showroomGroup.add(signMesh);

    // 5. Central Motorized Rotating Turntable with Spotlight
    const turntableGeo = new THREE.CylinderGeometry(14, 14.5, 1.2, 32);
    const turntableMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.2, metalness: 0.9, envMap });
    this.showroomTurntable = new THREE.Mesh(turntableGeo, turntableMat);
    this.showroomTurntable.position.set(-200, 2.4, 130);
    showroomGroup.add(this.showroomTurntable);

    // Flagship Display Supercar on Turntable (Audi R8 V10 Plus or Rolls-Royce Phantom)
    if (window.GTARealisticEntities && window.GTARealisticEntities.createAudiR8Supercar) {
      const displayCar = window.GTARealisticEntities.createAudiR8Supercar(0xdc2626, envMap);
      displayCar.position.set(0, 0.6, 0);
      this.showroomTurntable.add(displayCar);
    } else if (window.GTAModelLoader && window.GTAModelLoader.createRealSupercar) {
      const displayCar = window.GTAModelLoader.createRealSupercar(0xf59e0b, envMap);
      displayCar.position.set(0, 0.6, 0);
      this.showroomTurntable.add(displayCar);
    }

    // 6. Overhead Showroom Spotlights
    [-212, -188].forEach(sx => {
      [118, 142].forEach(sz => {
        const spot = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.4, 2.2, 12), chromeMat);
        spot.position.set(sx, 21.5, sz);
        showroomGroup.add(spot);
        const glow = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 12), new THREE.MeshBasicMaterial({ color: 0xfffaed }));
        glow.position.set(sx, 20.2, sz);
        showroomGroup.add(glow);
      });
    });

    // 7. 6 Outdoor Elevated Exhibition Display Podiums (Showcasing Lineup: Benz, BMW, Rolls-Royce, Audi, Innova, Tesla)
    const outdoorCars = [
      { id: 'benz', col: 0x18181b, x: -242, z: 95, fn: 'createMercedesBenzGWagon', name: 'Mercedes-Benz G63 AMG' },
      { id: 'bmw', col: 0x0284c7, x: -242, z: 165, fn: 'createBmwM4Competition', name: 'BMW M4 Competition Coupe' },
      { id: 'rollsroyce', col: 0x090d16, x: -158, z: 95, fn: 'createRollsRoycePhantom', name: 'Rolls-Royce Phantom VIII' },
      { id: 'audi', col: 0xf59e0b, x: -158, z: 165, fn: 'createAudiR8Supercar', name: 'Audi R8 V10 Plus Quattro' },
      { id: 'innova', col: 0xe2e8f0, x: -200, z: 65, fn: 'createToyotaInnovaCrysta', name: 'Toyota Innova Crysta MPV' },
      { id: 'tesla', col: 0xdc2626, x: -200, z: 195, fn: 'createTeslaModelSPlaid', name: 'Tesla Model S Plaid AWD' }
    ];

    outdoorCars.forEach(oc => {
      const pad = new THREE.Mesh(new THREE.BoxGeometry(18, 1.2, 26), graniteMat);
      pad.position.set(oc.x, 1.2, oc.z);
      pad.receiveShadow = false;
      showroomGroup.add(pad);

      const padBorder = new THREE.Mesh(new THREE.BoxGeometry(18.8, 0.4, 26.8), goldMat);
      padBorder.position.set(oc.x, 0.6, oc.z);
      showroomGroup.add(padBorder);

      if (window.GTARealisticEntities && typeof window.GTARealisticEntities[oc.fn] === 'function') {
        const carMesh = window.GTARealisticEntities[oc.fn](oc.col, envMap);
        carMesh.position.set(oc.x, 1.8, oc.z);
        carMesh.rotation.y = (oc.z > 130 ? 0 : Math.PI);
        showroomGroup.add(carMesh);
      }
    });

    // 8. Interactive Entrance Waypoint Pillar
    if (window.GTAModels && window.GTAModels.createGTAWaypoint) {
      const wp = window.GTAModels.createGTAWaypoint({
        x: -200, y: 0.5, z: 182,
        colorHex: '#f59e0b', colorNum: 0xf59e0b,
        icon: '🏎️', title: 'Car Showroom Entrance'
      });
      showroomGroup.add(wp);
    }

    this.scene.add(showroomGroup);
  }

  // ========================================================
  // 21. METROPOLIS BOUNDARY SYSTEM (PHYSICAL WALLS & OCEAN BARRIERS)
  // ========================================================
  buildMetropolisBoundarySystem() {
    const boundaryGroup = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85, metalness: 0.2 });

    // East Concrete Security Wall (x = 590, z = -750 to 680)
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(8, 28, 1430), wallMat);
    eastWall.position.set(590, 14, -35);
    boundaryGroup.add(eastWall);

    // South Perimeter Highway Wall (z = 680, x = -750 to 590)
    const southWall = new THREE.Mesh(new THREE.BoxGeometry(1340, 28, 8), wallMat);
    southWall.position.set(-80, 14, 680);
    boundaryGroup.add(southWall);

    // West Pacific Ocean Sea Barrier Rocks (x = -750)
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.95 });
    for (let rz = -700; rz <= 650; rz += 80) {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(18, 1), rockMat);
      rock.position.set(-750, 6, rz);
      rock.scale.set(1.4, 1.8, 2.2);
      boundaryGroup.add(rock);
    }

    // North Mountain Border Range Barrier (z = -745)
    const northBarrier = new THREE.Mesh(new THREE.BoxGeometry(1340, 45, 12), wallMat);
    northBarrier.position.set(-80, 22.5, -745);
    boundaryGroup.add(northBarrier);

    this.scene.add(boundaryGroup);
  }

  // ========================================================
  // 22. HAMNA PHOTO VILLAGE ENTRANCE BOARDS & PYLONS
  // ========================================================
  createHamnaVillagePortal(x, y, z, rotY, villageName, villageDesc, badgeText, themeColorHex = 0xf59e0b) {
    const portalGroup = new THREE.Group();

    const baseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8, metalness: 0.3 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(28, 2.5, 6), baseMat);
    base.position.y = 1.25;
    portalGroup.add(base);

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.8 });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(26, 22, 3), frameMat);
    frame.position.y = 13.5;
    portalGroup.add(frame);

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 1024, 512);
    grad.addColorStop(0, '#090d16');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    const colorStr = typeof themeColorHex === 'string' ? themeColorHex : '#' + themeColorHex.toString(16).padStart(6, '0');
    ctx.strokeStyle = colorStr;
    ctx.lineWidth = 12;
    ctx.strokeRect(10, 10, 1004, 492);

    ctx.fillStyle = colorStr;
    ctx.fillRect(20, 24, 520, 48);
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 26px sans-serif';
    ctx.fillText('FATHIMA HAMNA K // ' + badgeText, 35, 58);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px sans-serif';
    ctx.fillText(villageName, 40, 140);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 26px sans-serif';
    ctx.fillText(villageDesc, 40, 195);

    // Draw Hamna Real Photo with gold ring on right side
    const img = new Image();
    img.src = 'assets/hamna_real.jpg';
    const drawContent = () => {
      try {
        ctx.save();
        ctx.beginPath();
        ctx.arc(840, 256, 175, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 665, 81, 350, 350);
        ctx.restore();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(840, 256, 175, 0, Math.PI * 2);
        ctx.stroke();
      } catch (e) {}
      texture.needsUpdate = true;
    };
    if (img.complete) {
      drawContent();
    } else {
      img.onload = drawContent;
    }

    const texture = new THREE.CanvasTexture(canvas);
    const signMat = new THREE.MeshBasicMaterial({ map: texture });
    const signPlane = new THREE.Mesh(new THREE.PlaneGeometry(24, 18), signMat);
    signPlane.position.set(0, 14, 1.55);
    portalGroup.add(signPlane);

    const signPlaneBack = new THREE.Mesh(new THREE.PlaneGeometry(24, 18), signMat);
    signPlaneBack.position.set(0, 14, -1.55);
    signPlaneBack.rotation.y = Math.PI;
    portalGroup.add(signPlaneBack);

    const neonBar = new THREE.Mesh(new THREE.BoxGeometry(26, 0.8, 3.2), new THREE.MeshBasicMaterial({ color: themeColorHex }));
    neonBar.position.y = 25;
    portalGroup.add(neonBar);

    portalGroup.position.set(x, y, z);
    portalGroup.rotation.y = rotY;
    this.scene.add(portalGroup);
    return portalGroup;
  }

  buildVillageEntrancePylons() {
    // 1. Academic Education Village (KTU MCA & Calicut BCA Campus Entrance)
    this.createHamnaVillagePortal(-120, 0, -360, Math.PI / 2, 'ACADEMIC EDUCATION VILLAGE', 'APJ KTU MCA Postgraduate & Calicut BCA Honors', 'SCHOLAR // MCA', 0x38bdf8);
    // 2. Fullstack & Tech Skills Village (Silicon Matrix Entrance)
    this.createHamnaVillagePortal(-75, 0, -120, Math.PI / 2, 'TECH SKILLS VILLAGE', 'Python 3, Django, Frontend, MySQL & Core CS', 'FULLSTACK // DEV', 0x7c3aed);
    // 3. Corporate Experience Tech Park (Cognilearn & Softroniics Entrance)
    this.createHamnaVillagePortal(100, 0, -125, -Math.PI / 2, 'EXPERIENCE TECH PARK', 'Cognilearn R&D Software & Softroniics Web Labs', 'ENGINEER // INTERN', 0x10b981);
    // 4. Major Innovation Projects Village (Collab-Hub & Trendrove AI Entrance)
    this.createHamnaVillagePortal(100, 0, 250, -Math.PI / 2, 'PROJECTS & INNOVATION', 'Collab-Hub Venture Platform & Trendrove AI Studio', 'ARCHITECT // FOUNDER', 0xdb2777);
    // 5. Certificates & Honors Pavilion
    this.createHamnaVillagePortal(150, 0, 390, -Math.PI / 2, 'CERTIFICATES & HONORS', 'KTU MCA Degree, BCA 1st Class & Tech Credentials', 'HONORS // VERIFIED', 0xf59e0b);
    // 6. Hamna Heritage Residence & Villa
    this.createHamnaVillagePortal(-110, 0, -125, Math.PI / 2, 'HAMNA RESIDENCE & BIO', 'Fathima Hamna K // Profile, Heritage & Portfolio HQ', 'CHIEF ARCHITECT', 0xf59e0b);
    // 7. Pacific Golden Beach & Resort
    this.createHamnaVillagePortal(-540, 0, 160, -Math.PI / 2, 'PACIFIC GOLDEN BEACH', 'Ocean Boardwalk Pier, Ferris Wheel & Marina Resort', 'PACIFIC RESORT', 0x0284c7);
    // 8. Golden Gateway Suspension Bridge
    this.createHamnaVillagePortal(-560, 0, -170, 0, 'GOLDEN GATEWAY BRIDGE', 'Grand Suspension Highway crossing Pacific Channel', 'CIVIC TRANSIT', 0xef4444);
    // 9. Metropolitan Sports Arena & Playground
    this.createHamnaVillagePortal(-280, 0, 400, 0, 'SPORTS ARENA & PLAYGROUND', 'Football Field, Basketball Courts & Athletic Bleachers', 'ATHLETICS // ARENA', 0x15803d);
    // 10. Metro Police Precinct & Headquarters
    this.createHamnaVillagePortal(130, 0, -425, 0, 'METRO POLICE PRECINCT', 'Highway Patrol Division 9 & V8 Interceptor Fleet', 'LAW ENFORCEMENT', 0x2563eb);
  }

  // ========================================================
  // 23. LIVE LOCATION GUIDANCE IN TOP GREEN HUD BAR
  // ========================================================
  updateLocationHUD() {
    const tracker = document.getElementById('current-quest-title');
    if (!tracker) return;

    const isPolice = (this.currentVehicle === 'police');
    const checkPos = this.isDriving ? (isPolice ? this.policeCarPos : this.carPos) : this.playerPos;

    let currentDistrict = null;
    let shortestDist = Infinity;

    const zones = [
      { id: 'ktu', name: '🎓 ACADEMIC EDUCATION VILLAGE', desc: 'APJ KTU MCA Campus & Calicut BCA Hall', x: -200, z: -360, r: 160 },
      { id: 'skills', name: '⚡ FULLSTACK SKILLS VILLAGE', desc: 'Python 3, Django, Frontend & MySQL Core', x: -120, z: -120, r: 120 },
      { id: 'exp', name: '💼 EXPERIENCE TECH PARK', desc: 'Cognilearn R&D & Softroniics Software Labs', x: 280, z: -125, r: 140 },
      { id: 'projects', name: '🚀 MAJOR PROJECTS VILLAGE', desc: 'Collab-Hub Venture Platform & Trendrove AI', x: 320, z: 250, r: 140 },
      { id: 'certs', name: '🏆 CERTIFICATES & HONORS PAVILION', desc: 'KTU MCA Degree, BCA Honors & Credentials [E]', x: 220, z: 390, r: 100 },
      { id: 'profile', name: '🏠 HAMNA HERITAGE RESIDENCE', desc: 'Fathima Hamna K // Profile & Portfolio Bio [E]', x: -320, z: -125, r: 110 },
      { id: 'showroom', name: '🏎️ HAMNA LUXURY SHOWROOM', desc: 'Mercedes-Benz, BMW, Rolls-Royce, Audi, Innova, Tesla [C/E]', x: -200, z: 130, r: 100 },
      { id: 'beach', name: '🏖️ PACIFIC GOLDEN BEACH', desc: 'Ocean Shoreline, Boardwalk Pier & Marina [E]', x: -640, z: 200, r: 160 },
      { id: 'bridge', name: '🌉 GOLDEN GATEWAY BRIDGE', desc: 'Grand Suspension Bridge crossing Pacific Channel', x: -560, z: 0, r: 140 },
      { id: 'sports', name: '⚽ SPORTS ARENA & PLAYGROUND', desc: 'Football Pitch, Basketball Courts & Bleachers [E]', x: -260, z: 390, r: 130 },
      { id: 'police', name: '🚔 METRO POLICE PRECINCT', desc: 'V8 Interceptor Cruiser Fleet & Helipad [F]', x: 130, z: -565, r: 100 },
      { id: 'vip', name: '🏢 HAMNA VIP TOWER', desc: 'Level 88 Penthouse & Executive Skycabin [E]', x: 180, z: -125, r: 95 },
      { id: 'silicon', name: '🏙️ SILICON FINANCIAL TOWERS', desc: 'Hamna AI Cloud Supercomputing & Skybridge [E]', x: 380, z: 390, r: 120 },
      { id: 'datacenter', name: '💻 DEVOPS DATACENTER', desc: 'Tier-4 Server Farm & Satellite Uplink [E]', x: 320, z: -370, r: 110 },
      { id: 'park', name: '🌊 CENTRAL PARK & WATERFALL', desc: 'Cascading Waterfalls & Pine Lakeside [E]', x: -360, z: 125, r: 100 },
      { id: 'workshop', name: '🔧 CUSTOMS AUTO WORKSHOP', desc: '24/7 Chassis Repair, Towing & Paint Booth [E]', x: -190, z: -125, r: 90 },
      { id: 'space', name: '✈️ SPACEPORT ROCKET PAD', desc: 'Orbital Rocket Gantry & Launch Runway [E]', x: 640, z: 0, r: 110 }
    ];

    for (let i = 0; i < zones.length; i++) {
      const z = zones[i];
      const d = Math.hypot(checkPos.x - z.x, checkPos.z - z.z);
      if (d < z.r && d < shortestDist) {
        shortestDist = d;
        currentDistrict = z;
      }
    }

    let text = '';
    if (currentDistrict) {
      text = `📍 NOW IN: ${currentDistrict.name} // ${currentDistrict.desc}`;
    } else if (this.isDriving) {
      const vName = isPolice ? 'POLICE INTERCEPTOR' : 'GROTTI TURISMO R';
      const speedVal = Math.round(Math.abs(isPolice ? this.policeCarSpeed : this.carSpeed) * 26);
      text = `🛣️ CRUISING IN ${vName} // Highway Speed: ${speedVal} KM/H // Approach any Village`;
    } else {
      text = `🧭 METROPOLIS EXPLORATION // Follow Highway to Villages, Beach, Bridge or Arena`;
    }

    if (this._lastLocationHUDText !== text) {
      tracker.textContent = text;
      this._lastLocationHUDText = text;
    }
  }

  buildHighwayStreetlamps() {
    for (let z = -900; z <= 900; z += 180) {
      [-65, 65].forEach(x => {
        if (window.GTAModels) {
          const lamp = window.GTAModels.createHighwayStreetlight();
          lamp.position.set(x, 0, z);
          if (x > 0) lamp.rotation.y = Math.PI;
          this.scene.add(lamp);
        }
      });
    }
  }

  // 6. Airport & Space Launchpad
  buildAirportSpaceport() {
    if (window.GTAModels && window.GTAModels.createInternationalSpaceport) {
      this.spaceport = window.GTAModels.createInternationalSpaceport();
      this.spaceport.position.set(600, 0, 0);
      this.scene.add(this.spaceport);
    } else {
      const group = new THREE.Group();
      const runway = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 700),
        new THREE.MeshLambertMaterial({ color: 0x0f172a })
      );
      runway.rotation.x = -Math.PI / 2;
      runway.position.set(0, 0.4, 0);
      group.add(runway);
      group.position.set(600, 0, 0);
      this.scene.add(group);
    }

    // GTA 5 Ground Waypoint & Spaceport Directory Totem
    if (window.GTAModels && window.GTAModels.createGTAWaypoint) {
      const wp = window.GTAModels.createGTAWaypoint({
        x: 600, y: 0.5, z: 0,
        colorHex: '#d97706', colorNum: 0xd97706,
        icon: '✈️', title: 'International Spaceport'
      });
      this.scene.add(wp);
    }

    if (window.GTAModels && window.GTAModels.createBuildingTotemSign) {
      const totem = window.GTAModels.createBuildingTotemSign(
        'LOS SANTOS INTERNATIONAL',
        'ORBITAL SPACEPORT & AEROSPACE RESEARCH RUNWAY',
        'SPACEPORT',
        'gold'
      );
      totem.position.set(530, 0, 0);
      this.scene.add(totem);
    }
  }

  // 7. Coastal Lighthouse
  buildLighthouseLandmark() {
    if (window.GTAModels && window.GTAModels.createCoastalLighthouse) {
      this.lighthouse = window.GTAModels.createCoastalLighthouse();
      this.lighthouse.position.set(-550, 0, 0);
      this.scene.add(this.lighthouse);
    } else {
      const group = new THREE.Group();
      const tower = new THREE.Mesh(
        new THREE.CylinderGeometry(10, 18, 85, 12),
        new THREE.MeshLambertMaterial({ color: 0xef4444 })
      );
      tower.position.set(0, 42.5, 0);
      group.add(tower);
      group.position.set(-550, 0, 0);
      this.scene.add(group);
    }

    // GTA 5 Ground Waypoint & Lighthouse Directory Totem
    if (window.GTAModels && window.GTAModels.createGTAWaypoint) {
      const wp = window.GTAModels.createGTAWaypoint({
        x: -550, y: 0.5, z: 0,
        colorHex: '#ef4444', colorNum: 0xef4444,
        icon: '🗼', title: 'Coastal Lighthouse & Dev Uplink'
      });
      this.scene.add(wp);
    }

    if (window.GTAModels && window.GTAModels.createBuildingTotemSign) {
      const totem = window.GTAModels.createBuildingTotemSign(
        'PACIFIC LIGHTHOUSE',
        'OFFSHORE RADAR UPLINK // TERMINAL [E]',
        'BEACON',
        'azure'
      );
      totem.position.set(-515, 0, 0);
      this.scene.add(totem);
    }
  }

  createFloatingLabel(parent, text, x, y, z) {
    // Purged: All 2D floating billboard labels replaced with GTA 5 ground waypoints & 3D architectural signage
    return null;
  }

  // Playable Character (Hamna) - Photorealistic 3D Human Model with Face Texture
  buildPlayerCharacter() {
    const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;
    if (window.GTAModelLoader && window.GTAModelLoader.templates && window.GTAModelLoader.templates.character) {
      this.player = window.GTAModelLoader.createRealHamnaCharacter(envMap);
    } else if (window.GTAModels) {
      this.player = window.GTAModels.createPlayerCharacter();
    } else {
      this.player = new THREE.Group();
    }
    this.player.position.set(this.playerPos.x, 0, this.playerPos.z);
    this.player.rotation.y = this.playerRot;
    this.scene.add(this.player);
  }

  // Bustling Pedestrians in City, Park & University Campus
  buildPedestrians() {
    const colors = [0xef4444, 0x10b981, 0x3b82f6, 0x8b5cf6, 0xf59e0b, 0x0284c7, 0xd97706, 0xec4899];

    // 1. Campus Students (Collegiate Quad & Walkways)
    for (let i = 0; i < 28; i++) {
      const col = colors[i % colors.length];
      const student = this.createPedestrianMesh(0x1e293b, col, true);
      const px = -110 + Math.random() * 220;
      const pz = -630 + Math.random() * 190;
      student.position.set(px, 0, pz);
      student.userData = {
        vx: (Math.random() - 0.5) * 0.45,
        vz: (Math.random() - 0.5) * 0.45,
        minX: -140, maxX: 140,
        minZ: -640, maxZ: -440,
        leftLeg: student.userData.leftLeg,
        rightLeg: student.userData.rightLeg,
        leftArm: student.userData.leftArm,
        rightArm: student.userData.rightArm
      };
      this.scene.add(student);
      this.pedestrians.push(student);
    }

    // 2. City & Park Pedestrians
    for (let i = 0; i < 20; i++) {
      const col = colors[i % colors.length];
      const ped = this.createPedestrianMesh(0x334155, col, false);
      const px = -240 + Math.random() * 480;
      const pz = -160 + Math.random() * 360;
      ped.position.set(px, 0, pz);
      ped.userData = {
        vx: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.4,
        minX: -360, maxX: 360,
        minZ: -360, maxZ: 360,
        leftLeg: ped.userData.leftLeg,
        rightLeg: ped.userData.rightLeg,
        leftArm: ped.userData.leftArm,
        rightArm: ped.userData.rightArm
      };
      this.scene.add(ped);
      this.pedestrians.push(ped);
    }
  }

  // Authentic Mercedes-Benz G63 AMG 4MATIC V8 (User Preferred Real Brand)
  buildSportsCar() {
    const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;
    if (window.GTARealisticEntities && window.GTARealisticEntities.createMercedesBenzGWagon) {
      this.car = window.GTARealisticEntities.createMercedesBenzGWagon(0x18181b, envMap);
      this.car.userData.isRealGLB = true;
      this.car.userData.customModel = 'benz';
      this.carMaxSpeed = 9.0;
      this.carAcceleration = 0.23;
    } else if (window.GTAModelLoader && window.GTAModelLoader.templates && window.GTAModelLoader.templates.supercar) {
      this.car = window.GTAModelLoader.createRealSupercar(0xf59e0b, envMap);
      this.car.userData.isRealGLB = true;
    } else if (window.GTARealisticEntities && window.GTARealisticEntities.createFerrariSupercar) {
      this.car = window.GTARealisticEntities.createFerrariSupercar(0xf59e0b, envMap);
    } else if (window.GTAModels && window.GTAModels.createSupercar) {
      this.car = window.GTAModels.createSupercar(0xf59e0b);
    } else {
      this.car = new THREE.Group();
    }
    this.car.position.set(this.carPos.x, 0, this.carPos.z);
    this.car.rotation.y = this.carRot;
    this.scene.add(this.car);
    this.carWheels = (this.car.userData && this.car.userData.carWheels) ? this.car.userData.carWheels : [];
  }

  // Detailed American Police Interceptor Cruiser
  buildPoliceCruiser() {
    const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;
    if (window.GTAModelLoader && window.GTAModelLoader.createRealPoliceCruiser) {
      this.policeCar = window.GTAModelLoader.createRealPoliceCruiser(envMap);
    } else if (window.GTAModels && window.GTAModels.createPoliceCruiser) {
      this.policeCar = window.GTAModels.createPoliceCruiser();
    } else if (window.GTARealisticEntities) {
      this.policeCar = window.GTARealisticEntities.createRealisticVehicle('police', 0x09090b, envMap);
    } else {
      this.policeCar = new THREE.Group();
    }

    if (this.policeCar.userData && this.policeCar.userData.redLight) {
      this.policeSirenLights = [this.policeCar.userData.redLight, this.policeCar.userData.blueLight];
    }
    this.policeCar.position.set(this.policeCarPos.x, 0, this.policeCarPos.z);
    this.policeCar.rotation.y = this.policeCarRot;
    this.scene.add(this.policeCar);
  }

  // Moving Traffic on Highway (14 Varied Real 3D Vehicles: Sedans, Coupes, SUVs)
  buildHighwayTraffic() {
    const carColors = [
      0x1e3a8a, 0xdc2626, 0xf8fafc, 0x18181b,
      0xeab308, 0x059669, 0x475569, 0x7c3aed,
      0xb91c1c, 0x0284c7, 0xd97706, 0x334155,
      0x047857, 0x64748b
    ];
    const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;

    for (let i = 0; i < 14; i++) {
      const col = carColors[i % carColors.length];
      let tCar;
      if (window.GTAModelLoader && window.GTAModelLoader.createRealTrafficVehicle) {
        tCar = window.GTAModelLoader.createRealTrafficVehicle(i, col, envMap);
      } else if (window.GTARealisticEntities) {
        const types = ['sedan', 'coupe', 'suv'];
        tCar = window.GTARealisticEntities.createRealisticVehicle(types[i % types.length], col, envMap);
      } else {
        tCar = new THREE.Group();
      }

      const isNorthbound = i % 2 === 0;
      const laneX = isNorthbound ? -28 : 28;
      tCar.position.set(laneX, 0, -1400 + i * 210);
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
  }

  // Live Vehicle Upgrade: Replaces active cars with high-detail 3D GLB & realistic models
  upgradeAllCityVehicles() {
    if (this._vehiclesUpgraded) return;
    this._vehiclesUpgraded = true;
    const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;

    // 1. Upgrade player's vehicle only if not already using a custom authentic brand
    if (window.GTAModelLoader && window.GTAModelLoader.templates && window.GTAModelLoader.templates.supercar && (!this.car.userData || (!this.car.userData.isRealGLB && !this.car.userData.customModel))) {
      const curPos = { x: this.car.position.x, y: this.car.position.y, z: this.car.position.z };
      const curRot = this.car.rotation.y;
      this.scene.remove(this.car);
      this.car = window.GTAModelLoader.createRealSupercar(0xf59e0b, envMap);
      this.car.position.set(curPos.x, curPos.y, curPos.z);
      this.car.rotation.y = curRot;
      this.car.userData.isRealGLB = true;
      this.scene.add(this.car);
      this.carWheels = (this.car.userData && this.car.userData.carWheels) ? this.car.userData.carWheels : [];
      console.log('[OpenWorldGame] 🏎️ Player Supercar upgraded to Real 3D GLB Model');
    }

    // 2. Upgrade police cruiser to real GLB model
    if (window.GTAModelLoader && window.GTAModelLoader.createRealPoliceCruiser && (!this.policeCar.userData || !this.policeCar.userData.isRealGLB)) {
      const curPos = { x: this.policeCar.position.x, y: this.policeCar.position.y, z: this.policeCar.position.z };
      const curRot = this.policeCar.rotation.y;
      this.scene.remove(this.policeCar);
      this.policeCar = window.GTAModelLoader.createRealPoliceCruiser(envMap);
      this.policeCar.position.set(curPos.x, curPos.y, curPos.z);
      this.policeCar.rotation.y = curRot;
      this.policeCar.userData.isRealGLB = true;
      this.scene.add(this.policeCar);
      if (this.policeCar.userData && this.policeCar.userData.redLight) {
        this.policeSirenLights = [this.policeCar.userData.redLight, this.policeCar.userData.blueLight];
      }
      console.log('[OpenWorldGame] 🚓 Police Interceptor upgraded to Real 3D GLB Model');
    }

    // 3. Upgrade traffic cars with real GLB & variety models
    if (this.trafficCars && this.trafficCars.length > 0 && window.GTAModelLoader && window.GTAModelLoader.createRealTrafficVehicle) {
      const carColors = [0x1e3a8a, 0xdc2626, 0xf8fafc, 0x18181b, 0xeab308, 0x059669, 0x475569, 0x7c3aed, 0xb91c1c, 0x0284c7, 0xd97706, 0x334155, 0x047857, 0x64748b];
      this.trafficCars.forEach((tCar, idx) => {
        if (!tCar.userData.isRealGLB) {
          const col = carColors[idx % carColors.length];
          const newCar = window.GTAModelLoader.createRealTrafficVehicle(idx, col, envMap);
          newCar.position.copy(tCar.position);
          newCar.rotation.y = tCar.rotation.y;
          newCar.userData = Object.assign({}, tCar.userData, {
            taillightMesh: newCar.userData.taillightMesh,
            isRealGLB: true
          });
          this.scene.remove(tCar);
          this.scene.add(newCar);
          this.trafficCars[idx] = newCar;
        }
      });
      console.log('[OpenWorldGame] 🚗 All Highway Traffic upgraded to Real 3D Models');
    }
  }

  // Space Rocket
  buildSpaceRocket() {
    this.rocket = new THREE.Group();
    const fuselage = new THREE.Mesh(
      new THREE.CylinderGeometry(8, 10, 85, 16),
      new THREE.MeshLambertMaterial({ color: 0xf8fafc })
    );
    fuselage.position.y = 45;
    this.rocket.add(fuselage);

    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(8, 25, 16),
      new THREE.MeshLambertMaterial({ color: 0xef4444 })
    );
    nose.position.y = 100;
    this.rocket.add(nose);

    this.rocket.position.set(this.rocketPos.x, 0, this.rocketPos.z);
    this.scene.add(this.rocket);
  }

  // Mouse & Touch Orbit Camera Handlers
  setupMouseControls() {
    if (!this.canvas) return;

    // Helper: is cursor over an interactive UI modal or button?
    const isOverUI = (target) => {
      if (!target) return false;
      return !!(target.closest && target.closest(
        '.game-location-modal, .gta-pause-menu-overlay, .hud-top-right-bar, .gta-quick-toggles-bar, button, input, textarea, .police-busted-overlay, .gta-loading-screen, .mobile-controller-deck, .mobile-touch-deck, .mobile-joystick-zone, .mobile-action-cluster, .mobile-center-dock, .m-action-btn, .m-dock-btn'
      ));
    };

    // Helper: is any modal/pause menu active?
    const isMenuOpen = () => {
      const pm = document.getElementById('gta-pause-menu');
      if (pm && pm.classList.contains('active')) return true;
      const bModal = document.getElementById('police-busted-modal');
      if (bModal && bModal.style.display === 'flex') return true;
      const activeModal = document.querySelector('.game-location-modal.active');
      if (activeModal) return true;
      const ls = document.getElementById('game-loading-screen');
      if (ls && !ls.classList.contains('hidden')) return true;
      return false;
    };

    // 1. Mouse Down - start dragging / orbit
    window.addEventListener('mousedown', (e) => {
      if (isMenuOpen() || isOverUI(e.target)) return;
      this.isMouseLooking = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      this.lastMouseLookTime = Date.now();
    });

    let lastHoverX = null;
    let lastHoverY = null;

    // 2. Mouse Move - orbit view smoothly
    window.addEventListener('mousemove', (e) => {
      if (isMenuOpen() || isOverUI(e.target)) {
        lastHoverX = null;
        lastHoverY = null;
        return;
      }

      const isLocked = document.pointerLockElement === this.canvas;
      if (this.isMouseLooking || isLocked) {
        let dx = 0;
        let dy = 0;
        if (isLocked) {
          dx = e.movementX || 0;
          dy = e.movementY || 0;
        } else {
          dx = e.clientX - this.lastMouseX;
          dy = e.clientY - this.lastMouseY;
          this.lastMouseX = e.clientX;
          this.lastMouseY = e.clientY;
        }

        this.cameraYaw -= dx * this.mouseSensitivity;
        this.cameraPitch = Math.max(-0.25, Math.min(0.75, this.cameraPitch + dy * this.mouseSensitivity));
        this.lastMouseLookTime = Date.now();
      }
    });

    // 3. Mouse Up
    window.addEventListener('mouseup', () => {
      this.isMouseLooking = false;
    });

    // 4. Mouse Wheel - zoom in/out with safe boundaries
    window.addEventListener('wheel', (e) => {
      if (isMenuOpen() || isOverUI(e.target)) return;
      const zoomDelta = Math.sign(e.deltaY) * 7;
      this.cameraTargetDist = Math.max(45, Math.min(140, (this.cameraTargetDist || 72) + zoomDelta));
    }, { passive: true });

    // 5. Canvas Click - pointer lock for immersive GTA V play
    this.canvas.addEventListener('click', (e) => {
      if (isMenuOpen() || isOverUI(e.target)) return;
      if (!document.pointerLockElement && this.canvas.requestPointerLock) {
        try { this.canvas.requestPointerLock(); } catch (err) { }
      }
    });

    // 6. Multi-Touch Camera Orbit (Supports simultaneous joystick movement & camera drag)
    let activeCameraTouchId = null;
    let lastTouchX = 0;
    let lastTouchY = 0;

    window.addEventListener('touchstart', (e) => {
      if (isMenuOpen() || isOverUI(e.target)) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        const el = document.elementFromPoint(t.clientX, t.clientY);
        if (el && isOverUI(el)) continue;
        if (activeCameraTouchId === null) {
          activeCameraTouchId = t.identifier;
          lastTouchX = t.clientX;
          lastTouchY = t.clientY;
          this.isMouseLooking = true;
          this.lastMouseLookTime = Date.now();
          break;
        }
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (activeCameraTouchId === null || isMenuOpen()) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === activeCameraTouchId) {
          const dx = t.clientX - lastTouchX;
          const dy = t.clientY - lastTouchY;
          lastTouchX = t.clientX;
          lastTouchY = t.clientY;
          this.cameraYaw -= dx * (this.mouseSensitivity * 1.4);
          this.cameraPitch = Math.max(-0.28, Math.min(0.82, this.cameraPitch + dy * (this.mouseSensitivity * 1.4)));
          this.lastMouseLookTime = Date.now();
          break;
        }
      }
    }, { passive: true });

    const endCameraTouch = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === activeCameraTouchId) {
          activeCameraTouchId = null;
          this.isMouseLooking = false;
          break;
        }
      }
    };
    window.addEventListener('touchend', endCameraTouch, { passive: true });
    window.addEventListener('touchcancel', endCameraTouch, { passive: true });

    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  // Keyboard Handlers
  onKeyDown(e) {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    const k = e.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) {
      e.preventDefault();
    }
    this.keys[k] = true;

    // Space or Enter: Dismiss Police Busted Modal
    if (e.key === ' ' || e.key === 'Enter') {
      const bModal = document.getElementById('police-busted-modal');
      if (bModal && bModal.style.display === 'flex') {
        this.dismissPoliceBusted();
        return;
      }
    }

    // F: Enter / Exit Car
    if (k === 'f') {
      this.toggleVehicleDrive();
    }

    // E: Interact
    if (k === 'e') {
      this.triggerInteraction();
    }

    // Escape or P: Toggle GTA 5 Pause Menu / Settings
    if (e.key === 'Escape' || k === 'p') {
      this.togglePauseMenu();
    }

    // M: Toggle Full GPS Map inside Pause Menu
    if (k === 'm') {
      this.togglePauseMenu('map');
    }

    // C: Open Hamna Luxury Motorsports Showroom
    if (k === 'c') {
      this.openCarShowroom();
    }

    // Keys 1 to 6: Instant Quick Original Vehicle Switcher (Benz, BMW, Rolls-Royce, Audi, Innova, Tesla)
    if (k === '1') this.selectVehicleFromShowroom('benz');
    if (k === '2') this.selectVehicleFromShowroom('bmw');
    if (k === '3') this.selectVehicleFromShowroom('rollsroyce');
    if (k === '4') this.selectVehicleFromShowroom('audi');
    if (k === '5') this.selectVehicleFromShowroom('innova');
    if (k === '6') this.selectVehicleFromShowroom('tesla');

    // H: Car Horn or Police Siren Toggle
    if (k === 'h' && this.isDriving) {
      if (this.currentVehicle === 'police') {
        this.togglePoliceSiren();
      } else {
        if (window.gameAudio) window.gameAudio.playHorn();
      }
    }

    // G: Police Siren Toggle hotkey
    if (k === 'g' && this.isDriving && this.currentVehicle === 'police') {
      this.togglePoliceSiren();
    }

    // V: Toggle GTA 5 Camera View Modes
    if (k === 'v') {
      this.toggleCameraView();
    }

    // T: Toggle Day / Sunset / Night Atmosphere
    if (k === 't') {
      this.toggleTimeOfDay();
    }

    // R: Cycle Radio Station OR Instant Rollover Recovery if car is tilted/crashed
    if (k === 'r') {
      if (this.isDriving && (Math.abs(this.carRoll) > 0.25 || this.carY > 2)) {
        this.repairCarInWorkshop();
      } else {
        this.cycleRadioStation();
      }
    }

    // L: Toggle Vehicle Headlights
    if (k === 'l') {
      this.toggleVehicleHeadlights();
    }

    // Space: Jump (On foot) / Handbrake Drift (In car)
    if (e.key === ' ') {
      this.triggerJump();
    }
  }

  triggerJump() {
    if (!this.isDriving && !this.isJumping) {
      this.isJumping = true;
      this.jumpVelocity = 1.45;
      if (window.gameAudio && window.gameAudio.playFootstep) {
        window.gameAudio.playFootstep();
      }
    }
  }

  onKeyUp(e) {
    this.keys[e.key.toLowerCase()] = false;
  }

  toggleVehicleDrive() {
    if (this.isDriving) {
      this.isDriving = false;
      const isPolice = (this.currentVehicle === 'police');
      const activePos = isPolice ? this.policeCarPos : this.carPos;
      const activeRot = isPolice ? this.policeCarRot : this.carRot;

      this.playerPos.x = activePos.x - 18 * Math.cos(activeRot);
      this.playerPos.z = activePos.z - 18 * Math.sin(activeRot);
      this.player.position.set(this.playerPos.x, 0, this.playerPos.z);
      this.player.visible = true;
      this.playerRot = this.cameraYaw;

      if (window.gameAudio) {
        window.gameAudio.stopEngine();
        window.gameAudio.playEnter();
      }

      if (isPolice && this.isPlayerSirenActive) {
        this.togglePoliceSiren(false);
      }
      this.currentVehicle = null;
      this.updateHUDVehicleStatus(false);
    } else {
      const distToSupercar = Math.hypot(this.playerPos.x - this.carPos.x, this.playerPos.z - this.carPos.z);
      const distToPolice = this.policeCar ? Math.hypot(this.playerPos.x - this.policeCarPos.x, this.playerPos.z - this.policeCarPos.z) : Infinity;

      if (distToPolice < 50 && distToPolice <= distToSupercar) {
        this.isDriving = true;
        this.currentVehicle = 'police';
        this.cameraYaw = this.policeCarRot;
        this.player.visible = false;

        if (window.gameAudio) {
          window.gameAudio.playEnter();
          window.gameAudio.startEngine();
        }

        const vCard = document.getElementById('gta-vehicle-card');
        if (vCard) {
          const vClass = vCard.querySelector('.gta-veh-class');
          const vName = vCard.querySelector('.gta-veh-name');
          if (vClass) vClass.textContent = 'LAW ENFORCEMENT // V8 INTERCEPTOR';
          if (vName) vName.textContent = 'VAPID STANIER POLICE CRUISER';
          vCard.classList.add('active');
          setTimeout(() => vCard.classList.remove('active'), 4500);
        }

        this.updateHUDVehicleStatus(true, 'POLICE INTERCEPTOR CRUISER');
        this.showGameNotification('🚓 ENTERED POLICE INTERCEPTOR // Press [H] for Siren & Emergency Lights, [Space] to Drift');
      } else if (distToSupercar < 50) {
        this.isDriving = true;
        this.currentVehicle = 'car';
        this.cameraYaw = this.carRot;
        this.player.visible = false;

        if (window.gameAudio) {
          window.gameAudio.playEnter();
          window.gameAudio.startEngine();
        }

        const vCard = document.getElementById('gta-vehicle-card');
        if (vCard) {
          const vClass = vCard.querySelector('.gta-veh-class');
          const vName = vCard.querySelector('.gta-veh-name');
          if (vClass) vClass.textContent = 'SUPER CLASS // MID-ENGINE V10';
          if (vName) vName.textContent = 'GROTTI TURISMO R';
          vCard.classList.add('active');
          setTimeout(() => vCard.classList.remove('active'), 4500);
        }

        this.updateHUDVehicleStatus(true, 'GROTTI TURISMO R');
        this.showGameNotification('🚗 ENTERED GROTTI TURISMO R // Press [Space] to Drift, [V] for Camera, [R] for Radio');
      }
    }
  }

  togglePoliceSiren(forcedState = null) {
    if (forcedState !== null) {
      this.isPlayerSirenActive = forcedState;
    } else {
      this.isPlayerSirenActive = !this.isPlayerSirenActive;
    }

    if (this.isPlayerSirenActive) {
      if (window.gameAudio) window.gameAudio.playPoliceSiren(true);
      this.showGameNotification('🚨 POLICE SIREN & EMERGENCY LIGHTS: ACTIVE [H]');
    } else {
      if (window.gameAudio) window.gameAudio.stopPoliceSiren();
      this.showGameNotification('🔇 POLICE SIREN: OFF [H]');
    }
  }

  // GTA 5 Camera View Modes (Close 3rd -> Far 3rd -> Action Chase -> Hood/1st-Person)
  toggleCameraView() {
    this.cameraMode = (this.cameraMode + 1) % 4;
    const modeNames = [
      '3RD PERSON CLOSE',
      '3RD PERSON CINEMATIC',
      'LOW-ANGLE ACTION CHASE',
      'HOOD / BUMPER 1ST-PERSON'
    ];
    this.showGameNotification(`🎥 CAMERA: ${modeNames[this.cameraMode]} [V]`);
    if (window.gameAudio) window.gameAudio.playUIHover();
  }

  // GTA 5 Day / Sunset / Night Atmosphere Toggle
  toggleTimeOfDay() {
    this.timeOfDay = (this.timeOfDay + 1) % 3;

    if (this.timeOfDay === 0) { // NOON (Bright Sunny California)
      if (this.sunLight) {
        this.sunLight.color.setHex(0xfffaed);
        this.sunLight.intensity = 1.35;
        this.sunLight.position.set(600, 1000, 500);
      }
      if (this.ambientLight) this.ambientLight.intensity = 0.85;
      if (this.hemiLight) this.hemiLight.color.setHex(0x7dd3fc);
      this.scene.fog.color.setHex(0xbae6fd);
      this.showGameNotification('☀️ TIME: LOS SANTOS NOON [T]');
    } else if (this.timeOfDay === 1) { // GOLDEN HOUR / SUNSET
      if (this.sunLight) {
        this.sunLight.color.setHex(0xfb923c);
        this.sunLight.intensity = 1.6;
        this.sunLight.position.set(900, 250, 400); // Low angle sunset
      }
      if (this.ambientLight) this.ambientLight.intensity = 0.6;
      if (this.hemiLight) this.hemiLight.color.setHex(0xfdba74);
      this.scene.fog.color.setHex(0xfdba74);
      this.showGameNotification('🌇 TIME: PACIFIC BLUFFS SUNSET [T]');
    } else { // MIDNIGHT / NEON NIGHT
      if (this.sunLight) {
        this.sunLight.color.setHex(0x1e3a8a);
        this.sunLight.intensity = 0.35;
        this.sunLight.position.set(-300, 800, -300);
      }
      if (this.ambientLight) this.ambientLight.intensity = 0.28;
      if (this.hemiLight) this.hemiLight.color.setHex(0x0284c7);
      this.scene.fog.color.setHex(0x0a1128);
      this.showGameNotification('🌙 TIME: DOWNTOWN NEON NIGHT [T]');
    }

    if (window.gameAudio) window.gameAudio.playDiscoveryChime();
  }

  // GTA 5 Radio Station Switcher [R]
  cycleRadioStation() {
    this.currentRadioIdx = (this.currentRadioIdx + 1) % this.radioStations.length;
    const station = this.radioStations[this.currentRadioIdx];

    const radioBadge = document.getElementById('gta-radio-badge');
    const radioName = document.getElementById('gta-radio-station-name');
    if (radioBadge && radioName) {
      radioName.textContent = station;
      radioBadge.classList.add('active');
      clearTimeout(this._radioTimeout);
      this._radioTimeout = setTimeout(() => radioBadge.classList.remove('active'), 3500);
    }

    if (window.gameAudio) window.gameAudio.playRadioTuning();
  }

  // Toggle Sports Car Xenon Projector Headlights [L]
  toggleVehicleHeadlights() {
    this.headlightsOn = !this.headlightsOn;
    if (this.car && this.car.userData && this.car.userData.headlightBeams) {
      this.car.userData.headlightBeams.forEach(b => {
        b.visible = this.headlightsOn;
      });
    }
    this.showGameNotification(`💡 HEADLIGHTS: ${this.headlightsOn ? 'HIGH BEAMS ON' : 'OFF'} [L]`);
    if (window.gameAudio) window.gameAudio.playUIHover();
  }

  triggerInteraction() {
    if (this.activeInteraction) {
      if (this.activeInteraction.id === 'spaceport') {
        this.launchSpaceRocket();
      } else if (this.activeInteraction.id === 'security_gate') {
        this.triggerSecurityApprehensionEvent();
      } else {
        const modal = document.getElementById(this.activeInteraction.modalId);
        if (modal) {
          modal.classList.add('active');
          if (this.activeInteraction.tab && window.switchKtuModalTab) {
            window.switchKtuModalTab(this.activeInteraction.tab);
          }
          if (window.gameAudio) window.gameAudio.playDiscoveryChime();
        }
      }
    }
  }

  // Interactive Security Event: Intruder Apprehension & Police Arrest
  triggerSecurityApprehensionEvent() {
    if (window.gameAudio) {
      window.gameAudio.playSecurityRadio();
      window.gameAudio.playPoliceSiren();
    }

    const modal = document.getElementById('security-arrest-modal');
    if (modal) {
      modal.classList.add('active');
    }
    this.showGameNotification('🚨 SECURITY BREACH INTERCEPTED! Intruder tackled & handed to Police at Hamna VIP Tower!');
  }

  launchSpaceRocket() {
    if (this.isRocketLaunching) return;
    this.isRocketLaunching = true;
    this.showGameNotification('🚀 ROCKET LAUNCH INITIATED! BLASTING OFF TO ORBIT IN 3... 2... 1...');

    if (window.gameAudio) window.gameAudio.playRocketBlast();

    let launchProgress = 0;
    const launchInterval = setInterval(() => {
      launchProgress += 0.02;
      this.rocketAltitude += launchProgress * 14;
      this.rocket.position.y = this.rocketAltitude;

      this.camera.position.set(this.rocketPos.x + 80, this.rocketAltitude + 30, this.rocketPos.z + 140);
      this.camera.lookAt(this.rocket.position);

      if (this.rocketAltitude > 500) {
        const darkT = Math.min(1, (this.rocketAltitude - 500) / 1000);
        this.scene.background.lerpColors(new THREE.Color(0x7dd3fc), new THREE.Color(0x05050f), darkT);
        this.scene.fog.color.lerpColors(new THREE.Color(0x7dd3fc), new THREE.Color(0x05050f), darkT);
      }

      if (this.rocketAltitude >= 2200) {
        clearInterval(launchInterval);
        this.isInSpace = true;
        this.isRocketLaunching = false;
        const spaceModal = document.getElementById('space-station-modal');
        if (spaceModal) spaceModal.classList.add('active');
      }
    }, 30);
  }

  landBackOnEarth() {
    this.isInSpace = false;
    this.rocketAltitude = 0;
    this.rocket.position.y = 0;
    this.scene.background = new THREE.Color(0x7dd3fc);
    this.scene.fog.color = new THREE.Color(0x7dd3fc);

    this.playerPos.x = 550;
    this.playerPos.z = 20;
    this.player.position.set(550, 0, 20);
    this.player.visible = true;

    const spaceModal = document.getElementById('space-station-modal');
    if (spaceModal) spaceModal.classList.remove('active');

    this.showGameNotification('🛬 TOUCHDOWN! Welcome back to Earth, Calicut Airport.');
    if (window.gameAudio) window.gameAudio.playEnter();
  }

  togglePauseMenu(defaultTab = 'map') {
    const pauseMenu = document.getElementById('gta-pause-menu');
    if (!pauseMenu) return;
    const isOpening = !pauseMenu.classList.contains('active');
    if (isOpening) {
      pauseMenu.classList.add('active');
      this.switchPauseTab(defaultTab);
      if (window.gameAudio) window.gameAudio.playDiscoveryChime();
    } else {
      pauseMenu.classList.remove('active');
      if (window.gameAudio) window.gameAudio.playUIHover();
    }
  }

  switchPauseTab(tabId) {
    document.querySelectorAll('.gta-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.gta-pause-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === `pause-pane-${tabId}`);
    });
    if (window.gameAudio) window.gameAudio.playUIHover();
  }

  toggleGPSMap() {
    this.togglePauseMenu('map');
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this._animFrame = (this._animFrame || 0) + 1;
    const delta = this.clock ? Math.min(this.clock.getDelta(), 0.05) : 0.016;

    if (!this.isInSpace && !this.isRocketLaunching) {
      if (this.isDriving) {
        this.updateCarPhysics(delta);
      } else {
        this.updatePlayerMovement(delta);
      }
    }

    this.updateHighwayTraffic();
    this.updatePedestrians();
    this.updatePoliceCruiserPursuit();
    this.updateTowTruckMission();
    this.updateEmergencyMission();

    // Rotate Showroom Turntable Display Supercar
    if (this.showroomTurntable) {
      this.showroomTurntable.rotation.y += 0.008;
    }

    // Throttle DOM proximity checks (run every 6 frames to prevent layout thrashing)
    if (this._animFrame % 6 === 0) {
      this.checkLandmarkProximity();
    }

    // Dynamic Live Location Guidance HUD
    if (this._animFrame % 12 === 0) {
      this.updateLocationHUD();
    }

    this.updateCamera();

    // Flashing Police Siren Lights on active cruiser (only update when active or resetting)
    if (this.policeSirenLights && this.policeSirenLights.length >= 2) {
      const isSirenOn = this.isPlayerSirenActive || (this.wantedLevel > 0 && this.isPolicePursuing);
      if (isSirenOn) {
        const flash = Math.sin(Date.now() * 0.02) > 0;
        this.policeSirenLights[0].material.color.setHex(flash ? 0xff0000 : 0x1e1b4b);
        this.policeSirenLights[1].material.color.setHex(!flash ? 0x0066ff : 0x1e1b4b);
        this._sirenWasActive = true;
      } else if (this._sirenWasActive) {
        this.policeSirenLights[0].material.color.setHex(0x1e1b4b);
        this.policeSirenLights[1].material.color.setHex(0x1e1b4b);
        this._sirenWasActive = false;
      }
    }

    // Dynamic Waypoints, Lighthouse Beacon & Spaceport Radar Animations
    if (this._animFrame % 2 === 0 && window.GTAModels && window.GTAModels.updateWaypoints) {
      window.GTAModels.updateWaypoints(Date.now() * 0.002);
    }
    if (this.lighthouse && this.lighthouse.userData && this.lighthouse.userData.rotatingBeacon) {
      this.lighthouse.userData.rotatingBeacon.rotation.y = Date.now() * 0.0015;
    }
    if (this.spaceport && this.spaceport.userData && this.spaceport.userData.radarGroup) {
      this.spaceport.userData.radarGroup.rotation.y = Date.now() * 0.0025;
    }

    // District Animations
    if (this.ferrisWheel) {
      this.ferrisWheel.rotation.z += 0.005;
    }

    // Update real 3D animated character mixers with accurate delta time
    if (window.GTAModelLoader) {
      window.GTAModelLoader.update(delta);
    }

    // Throttle minimap redraw (every 4 frames = ~15 FPS is super smooth on radar and cuts 75% 2D canvas draw overhead)
    if (this._animFrame % 4 === 0) {
      this.renderMinimap();
    }

    this.renderer.render(this.scene, this.camera);
  }

  // Solid Bounding Box Collision Resolution (No ghosting through walls or interior lights)
  resolveBuildingCollisions(pos, radius, isVehicle = false) {
    let hasCollision = false;

    // 1. Hard Metropolis Outer Perimeter Boundary Clamping (Solid Non-Phasing Limits)
    const BORDER_MIN_X = -735;
    const BORDER_MAX_X = 580;
    const BORDER_MIN_Z = -735;
    const BORDER_MAX_Z = 670;

    if (pos.x < BORDER_MIN_X + radius) {
      pos.x = BORDER_MIN_X + radius;
      hasCollision = true;
    } else if (pos.x > BORDER_MAX_X - radius) {
      pos.x = BORDER_MAX_X - radius;
      hasCollision = true;
    }

    if (pos.z < BORDER_MIN_Z + radius) {
      pos.z = BORDER_MIN_Z + radius;
      hasCollision = true;
    } else if (pos.z > BORDER_MAX_Z - radius) {
      pos.z = BORDER_MAX_Z - radius;
      hasCollision = true;
    }

    // 2. Solid Bounding Box Colliders for All Buildings, Walls & Monuments
    if (this.buildingColliders && this.buildingColliders.length > 0) {
      for (let i = 0; i < this.buildingColliders.length; i++) {
        const c = this.buildingColliders[i];
        // Check if circle (pos, radius) overlaps AABB [c.minX, c.maxX, c.minZ, c.maxZ]
        if (pos.x + radius > c.minX && pos.x - radius < c.maxX &&
          pos.z + radius > c.minZ && pos.z - radius < c.maxZ) {

          hasCollision = true;

          // Overlap depths from each bounding box edge
          const overlapL = (pos.x + radius) - c.minX; // Distance past minX
          const overlapR = c.maxX - (pos.x - radius); // Distance past maxX
          const overlapT = (pos.z + radius) - c.minZ; // Distance past minZ
          const overlapB = c.maxZ - (pos.z - radius); // Distance past maxZ

          const minX = overlapL < overlapR ? overlapL : overlapR;
          const minZ = overlapT < overlapB ? overlapT : overlapB;

          // Push along the axis of minimum penetration with safety clearance
          if (minX < minZ) {
            pos.x = (overlapL < overlapR) ? (c.minX - radius - 0.4) : (c.maxX + radius + 0.4);
          } else {
            pos.z = (overlapT < overlapB) ? (c.minZ - radius - 0.4) : (c.maxZ + radius + 0.4);
          }
        }
      }
    }

    // 3. Vehicle Impact Recoil & Crash Audio (Supercar & Police Interceptor)
    if (hasCollision && isVehicle) {
      const isPolice = (this.currentVehicle === 'police');
      let activeSpeed = isPolice ? this.policeCarSpeed : this.carSpeed;
      if (Math.abs(activeSpeed) > 0.4) {
        if (window.gameAudio && (!this._lastCrashSoundTime || Date.now() - this._lastCrashSoundTime > 600)) {
          window.gameAudio.playCarCrash();
          this._lastCrashSoundTime = Date.now();
        }
        activeSpeed = -activeSpeed * 0.35; // Rebound recoil!
        if (isPolice) {
          this.policeCarSpeed = activeSpeed;
          this.policeCarVy = 0; // Clamped to ground: no flying onto building roofs!
        } else {
          this.carSpeed = activeSpeed;
          this.carVy = 0;
          this.carY = 0;
          this.carRoll = 0;
        }

        // Heavy impact triggers 911 Emergency Accident Response (Fire Engine & Police Cruiser)
        if (Math.abs(activeSpeed) > 0.8) {
          this.dispatchEmergencyAccidentTeam({ x: pos.x, z: pos.z }, 'building_impact');
        }
      }
    }

    return hasCollision;
  }

  updatePlayerMovement(delta = 0.016) {
    let inputForward = this.analogForward || 0;
    let inputStrafe = this.analogStrafe || 0;
    const isSprint = this.keys['shift'] || this.mobileSprint;
    const timeScale = Math.min(delta / 0.016667, 2.0);
    const speed = (isSprint ? 3.8 : 2.2) * timeScale;

    // Up Arrow / W: Move forward in camera view direction
    if (this.keys['w'] || this.keys['arrowup']) inputForward += 1;
    // Down Arrow / S: Move backward from camera view direction
    if (this.keys['s'] || this.keys['arrowdown']) inputForward -= 1;
    // Left Arrow / A: Move strictly to the LEFT of camera view
    if (this.keys['a'] || this.keys['arrowleft']) inputStrafe -= 1;
    // Right Arrow / D: Move strictly to the RIGHT of camera view
    if (this.keys['d'] || this.keys['arrowright']) inputStrafe += 1;

    const uData = this.player ? this.player.userData : null;
    const isMoving = inputForward !== 0 || inputStrafe !== 0;
    this.isPlayerMoving = isMoving;

    if (isMoving) {
      // Normalize input vector so diagonal movement is not faster
      const len = Math.hypot(inputForward, inputStrafe);
      const normFwd = inputForward / len;
      const normStr = inputStrafe / len;

      // Ground plane directional vectors from camera angle
      const camFwdX = Math.sin(this.cameraYaw);
      const camFwdZ = Math.cos(this.cameraYaw);
      const camRightX = -Math.cos(this.cameraYaw);
      const camRightZ = Math.sin(this.cameraYaw);

      // Movement vector
      const moveX = (camFwdX * normFwd + camRightX * normStr) * speed;
      const moveZ = (camFwdZ * normFwd + camRightZ * normStr) * speed;

      this.playerPos.x += moveX;
      this.playerPos.z += moveZ;

      // Solid building collision check: pushes player back out
      this.resolveBuildingCollisions(this.playerPos, 2.6, false);

      // Character snappy and responsive facing rotation (0.65 response)
      const targetFacingAngle = Math.atan2(moveX, moveZ);
      let diff = targetFacingAngle - this.playerRot;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.playerRot += diff * 0.65;

      if (this.player) {
        this.player.rotation.y = this.playerRot;
      }

      // Mixamo skeletal animation playback for Hamna
      if (uData && uData.isHamna && uData.actions) {
        const targetAction = isSprint ? (uData.actions.run || uData.actions.walk) : uData.actions.walk;
        if (targetAction && uData.currentAction !== targetAction) {
          if (uData.currentAction) uData.currentAction.fadeOut(0.2);
          targetAction.reset().fadeIn(0.2).play();
          uData.currentAction = targetAction;
        }
      } else if (uData && uData.leftLegGroup && uData.rightLegGroup) {
        // Procedural gait animations fallback
        const time = Date.now() * (isSprint ? 0.016 : 0.011);
        const stride = isSprint ? 0.95 : 0.65;
        uData.leftLegGroup.rotation.x = Math.sin(time) * stride;
        uData.rightLegGroup.rotation.x = -Math.sin(time) * stride;

        if (uData.leftArmGroup && uData.rightArmGroup) {
          uData.leftArmGroup.rotation.x = -Math.sin(time) * (stride * 0.85);
          uData.rightArmGroup.rotation.x = Math.sin(time) * (stride * 0.85);
        }

        if (uData.torsoGroup) {
          uData.torsoGroup.rotation.y = Math.sin(time) * 0.08;
          uData.torsoGroup.position.y = 8.5 + Math.abs(Math.sin(time * 2)) * 0.35;
        }
      }

      if (Math.random() < 0.12 && window.gameAudio) window.gameAudio.playFootstep();
    } else {
      // Idle Breathing & Natural Posture
      if (uData && uData.isHamna && uData.actions && uData.actions.idle) {
        if (uData.currentAction !== uData.actions.idle) {
          if (uData.currentAction) uData.currentAction.fadeOut(0.25);
          uData.actions.idle.reset().fadeIn(0.25).play();
          uData.currentAction = uData.actions.idle;
        }
      } else if (uData && uData.leftLegGroup && uData.rightLegGroup) {
        uData.leftLegGroup.rotation.x *= 0.82;
        uData.rightLegGroup.rotation.x *= 0.82;
        if (uData.leftArmGroup && uData.rightArmGroup) {
          uData.leftArmGroup.rotation.x *= 0.82;
          uData.rightArmGroup.rotation.x *= 0.82;
        }
        if (uData.torsoGroup) {
          uData.torsoGroup.position.y = 8.5 + Math.sin(Date.now() * 0.003) * 0.14;
          uData.torsoGroup.rotation.y = 0;
        }
      }
    }

    // Realistic Jumping Kinetics with Mid-Air Leg Tuck & Soft Landing
    if (this.isJumping) {
      this.jumpY += this.jumpVelocity;
      this.jumpVelocity -= 0.082;

      if (uData && uData.leftLegGroup && uData.rightLegGroup) {
        uData.leftLegGroup.rotation.x = -0.35;
        uData.rightLegGroup.rotation.x = -0.35;
      }

      if (this.jumpY <= 0) {
        this.jumpY = 0;
        this.isJumping = false;
        if (window.gameAudio) window.gameAudio.playFootstep();
      }
    }

    if (this.player) {
      this.player.position.set(this.playerPos.x, this.jumpY, this.playerPos.z);
    }
  }

  updateCarPhysics(delta = 0.016) {
    const timeScale = Math.min(delta / 0.016667, 2.0);
    const isPolice = (this.currentVehicle === 'police');
    const activeMesh = isPolice ? this.policeCar : this.car;
    const activePos = isPolice ? this.policeCarPos : this.carPos;
    let activeSpeed = isPolice ? this.policeCarSpeed : this.carSpeed;
    let activeRot = isPolice ? this.policeCarRot : this.carRot;
    let activeY = isPolice ? (this.policeCarY || 0) : (this.carY || 0);
    let activeVy = isPolice ? (this.policeCarVy || 0) : (this.carVy || 0);
    let activeRoll = isPolice ? (this.policeCarRoll || 0) : (this.carRoll || 0);

    const maxSpeed = isPolice ? (this.policeCarMaxSpeed || 8.2) : (this.carMaxSpeed || 8.5);
    const accel = (isPolice ? (this.policeCarAcceleration || 0.17) : (this.carAcceleration || 0.22)) * timeScale;
    const friction = Math.pow(isPolice ? (this.policeCarFriction || 0.96) : (this.carFriction || 0.965), timeScale);

    const isAccelerating = this.keys['w'] || this.keys['arrowup'] || (this.analogForward > 0.15);
    const isReversing = this.keys['s'] || this.keys['arrowdown'] || (this.analogForward < -0.15);
    const isHandbraking = this.keys[' '] || this.mobileHandbrake; // Spacebar = Handbrake / Drift
    const isNitroBoost = this.keys['shift'] || this.mobileSprint;
    const effectiveMaxSpeed = isNitroBoost ? maxSpeed * 1.25 : maxSpeed;

    if (isAccelerating) {
      activeSpeed = Math.min(effectiveMaxSpeed, activeSpeed + (isNitroBoost ? accel * 1.4 : accel));
    } else if (isReversing) {
      activeSpeed = Math.max(-effectiveMaxSpeed * 0.45, activeSpeed - accel * 1.3);
    } else {
      activeSpeed *= friction;
      if (Math.abs(activeSpeed) < 0.02) activeSpeed = 0;
    }

    // Steering Controls (Left arrow steers LEFT, Right arrow steers RIGHT)
    const absSpeed = Math.abs(activeSpeed);
    const isSteeringLeft = this.keys['a'] || this.keys['arrowleft'] || (this.analogStrafe < -0.15);
    const isSteeringRight = this.keys['d'] || this.keys['arrowright'] || (this.analogStrafe > 0.15);

    if (absSpeed > 0.03 || ((isAccelerating || isReversing) && (isSteeringLeft || isSteeringRight))) {
      const dir = (activeSpeed >= 0) ? 1 : -1;
      const turnSens = (isPolice ? 0.038 : 0.044) * timeScale;

      if (isHandbraking && absSpeed > 1.2) {
        activeSpeed *= Math.pow(0.985, timeScale);
        if (isSteeringLeft) activeRot += (isPolice ? 0.065 : 0.072) * dir * timeScale;
        if (isSteeringRight) activeRot -= (isPolice ? 0.065 : 0.072) * dir * timeScale;

        if (Math.random() < 0.28 && window.gameAudio && window.gameAudio.playTireScreech) {
          window.gameAudio.playTireScreech();
        }
      } else {
        if (isSteeringLeft) activeRot += turnSens * dir;
        if (isSteeringRight) activeRot -= turnSens * dir;
      }
    }

    // Advance position with multi-substepping (prevents high-speed tunneling through walls)
    const substeps = Math.max(1, Math.ceil(Math.abs(activeSpeed) / 2.8));
    const subSpeed = (activeSpeed / substeps) * timeScale;
    const vehicleRadius = isPolice ? 8.5 : 7.8;
    for (let s = 0; s < substeps; s++) {
      activePos.x += Math.sin(activeRot) * subSpeed;
      activePos.z += Math.cos(activeRot) * subSpeed;
      const hit = this.resolveBuildingCollisions(activePos, vehicleRadius, true);
      if (hit) break;
    }

    // Crash Tumble, Bounce & Roll-Over Physics
    if (activeVy !== 0 || activeY > 0) {
      activeVy -= 0.38; // gravity
      activeY = Math.max(0, activeY + activeVy);
      if (activeY === 0) activeVy = 0;
    }
    // Roll recovery (car gradually rights itself from a rollover)
    if (Math.abs(activeRoll) > 0.04) {
      activeRoll *= 0.94;
    } else {
      activeRoll = 0;
    }

    // Collision Detection with Highway Traffic Cars (Solid Horizontal Separation, No Climbing!)
    this.trafficCars.forEach(tCar => {
      const dx = tCar.position.x - activePos.x;
      const dz = tCar.position.z - activePos.z;
      const dist = Math.hypot(dx, dz);
      const minDistance = 25;

      if (dist < minDistance && dist > 0.001) {
        // 1. HARD HORIZONTAL SEPARATION (Cars cannot phase through or merge)
        const nx = dx / dist;
        const nz = dz / dist;
        const overlap = minDistance - dist;

        activePos.x -= nx * overlap * 0.55;
        activePos.z -= nz * overlap * 0.55;
        tCar.position.x += nx * overlap * 0.45;
        tCar.position.z += nz * overlap * 0.45;

        // 2. STRICT VERTICAL CLAMP (ABSOLUTELY NO CLIMBING ON TOP OF OTHER CARS!)
        activeVy = 0;
        activeY = 0;
        activeRoll = 0;
        activePitch = 0;
        if (activeMesh) activeMesh.position.y = 0;
        tCar.position.y = 0;
        if (tCar.userData && tCar.userData.crashTumble) {
          tCar.userData.crashTumble.vy = 0;
        }

        const isPlayerRammingAtFault = Math.abs(activeSpeed) > 0.8;
        if (isPlayerRammingAtFault) {
          if (window.gameAudio && (!this._lastCrashSoundTime || Date.now() - this._lastCrashSoundTime > 800)) {
            window.gameAudio.playCarCrash();
            this._lastCrashSoundTime = Date.now();
          }

          if (isPolice) {
            // Police Interceptor Push-Bumper: shoves traffic aside safely on ground level
            activeSpeed *= 0.72;
            tCar.userData.isCrashed = true;
            tCar.userData.currentSpeed = 0;
            this.showGameNotification("🚨 POLICE INTERCEPTOR PUSH-BUMPER CLEARED TRAFFIC OBSTACLE! 🚓");
          } else {
            // Horizontal skid recoil for sports car (stays 100% on asphalt, no flying)
            activeSpeed = -activeSpeed * 0.4;
            tCar.userData.isCrashed = true;
            tCar.userData.currentSpeed = 0;

            this.triggerWantedLevel(1);
            this.showGameNotification("💥 VEHICULAR CRASH! RECKLESS IMPACT // EMERGENCY TEAMS DISPATCHED! 🚨");
          }

          // Dispatch 911 Fire Engine & Police Pursuit Emergency Team!
          this.dispatchEmergencyAccidentTeam({ x: activePos.x, z: activePos.z }, 'traffic_collision');
        } else {
          // Soft bumper contact
          activeSpeed = 0;
          if (tCar.userData) tCar.userData.currentSpeed = 0;
        }
      }
    });

    // Apply Position & 3D Angular Tumble
    if (activeMesh) {
      activeMesh.position.set(activePos.x, activeY, activePos.z);
      activeMesh.rotation.y = activeRot;

      // Body Tilt / Suspension Dynamics into turns + Crash Roll
      if (activeRoll !== 0) {
        activeMesh.rotation.z = activeRoll;
      } else if (isSteeringLeft) {
        activeMesh.rotation.z = Math.min(0.065, activeMesh.rotation.z + 0.012);
      } else if (isSteeringRight) {
        activeMesh.rotation.z = Math.max(-0.065, activeMesh.rotation.z - 0.012);
      } else {
        activeMesh.rotation.z *= 0.8;
      }
    }

    // Write back physics state to current active vehicle
    if (isPolice) {
      this.policeCarSpeed = activeSpeed;
      this.policeCarRot = activeRot;
      this.policeCarY = activeY;
      this.policeCarVy = activeVy;
      this.policeCarRoll = activeRoll;
    } else {
      this.carSpeed = activeSpeed;
      this.carRot = activeRot;
      this.carY = activeY;
      this.carVy = activeVy;
      this.carRoll = activeRoll;
    }

    // Taillight glowing bright red on braking or reversing (Supercar)
    if (!isPolice && this.car && this.car.userData && this.car.userData.taillightBar) {
      if (isReversing || (activeSpeed > 0.5 && isHandbraking)) {
        this.car.userData.taillightBar.material.color.setHex(0xff0000);
      } else {
        this.car.userData.taillightBar.material.color.setHex(0x991b1b);
      }
    }

    // Dynamic Engine Sound with pitch shift
    if (window.gameAudio) {
      window.gameAudio.updateEnginePitch(absSpeed / maxSpeed);
    }

    // Rotate Wheels and steer front wheels (Grotti Supercar)
    if (!isPolice && this.carWheels && this.carWheels.length >= 4) {
      const steerAngle = isSteeringLeft ? 0.32 : (isSteeringRight ? -0.32 : 0);
      this.carWheels[0].rotation.y = steerAngle;
      this.carWheels[1].rotation.y = steerAngle;

      this.carWheels.forEach(w => {
        if (w.children && w.children[0]) {
          w.children[0].rotation.x += activeSpeed * 0.22;
        }
      });
    }

    // Dynamic Camera FOV Expansion (Extreme GTA 5 Speed Sense)
    const speedRatio = absSpeed / maxSpeed;
    this.camera.fov = 55 + speedRatio * 14;
    this.camera.updateProjectionMatrix();

    // HUD Speedometer
    const speedKmH = Math.round(absSpeed * 26);
    const speedEl = document.getElementById('hud-speedometer-val');
    if (speedEl) speedEl.textContent = `${speedKmH} KM/H`;
  }

  updateHighwayTraffic() {
    const isPolice = (this.currentVehicle === 'police');
    const playerCheckX = this.isDriving ? (isPolice ? this.policeCarPos.x : this.carPos.x) : this.playerPos.x;
    const playerCheckZ = this.isDriving ? (isPolice ? this.policeCarPos.z : this.carPos.z) : this.playerPos.z;

    for (let i = 0; i < this.trafficCars.length; i++) {
      const t = this.trafficCars[i];
      if (t.userData.isCrashed && t.userData.crashTumble) {
        // Tumble, roll and spin physics for crashed traffic car
        const ct = t.userData.crashTumble;
        ct.vy -= 0.32; // gravity
        t.position.y = Math.max(0, t.position.y + ct.vy);
        t.position.x += ct.vx;
        t.position.z += ct.vz;
        ct.vx *= 0.94;
        ct.vz *= 0.94;
        t.rotation.z += ct.rotVel;
        t.rotation.x += ct.rotVel * 0.4;
        if (t.position.y <= 0) {
          t.position.y = 0;
          ct.vy = 0;
          t.rotation.z = Math.PI / 2; // Lies overturned on its side
        }
      } else {
        const baseSpeed = t.userData.baseSpeed || (t.userData.isNorthbound ? 3.8 : -3.8);
        const isHeadingSouth = baseSpeed > 0; // Moves towards +Z
        let closestObstacleDist = Infinity;

        // 1. Check if Player is in front in this car's lane
        const playerLaneDiff = Math.abs(playerCheckX - t.position.x);
        if (playerLaneDiff < 18) {
          const dz = isHeadingSouth ? (playerCheckZ - t.position.z) : (t.position.z - playerCheckZ);
          if (dz > 0 && dz < 75) {
            closestObstacleDist = Math.min(closestObstacleDist, dz);
          }
        }

        // 2. Check other traffic cars ahead in the same lane (linear pass)
        for (let j = 0; j < this.trafficCars.length; j++) {
          if (i === j) continue;
          const other = this.trafficCars[j];
          if (Math.abs(other.position.x - t.position.x) < 16) {
            const dz = isHeadingSouth ? (other.position.z - t.position.z) : (t.position.z - other.position.z);
            if (dz > 0 && dz < 75 && dz < closestObstacleDist) {
              closestObstacleDist = dz;
            }
          }
        }

        // 3. React according to distance to obstacle ahead
        if (closestObstacleDist < 30) {
          // EMERGENCY BRAKE: Full stop, taillights flare bright red!
          t.userData.currentSpeed *= 0.45;
          if (Math.abs(t.userData.currentSpeed) < 0.12) t.userData.currentSpeed = 0;
          if (t.userData.taillightMesh) t.userData.taillightMesh.material.color.setHex(0xff0000);

          // Honk horn if waiting behind player for over 3.5 seconds
          if (t.userData.currentSpeed === 0 && closestObstacleDist < 25) {
            if (!t.userData.waitStartTime) t.userData.waitStartTime = Date.now();
            if (Date.now() - t.userData.waitStartTime > 3500 && (!this._lastTrafficHonk || Date.now() - this._lastTrafficHonk > 5500)) {
              if (window.gameAudio && window.gameAudio.playHorn) window.gameAudio.playHorn();
              this._lastTrafficHonk = Date.now();
            }
          }
        } else if (closestObstacleDist < 65) {
          // DECELERATING: Smoothly slowdown to match traffic pace
          t.userData.currentSpeed *= 0.88;
          if (t.userData.taillightMesh) t.userData.taillightMesh.material.color.setHex(0xff0000);
          t.userData.waitStartTime = null;
        } else {
          // CLEAR LANE: Accelerate back to cruising speed, dim running taillights
          t.userData.currentSpeed += (baseSpeed - t.userData.currentSpeed) * 0.05;
          if (t.userData.taillightMesh) t.userData.taillightMesh.material.color.setHex(0x7f1d1d);
          t.userData.waitStartTime = null;
        }

        t.position.z += t.userData.currentSpeed;
        if (t.position.z > 1600) t.position.z = -1600;
        if (t.position.z < -1600) t.position.z = 1600;
      }
    }
  }

  updatePedestrians() {
    const time = Date.now() * 0.008;

    const isPolice = (this.currentVehicle === 'police');
    const activeSpeed = isPolice ? this.policeCarSpeed : this.carSpeed;
    const activePos = isPolice ? this.policeCarPos : this.carPos;
    const activeRot = isPolice ? this.policeCarRot : this.carRot;

    // Check high-speed vehicle impact against pedestrians ("poaples idichaal poeple therich veeyyanam")
    if (this.isDriving && Math.abs(activeSpeed) > 0.35) {
      this.pedestrians.forEach(p => {
        if (!p.userData.isFlung) {
          const dx = p.position.x - activePos.x;
          const dz = p.position.z - activePos.z;
          const dist = Math.hypot(dx, dz);

          if (dist < 14) {
            // High vertical fling into the air!
            p.userData.isFlung = true;
            p.userData.vy = 18 + Math.abs(activeSpeed) * 3.8;
            p.userData.vx = Math.sin(activeRot) * (activeSpeed * 1.8) + (Math.random() - 0.5) * 3.5;
            p.userData.vz = Math.cos(activeRot) * (activeSpeed * 1.8) + (Math.random() - 0.5) * 3.5;
            p.userData.rotVelX = 0.3 + Math.random() * 0.3;
            p.userData.rotVelZ = (Math.random() - 0.5) * 0.35;

            if (window.gameAudio) window.gameAudio.playPedestrianImpact();

            if (!isPolice) {
              // Trigger 2-Star Police Wanted Level!
              this.triggerWantedLevel(2);
              this.showGameNotification("🚨 HIT & RUN! PEDESTRIAN IMPACT! HIGHWAY PATROL DISPATCHED!");
            } else {
              this.showGameNotification("🚨 POLICE EMERGENCY CLEARANCE // PEDESTRIAN EVADED INTERCEPTOR!");
            }
          }
        }
      });
    }

    this.pedestrians.forEach((p, idx) => {
      if (p.userData.isFlung) {
        // Airborne trajectory & ragdoll tumble
        p.userData.vy -= 0.68; // gravity
        p.position.y = Math.max(0, p.position.y + p.userData.vy);
        p.position.x += p.userData.vx;
        p.position.z += p.userData.vz;
        p.rotation.x += p.userData.rotVelX;
        p.rotation.z += p.userData.rotVelZ;

        if (p.position.y <= 0) {
          p.position.y = 0;
          if (p.userData.vy < -3.5) {
            p.userData.vy = -p.userData.vy * 0.28; // bounce on pavement
          } else {
            p.userData.vy = 0;
            p.userData.vx *= 0.85;
            p.userData.vz *= 0.85;
            p.rotation.x = Math.PI / 2; // lies on pavement
          }
        }
      } else {
        // Normal walking animation
        p.position.x += p.userData.vx;
        p.position.z += p.userData.vz;
        if (p.position.x > p.userData.maxX || p.position.x < p.userData.minX) p.userData.vx *= -1;
        if (p.position.z > p.userData.maxZ || p.position.z < p.userData.minZ) p.userData.vz *= -1;

        p.rotation.y = Math.atan2(p.userData.vx, p.userData.vz);

        if (p.userData.leftLeg && p.userData.rightLeg) {
          const swing = Math.sin(time + idx) * 0.55;
          p.userData.leftLeg.rotation.x = swing;
          p.userData.rightLeg.rotation.x = -swing;
          if (p.userData.leftArm && p.userData.rightArm) {
            p.userData.leftArm.rotation.x = -swing * 0.7;
            p.userData.rightArm.rotation.x = swing * 0.7;
          }
        }
      }
    });

    // Collegiate Student Dialogue Events when walking near campus quad
    const checkPos = this.isDriving ? (isPolice ? this.policeCarPos : this.carPos) : this.playerPos;
    if (checkPos.z < -430 && checkPos.z > -650 && Math.abs(checkPos.x) < 130) {
      const studentDialogues = [
        "🎓 Student Sarah: 'Hamna's giant honors billboard at the main gate is incredible! She's an MCA scholar at KTU!'",
        "🎓 David (Data Science): 'Her Collab-Hub platform connects early-stage startups directly to venture capital!'",
        "🎓 Prof. Reynolds: 'Hamna graduated First Class in BCA from University of Calicut before joining KTU MCA research.'",
        "🎓 Maya (AI Lab): 'Her Trendrove system uses color science and skin undertone analysis for outfit recommendations!'",
        "🎓 Alex (CS Senior): 'Check out Exhibit 1 along the avenue for her KTU MCA distributed system coursework!'"
      ];
      if (!this._lastDialogueTime || Date.now() - this._lastDialogueTime > 8000) {
        this._lastDialogueTime = Date.now();
        const dlg = studentDialogues[Math.floor(Math.random() * studentDialogues.length)];
        const tracker = document.getElementById('current-quest-title');
        if (tracker && !this.isDriving) {
          tracker.textContent = dlg;
        }
      }
    }
  }

  // ========================================================
  // POLICE WANTED SYSTEM, PATROL PURSUIT & CASE BUSTED LOGIC
  // ========================================================
  triggerWantedLevel(stars = 1) {
    this.wantedLevel = Math.min(3, Math.max(this.wantedLevel, stars));
    this.lastWantedTime = Date.now();
    this.updateWantedUI();

    if (window.gameAudio && !this.isPolicePursuing) {
      window.gameAudio.playPoliceSiren();
    }
    this.isPolicePursuing = true;
  }

  updateWantedUI() {
    const starEl = document.getElementById('hud-wanted-stars');
    if (!starEl) return;

    if (this.wantedLevel === 0) {
      starEl.textContent = '☆☆☆☆☆';
      starEl.classList.remove('wanted');
    } else if (this.wantedLevel === 1) {
      starEl.textContent = '★☆☆☆☆';
      starEl.classList.add('wanted');
    } else if (this.wantedLevel === 2) {
      starEl.textContent = '★★☆☆☆';
      starEl.classList.add('wanted');
    } else {
      starEl.textContent = '★★★☆☆';
      starEl.classList.add('wanted');
    }
  }

  updatePoliceCruiserPursuit() {
    if (!this.policeCar) return;

    // Player driving police cruiser does not chase itself!
    if (this.currentVehicle === 'police') return;

    if (this.wantedLevel > 0 && this.isPolicePursuing) {
      const targetPos = this.isDriving ? this.carPos : this.playerPos;
      const dx = targetPos.x - this.policeCar.position.x;
      const dz = targetPos.z - this.policeCar.position.z;
      const dist = Math.hypot(dx, dz);

      // Rotate police cruiser towards player
      const angle = Math.atan2(dx, dz);
      this.policeCar.rotation.y = angle;

      // Accelerate police cruiser in pursuit
      const chaseSpeed = 3.6;
      this.policeCar.position.x += Math.sin(angle) * chaseSpeed;
      this.policeCar.position.z += Math.cos(angle) * chaseSpeed;

      // If police cruiser reaches player -> APPREHENDED / BUSTED!
      if (dist < 22) {
        this.triggerPoliceBusted();
      }

      // Evade timer: If player escapes and 25s elapsed without collision
      if (Date.now() - this.lastWantedTime > 25000) {
        this.clearWantedLevel();
        this.showGameNotification("⭐ WANTED LEVEL EVADED // HIGHWAY PATROL CALLED OFF PURSUIT!");
      }
    }
  }

  triggerPoliceBusted() {
    this.wantedLevel = 0;
    this.isPolicePursuing = false;
    this.updateWantedUI();
    if (window.gameAudio) window.gameAudio.stopPoliceSiren();

    // Show Busted / Case Filed Modal Overlay
    const modal = document.getElementById('police-busted-modal');
    if (modal) modal.style.display = 'flex';

    // Halt player vehicle
    this.carSpeed = 0;
    this.carRoll = 0;
    this.carVy = 0;
  }

  dismissPoliceBusted() {
    const modal = document.getElementById('police-busted-modal');
    if (modal) modal.style.display = 'none';

    this.wantedLevel = 0;
    this.isPolicePursuing = false;
    this.updateWantedUI();
    if (window.gameAudio) window.gameAudio.stopPoliceSiren();

    // Respawn curbside at Campus Boulevard
    this.carPos = { x: 28, y: 0, z: -380 };
    this.carRot = Math.PI;
    this.carSpeed = 0;
    this.carRoll = 0;
    this.carVy = 0;
    if (this.car) {
      this.car.position.set(28, 0, -380);
      this.car.rotation.set(0, Math.PI, 0);
    }
    if (this.policeCar) {
      this.policeCar.position.set(65, 0, -360);
      this.policeCar.rotation.set(0, 0, 0);
    }
    this.showGameNotification("🚓 CITATION RESOLVED // RESUMED CURBSIDE ON CAMPUS BOULEVARD");
  }

  clearWantedLevel() {
    this.wantedLevel = 0;
    this.isPolicePursuing = false;
    this.updateWantedUI();
    if (window.gameAudio) window.gameAudio.stopPoliceSiren();
  }

  // ========================================================
  // LOS SANTOS CUSTOMS ROADSIDE RECOVERY & VEHICLE REPAIR
  // ========================================================
  dispatchTowTruck(targetWreck) {
    if (!this.towTruck) return;
    if (this.activeTowMission && this.activeTowMission.targetCar === targetWreck) return;

    this.activeTowMission = {
      targetCar: targetWreck,
      stage: 'en_route',
      targetPos: { x: targetWreck.position.x, z: targetWreck.position.z },
      timer: 0
    };

    this.showGameNotification("🚨 ROAD RESCUE DISPATCHED! Los Santos Customs Tow Truck en route to accident!");
    if (window.gameAudio && window.gameAudio.playTowTruckBeep) {
      window.gameAudio.playTowTruckBeep();
    }
  }

  updateTowTruckMission() {
    if (!this.towTruck) return;

    // Flashing amber strobe warning bar on truck roof
    if (this.towTruck.userData && this.towTruck.userData.strobeLight) {
      const flash = Math.sin(Date.now() * 0.015) > 0;
      this.towTruck.userData.strobeLight.material.color.setHex(flash ? 0xf59e0b : 0x451a03);
    }

    if (!this.activeTowMission) {
      // Parked in workshop bay apron
      this.towTruck.position.set(this.workshopSpawnPos.x, 0, this.workshopSpawnPos.z);
      this.towTruck.rotation.y = -Math.PI / 2;
      return;
    }

    const mission = this.activeTowMission;
    const target = mission.targetCar;

    if (mission.stage === 'en_route') {
      const destX = (target && target.position) ? target.position.x : mission.targetPos.x;
      const destZ = (target && target.position) ? target.position.z : mission.targetPos.z;

      const dx = destX - this.towTruck.position.x;
      const dz = destZ - this.towTruck.position.z;
      const dist = Math.hypot(dx, dz);

      const targetAngle = Math.atan2(dx, dz);
      this.towTruck.rotation.y = targetAngle;

      const towSpeed = 4.2;
      this.towTruck.position.x += Math.sin(targetAngle) * towSpeed;
      this.towTruck.position.z += Math.cos(targetAngle) * towSpeed;

      if (dist < 26) {
        mission.stage = 'repairing';
        mission.timer = Date.now();
        this.showGameNotification("🔧 RECOVERY CREW AT WORK! Repairing & winching car onto flatbed...");
        if (window.gameAudio && window.gameAudio.playRepairSound) {
          window.gameAudio.playRepairSound();
        }
      }
    } else if (mission.stage === 'repairing') {
      if (Date.now() - mission.timer > 2500) {
        // Restore wrecked traffic car cleanly back to highway flow
        if (target) {
          target.userData.isCrashed = false;
          target.userData.crashTumble = null;
          target.rotation.set(0, target.userData.isNorthbound ? 0 : Math.PI, 0);
          target.position.set(
            target.userData.initialLaneX || (target.userData.isNorthbound ? -28 : 28),
            0,
            target.position.z + (target.userData.isNorthbound ? 140 : -140)
          );
          target.userData.currentSpeed = target.userData.baseSpeed;
          if (target.userData.taillightMesh) target.userData.taillightMesh.material.color.setHex(0x7f1d1d);
        }

        mission.stage = 'returning';
        this.showGameNotification("✅ ACCIDENT SCENE CLEARED! Wrecked vehicle repaired & towed to Los Santos Customs!");
        if (window.gameAudio && window.gameAudio.playTowTruckBeep) {
          window.gameAudio.playTowTruckBeep();
        }
      }
    } else if (mission.stage === 'returning') {
      const dx = this.workshopSpawnPos.x - this.towTruck.position.x;
      const dz = this.workshopSpawnPos.z - this.towTruck.position.z;
      const dist = Math.hypot(dx, dz);

      if (dist > 15) {
        const angle = Math.atan2(dx, dz);
        this.towTruck.rotation.y = angle;
        this.towTruck.position.x += Math.sin(angle) * 3.8;
        this.towTruck.position.z += Math.cos(angle) * 3.8;
      } else {
        this.towTruck.position.set(this.workshopSpawnPos.x, 0, this.workshopSpawnPos.z);
        this.towTruck.rotation.y = -Math.PI / 2;
        this.activeTowMission = null;
      }
    }
  }

  repairCarInWorkshop() {
    this.carRoll = 0;
    this.carVy = 0;
    this.carY = 0;
    if (this.car) {
      this.car.position.y = 0;
      this.car.rotation.z = 0;
    }
    if (window.gameAudio && window.gameAudio.playRepairSound) {
      window.gameAudio.playRepairSound();
    }
    const modal = document.getElementById('workshop-modal');
    if (modal) modal.classList.remove('active');
    this.showGameNotification("🔧 100% CHASSIS REPAIR COMPLETE // WHEELS ALIGNED & BODY STRAIGHTENED!");
  }

  resprayCar(colorHex) {
    if (this.car && this.car.userData && this.car.userData.bodyMesh) {
      this.car.userData.bodyMesh.material.color.setHex(colorHex);
    } else if (this.car) {
      this.car.traverse(c => {
        if (c.isMesh && c.material && c.geometry && c.geometry.type === 'BoxGeometry' && c.position.y > 1 && c.position.y < 8) {
          c.material.color.setHex(colorHex);
        }
      });
    }
    if (window.gameAudio && window.gameAudio.playRepairSound) {
      window.gameAudio.playRepairSound();
    }
    const hexStr = '#' + colorHex.toString(16).padStart(6, '0');
    this.showGameNotification(`🎨 CUSTOM RESPRAY APPLIED // NEW LACQUER FINISH: ${hexStr.toUpperCase()}`);
  }

  callRoadsideRecovery() {
    this.repairCarInWorkshop();
    if (window.gameAudio && window.gameAudio.playTowTruckBeep) {
      window.gameAudio.playTowTruckBeep();
    }
    this.showGameNotification("🚚 MOBILE ROADSIDE RECOVERY // MECHANICS COMPLETED ONSITE REPAIRS!");
  }

  // ========================================================
  // HAMNA LUXURY MOTORSPORTS SHOWROOM SYSTEM
  // ========================================================
  openCarShowroom() {
    const modal = document.getElementById('car-showroom-modal');
    if (modal) {
      modal.classList.add('active');
      if (window.gameAudio) window.gameAudio.playUIHover();
    }
  }

  selectVehicleFromShowroom(modelId) {
    const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;
    let newMesh = null;
    let carName = "Exotic Supercar";
    let maxSpd = 8.8;
    let accel = 0.20;

    if (modelId === 'benz' || modelId === 'bens' || modelId === 'gwagon') {
      newMesh = window.GTARealisticEntities.createMercedesBenzGWagon(0x18181b, envMap);
      carName = "Mercedes-Benz G63 AMG 4MATIC V8";
      maxSpd = 9.0; accel = 0.23;
    } else if (modelId === 'bmw' || modelId === 'm4') {
      newMesh = window.GTARealisticEntities.createBmwM4Competition(0x0284c7, envMap);
      carName = "BMW M4 Competition Twin-Turbo";
      maxSpd = 9.5; accel = 0.25;
    } else if (modelId === 'rollsroyce' || modelId === 'rolsroys' || modelId === 'phantom') {
      newMesh = window.GTARealisticEntities.createRollsRoycePhantom(0x090d16, envMap);
      carName = "Rolls-Royce Phantom VIII Extended Limousine";
      maxSpd = 8.6; accel = 0.20;
    } else if (modelId === 'audi' || modelId === 'oudi' || modelId === 'r8') {
      newMesh = window.GTARealisticEntities.createAudiR8Supercar(0xf59e0b, envMap);
      carName = "Audi R8 V10 Plus Quattro Supercar";
      maxSpd = 9.8; accel = 0.26;
    } else if (modelId === 'innova' || modelId === 'crysta') {
      newMesh = window.GTARealisticEntities.createToyotaInnovaCrysta(0xe2e8f0, envMap);
      carName = "Toyota Innova Crysta 2.8 Touring MPV";
      maxSpd = 7.9; accel = 0.17;
    } else if (modelId === 'tesla' || modelId === 'plaid') {
      newMesh = window.GTARealisticEntities.createTeslaModelSPlaid(0xdc2626, envMap);
      carName = "Tesla Model S Plaid Tri-Motor AWD";
      maxSpd = 10.2; accel = 0.30;
    } else if (modelId === 'lamborghini') {
      newMesh = window.GTARealisticEntities.createLamborghiniHypercar(0x84cc16, envMap);
      carName = "Lamborghini Aventador SVJ V12";
      maxSpd = 9.8; accel = 0.25;
    } else if (modelId === 'porsche') {
      newMesh = window.GTARealisticEntities.createPorscheGT3Coupe(0xdc2626, envMap);
      carName = "Porsche 911 GT3 RS Track Coupe";
      maxSpd = 9.3; accel = 0.23;
    } else if (modelId === 'shelby') {
      newMesh = window.GTARealisticEntities.createVintageShelbyMuscle(0x1d4ed8, envMap);
      carName = "1967 Shelby GT500 Fastback Muscle";
      maxSpd = 8.5; accel = 0.21;
    } else if (modelId === 'eldorado') {
      newMesh = window.GTARealisticEntities.createVintageEldoradoClassic(0xb91c1c, envMap);
      carName = "1959 Cadillac Eldorado Classic Convertible";
      maxSpd = 7.8; accel = 0.16;
    } else if (modelId === 'cybertruck') {
      newMesh = window.GTARealisticEntities.createCyberArmoredSUV(0x64748b, envMap);
      carName = "Cyber Armored Titanium 4x4";
      maxSpd = 8.0; accel = 0.18;
    } else if (modelId === 'rangerover') {
      newMesh = window.GTARealisticEntities.createLuxuryVIPSUV(0x09090b, envMap);
      carName = "Range Rover SV Obsidian Black VIP";
      maxSpd = 8.4; accel = 0.19;
    } else if (modelId === 'police') {
      this.currentVehicle = 'police';
      this.isDriving = true;
      if (this.player) this.player.visible = false;
      this.policeCarPos.x = -200;
      this.policeCarPos.z = 195;
      this.policeCarRot = 0;
      if (this.policeCar) {
        this.policeCar.position.set(-200, 0, 195);
        this.policeCar.rotation.y = 0;
      }
      closeAllModals();
      if (window.gameAudio) window.gameAudio.playEngineStart();
      this.showGameNotification(`🚔 LAW ENFORCEMENT COMMISSIONED // You are now driving the Police Interceptor!`);
      return;
    } else {
      // Default Ferrari Supercar
      if (window.GTAModelLoader && window.GTAModelLoader.createRealSupercar) {
        newMesh = window.GTAModelLoader.createRealSupercar(0xf59e0b, envMap);
      } else {
        newMesh = window.GTARealisticEntities.createFerrariSupercar(0xf59e0b, envMap);
      }
      carName = "Ferrari F8 Tributo Supercar";
      maxSpd = 9.4; accel = 0.22;
    }

    if (newMesh) {
      const isShowroomOpen = document.getElementById('car-showroom-modal') && document.getElementById('car-showroom-modal').classList.contains('active');
      const targetX = isShowroomOpen ? -200 : (this.isDriving ? (this.currentVehicle === 'police' ? this.policeCarPos.x : this.carPos.x) : this.playerPos.x);
      const targetZ = isShowroomOpen ? 195 : (this.isDriving ? (this.currentVehicle === 'police' ? this.policeCarPos.z : this.carPos.z) : this.playerPos.z);
      const targetRot = isShowroomOpen ? 0 : (this.isDriving ? (this.currentVehicle === 'police' ? this.policeCarRot : this.carRot) : this.playerRot);

      if (this.car) this.scene.remove(this.car);
      this.car = newMesh;
      this.car.userData.isRealGLB = true;
      this.car.userData.customModel = modelId;
      this.carPos.x = targetX;
      this.carPos.z = targetZ;
      this.carRot = targetRot;
      this.car.position.set(this.carPos.x, 0, this.carPos.z);
      this.car.rotation.y = this.carRot;
      this.scene.add(this.car);
      this.carWheels = (this.car.userData && this.car.userData.carWheels) ? this.car.userData.carWheels : [];

      this.carMaxSpeed = maxSpd;
      this.carAcceleration = accel;
      this.currentVehicle = 'car';
      this.isDriving = true;
      if (this.player) this.player.visible = false;

      // Reset physics
      this.carRoll = 0;
      this.carPitch = 0;
      this.carY = 0;
      this.carVy = 0;
      this.carSpeed = 0;

      // Play rev audio & close modal
      closeAllModals();
      if (window.gameAudio) {
        if (window.gameAudio.playSupercarRev) window.gameAudio.playSupercarRev();
        if (window.gameAudio.playEngineStart) window.gameAudio.playEngineStart();
      }

      this.showGameNotification(`🏎️ PURCHASE CONFIRMED // Delivering your ${carName}! Press W to drive!`);
    }
  }

  // ========================================================
  // 911 EMERGENCY ACCIDENT DISPATCH (FIRE ENGINE & POLICE)
  // ========================================================
  dispatchEmergencyAccidentTeam(accidentPos, severity = 'traffic') {
    if (this.activeEmergencyMission && this.activeEmergencyMission.stage !== 'cleared') {
      return;
    }
    if (this._lastEmergencyDispatch && Date.now() - this._lastEmergencyDispatch < 6000) {
      return;
    }
    this._lastEmergencyDispatch = Date.now();

    const envMap = window.GTARealisticEnvironment ? window.GTARealisticEnvironment.envMap : null;

    // 1. Ensure 3D Fire Engine exists in scene
    if (!this.emergencyFireEngine) {
      if (window.GTARealisticEntities && window.GTARealisticEntities.createFireEngineTruck) {
        this.emergencyFireEngine = window.GTARealisticEntities.createFireEngineTruck(envMap);
        this.emergencyFireEngine.position.set(-140, 0, -420);
        this.scene.add(this.emergencyFireEngine);
      }
    }

    // 2. Ensure Emergency Police Pursuit Cruiser exists in scene
    if (!this.emergencyPoliceCruiser) {
      if (window.GTAModelLoader && window.GTAModelLoader.createRealPoliceCruiser) {
        this.emergencyPoliceCruiser = window.GTAModelLoader.createRealPoliceCruiser(envMap);
      } else if (window.GTARealisticEntities) {
        this.emergencyPoliceCruiser = window.GTARealisticEntities.createRealisticVehicle('police', 0x09090b, envMap);
      }
      if (this.emergencyPoliceCruiser) {
        this.emergencyPoliceCruiser.position.set(180, 0, -370);
        this.scene.add(this.emergencyPoliceCruiser);
      }
    }

    this.activeEmergencyMission = {
      targetPos: { x: accidentPos.x, z: accidentPos.z },
      stage: 'responding',
      startTime: Date.now(),
      arrivedTime: 0,
      sprayMesh: null
    };

    // Audio: sirens blaring & emergency horns
    if (window.gameAudio) {
      if (window.gameAudio.playFireSiren) window.gameAudio.playFireSiren();
      if (window.gameAudio.playFireHorn) window.gameAudio.playFireHorn();
      if (window.gameAudio.playPoliceSiren) window.gameAudio.playPoliceSiren();
    }

    this.showGameNotification("🚨 911 EMERGENCY DISPATCH! Fire Rescue Engine 🚒 & Police Cruiser 🚓 en route to accident!");
  }

  updateEmergencyMission() {
    if (!this.activeEmergencyMission) return;
    const mission = this.activeEmergencyMission;
    const fireTruck = this.emergencyFireEngine;
    const policeCar = this.emergencyPoliceCruiser;

    // Animate Fire Engine strobes
    if (fireTruck && fireTruck.userData && fireTruck.userData.redStrobe) {
      const flash = Math.sin(Date.now() * 0.02) > 0;
      fireTruck.userData.redStrobe.material.color.setHex(flash ? 0xff2222 : 0x440000);
      fireTruck.userData.blueStrobe.material.color.setHex(!flash ? 0x2288ff : 0x001144);
    }

    if (mission.stage === 'responding') {
      let fireArrived = false;
      let policeArrived = false;

      // Fire Engine navigation towards accidentPos
      if (fireTruck) {
        const dx = mission.targetPos.x - fireTruck.position.x;
        const dz = (mission.targetPos.z + 12) - fireTruck.position.z;
        const dist = Math.hypot(dx, dz);
        if (dist > 22) {
          const angle = Math.atan2(dx, dz);
          fireTruck.rotation.y = angle;
          const spd = 4.8;
          fireTruck.position.x += Math.sin(angle) * spd;
          fireTruck.position.z += Math.cos(angle) * spd;
        } else {
          fireArrived = true;
        }
      } else {
        fireArrived = true;
      }

      // Police Cruiser navigation towards accidentPos (offset to park alongside)
      if (policeCar) {
        const dx = (mission.targetPos.x - 14) - policeCar.position.x;
        const dz = (mission.targetPos.z - 10) - policeCar.position.z;
        const dist = Math.hypot(dx, dz);
        if (dist > 18) {
          const angle = Math.atan2(dx, dz);
          policeCar.rotation.y = angle;
          const spd = 5.2;
          policeCar.position.x += Math.sin(angle) * spd;
          policeCar.position.z += Math.cos(angle) * spd;
        } else {
          policeArrived = true;
        }
      } else {
        policeArrived = true;
      }

      if (fireArrived && policeArrived) {
        mission.stage = 'at_scene';
        mission.arrivedTime = Date.now();

        // Create Dynamic Water Foam Spray Cone from Fire Engine Cannon!
        if (fireTruck && !mission.sprayMesh) {
          const sprayGeo = new THREE.ConeGeometry(5, 24, 12);
          const sprayMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.65, wireframe: true });
          const spray = new THREE.Mesh(sprayGeo, sprayMat);
          spray.rotation.x = Math.PI / 2;
          spray.position.set(0, 8, 12);
          fireTruck.add(spray);
          mission.sprayMesh = spray;
        }

        this.showGameNotification("🚒 FIRST RESPONDERS ON SCENE! Firefighters deploying water cannons & Police securing area!");
      }
    } else if (mission.stage === 'at_scene') {
      // Pulsate water foam
      if (mission.sprayMesh) {
        mission.sprayMesh.scale.set(
          1 + Math.sin(Date.now() * 0.03) * 0.3,
          1 + Math.cos(Date.now() * 0.03) * 0.2,
          1
        );
      }

      // After 3.5 seconds on scene, accident is extinguished and cleared!
      if (Date.now() - mission.arrivedTime > 3500) {
        if (mission.sprayMesh && fireTruck) {
          fireTruck.remove(mission.sprayMesh);
          mission.sprayMesh = null;
        }

        // Repair player vehicle if damaged
        this.repairCarInWorkshop();
        this.clearWantedLevel();

        // Audio sirens stop
        if (window.gameAudio) {
          if (window.gameAudio.stopFireSiren) window.gameAudio.stopFireSiren();
          if (window.gameAudio.stopPoliceSiren) window.gameAudio.stopPoliceSiren();
        }

        this.showGameNotification("✅ ACCIDENT RESOLVED! Fire extinguished, injured cleared & Police reopened traffic lanes!");
        mission.stage = 'returning';
      }
    } else if (mission.stage === 'returning') {
      // Return Fire Truck to base (-140, 0, -420)
      let fireHome = false;
      let policeHome = false;

      if (fireTruck) {
        const dx = -140 - fireTruck.position.x;
        const dz = -420 - fireTruck.position.z;
        const dist = Math.hypot(dx, dz);
        if (dist > 15) {
          const angle = Math.atan2(dx, dz);
          fireTruck.rotation.y = angle;
          fireTruck.position.x += Math.sin(angle) * 3.6;
          fireTruck.position.z += Math.cos(angle) * 3.6;
        } else {
          fireHome = true;
        }
      } else {
        fireHome = true;
      }

      // Return Police Cruiser to base (180, 0, -370)
      if (policeCar) {
        const dx = 180 - policeCar.position.x;
        const dz = -370 - policeCar.position.z;
        const dist = Math.hypot(dx, dz);
        if (dist > 15) {
          const angle = Math.atan2(dx, dz);
          policeCar.rotation.y = angle;
          policeCar.position.x += Math.sin(angle) * 4.0;
          policeCar.position.z += Math.cos(angle) * 4.0;
        } else {
          policeHome = true;
        }
      } else {
        policeHome = true;
      }

      if (fireHome && policeHome) {
        this.activeEmergencyMission = null;
      }
    }
  }

  checkLandmarkProximity() {
    const isPolice = (this.currentVehicle === 'police');
    const checkPos = this.isDriving ? (isPolice ? this.policeCarPos : this.carPos) : this.playerPos;
    let closestLandmark = null;
    let minDistance = Infinity;

    for (let i = 0; i < this.landmarks.length; i++) {
      const lm = this.landmarks[i];
      const dist = Math.hypot(checkPos.x - lm.x, checkPos.z - lm.z);
      if (dist < lm.radius && dist < minDistance) {
        minDistance = dist;
        closestLandmark = lm;
      }
    }

    this.activeInteraction = closestLandmark;
    const promptEl = document.getElementById('game-action-prompt');
    if (!promptEl) return;

    let targetHTML = '';
    let shouldBeVisible = false;

    if (closestLandmark) {
      shouldBeVisible = true;
      if (closestLandmark.id.startsWith('ktu')) {
        targetHTML = `<span>[E]</span> INSPECT: ${closestLandmark.name.toUpperCase()}`;
      } else {
        targetHTML = `<span>[E]</span> ENTER: ${closestLandmark.name.toUpperCase()}`;
      }
    } else {
      if (!this.isDriving) {
        const distToCar = Math.hypot(this.playerPos.x - this.carPos.x, this.playerPos.z - this.carPos.z);
        const distToPolice = this.policeCar ? Math.hypot(this.playerPos.x - this.policeCarPos.x, this.playerPos.z - this.policeCarPos.z) : Infinity;

        if (distToPolice < 45 && distToPolice <= distToCar) {
          shouldBeVisible = true;
          targetHTML = `<span>[F]</span> DRIVE POLICE INTERCEPTOR CRUISER`;
        } else if (distToCar < 45) {
          shouldBeVisible = true;
          targetHTML = `<span>[F]</span> DRIVE GROTTI TURISMO R SUPERCAR`;
        }
      }
    }

    // Only update DOM if state changed to avoid layout thrashing
    if (this._lastPromptHTML !== targetHTML) {
      promptEl.innerHTML = targetHTML;
      this._lastPromptHTML = targetHTML;
    }
    if (this._lastPromptVisible !== shouldBeVisible) {
      promptEl.classList.toggle('visible', shouldBeVisible);
      this._lastPromptVisible = shouldBeVisible;
    }
  }

  updateCamera() {
    const isPolice = (this.currentVehicle === 'police');
    const targetPos = this.isDriving ? (isPolice ? this.policeCarPos : this.carPos) : this.playerPos;
    const targetY = this.isDriving ? (isPolice ? (this.policeCarY || 0) : (this.carY || 0)) : (this.jumpY || 0);
    const activeSpeed = isPolice ? this.policeCarSpeed : this.carSpeed;
    const activeMaxSpeed = isPolice ? (this.policeCarMaxSpeed || 8.2) : (this.carMaxSpeed || 8.5);
    const activeRot = isPolice ? this.policeCarRot : this.carRot;

    let dist, height, lookOffsetY;

    if (this.isDriving) {
      // Dynamic camera in vehicle (Real GTA V Driving View Mode)
      dist = this.cameraTargetDist ? (this.cameraTargetDist * 1.15) : 80;
      height = 22.0;
      lookOffsetY = 6.0;

      // Dynamic High-Speed FOV expansion (60 deg -> 70 deg)
      const speedRatio = Math.min(1.0, Math.abs(activeSpeed) / activeMaxSpeed);
      const targetFov = 60 + speedRatio * 8.0;
      if (Math.abs(this.camera.fov - targetFov) > 0.1) {
        this.camera.fov += (targetFov - this.camera.fov) * 0.08;
        this.camera.updateProjectionMatrix();
      }

      // High-speed slight camera pullback for velocity feel
      dist += speedRatio * 6.0;
    } else {
      // Spacious, Grand 3rd-Person Open View Mode (Comfortable GTA V Perspective)
      dist = this.cameraTargetDist || 72;
      height = 18.0;
      lookOffsetY = 8.5; // High enough to clearly see Hamna, boulevard, and skyline

      if (Math.abs(this.camera.fov - 60) > 0.1) {
        this.camera.fov += (60 - this.camera.fov) * 0.1;
        this.camera.updateProjectionMatrix();
      }
    }

    // 4 Authentic GTA 5 Camera Modes
    if (this.cameraMode === 1) { // Far Cinematic
      dist *= 1.4;
      height *= 1.3;
      lookOffsetY += 3;
    } else if (this.cameraMode === 2) { // Low-Angle Action Chase
      dist *= 0.75;
      height *= 0.7;
      lookOffsetY = this.isDriving ? 4.0 : 5.0;
    } else if (this.cameraMode === 3) { // Hood / 1st-Person
      dist = this.isDriving ? -5.0 : -0.5;
      height = this.isDriving ? 5.2 : 8.5;
      lookOffsetY = this.isDriving ? 4.2 : 8.0;
    }

    // Auto-align camera behind player/vehicle when moving and user hasn't moved mouse recently
    const timeSinceMouseLook = Date.now() - (this.lastMouseLookTime || 0);
    if (timeSinceMouseLook > 1200) {
      if (this.isDriving && Math.abs(activeSpeed) > 0.25) {
        let rotDiff = activeRot - this.cameraYaw;
        while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
        while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
        this.cameraYaw += rotDiff * 0.05;
      } else if (!this.isDriving && this.isPlayerMoving) {
        let rotDiff = this.playerRot - this.cameraYaw;
        while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
        while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
        this.cameraYaw += rotDiff * 0.035;
      }
    }

    // Spherical position from target using cameraYaw & cameraPitch
    const cosPitch = Math.cos(this.cameraPitch);
    const sinPitch = Math.sin(this.cameraPitch);

    const camOffsetX = -Math.sin(this.cameraYaw) * dist * cosPitch;
    const camOffsetZ = -Math.cos(this.cameraYaw) * dist * cosPitch;
    const camOffsetY = height + dist * sinPitch;

    const desiredCamX = targetPos.x + camOffsetX;
    let desiredCamY = targetY + camOffsetY;
    const desiredCamZ = targetPos.z + camOffsetZ;

    // Minimum Camera Floor: Prevents camera from dipping into road or curbs
    desiredCamY = Math.max(3.8, desiredCamY);

    const lerpSpeed = this.isDriving ? 0.12 : 0.16;
    this.camera.position.x += (desiredCamX - this.camera.position.x) * lerpSpeed;
    this.camera.position.y += (desiredCamY - this.camera.position.y) * lerpSpeed;
    this.camera.position.z += (desiredCamZ - this.camera.position.z) * lerpSpeed;

    this.camera.lookAt(targetPos.x, targetY + lookOffsetY, targetPos.z);
  }

  renderMinimap() {
    if (!this.minimapCtx) return;
    const ctx = this.minimapCtx;
    const size = 160;
    ctx.clearRect(0, 0, size, size);

    // Radar Dark Circular Background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = this.wantedLevel > 0 ? (Math.sin(Date.now() * 0.02) > 0 ? '#ef4444' : '#38bdf8') : '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    const isPolice = (this.currentVehicle === 'police');
    const centerPos = this.isDriving ? (isPolice ? this.policeCarPos : this.carPos) : this.playerPos;
    const scale = 0.075;

    // Draw Highway & Avenue Grid lines on Minimap (Full Playable Metropolis Road Grid)
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.45)';
    ctx.lineWidth = 4;

    // Central Grand Highway (x = 0)
    const hwyScreenX = (0 - centerPos.x) * scale + size / 2;
    if (hwyScreenX >= 0 && hwyScreenX <= size) {
      ctx.beginPath();
      ctx.moveTo(hwyScreenX, 0);
      ctx.lineTo(hwyScreenX, size);
      ctx.stroke();
    }
    // Coastal Promenade Highway (x = -560)
    const coastScreenX = (-560 - centerPos.x) * scale + size / 2;
    if (coastScreenX >= 0 && coastScreenX <= size) {
      ctx.beginPath();
      ctx.moveTo(coastScreenX, 0);
      ctx.lineTo(coastScreenX, size);
      ctx.stroke();
    }
    // East Tech Parkway (x = 460)
    const eastScreenX = (460 - centerPos.x) * scale + size / 2;
    if (eastScreenX >= 0 && eastScreenX <= size) {
      ctx.beginPath();
      ctx.moveTo(eastScreenX, 0);
      ctx.lineTo(eastScreenX, size);
      ctx.stroke();
    }
    // Avenue 1 (z = 0)
    const ave1ScreenZ = (0 - centerPos.z) * scale + size / 2;
    if (ave1ScreenZ >= 0 && ave1ScreenZ <= size) {
      ctx.beginPath();
      ctx.moveTo(0, ave1ScreenZ);
      ctx.lineTo(size, ave1ScreenZ);
      ctx.stroke();
    }
    // Avenue 2 (z = -240)
    const ave2ScreenZ = (-240 - centerPos.z) * scale + size / 2;
    if (ave2ScreenZ >= 0 && ave2ScreenZ <= size) {
      ctx.beginPath();
      ctx.moveTo(0, ave2ScreenZ);
      ctx.lineTo(size, ave2ScreenZ);
      ctx.stroke();
    }
    // Avenue 3 (z = 240)
    const ave3ScreenZ = (240 - centerPos.z) * scale + size / 2;
    if (ave3ScreenZ >= 0 && ave3ScreenZ <= size) {
      ctx.beginPath();
      ctx.moveTo(0, ave3ScreenZ);
      ctx.lineTo(size, ave3ScreenZ);
      ctx.stroke();
    }
    // Avenue 4 (z = 520) - Silicon Towers Boulevard
    const ave4ScreenZ = (520 - centerPos.z) * scale + size / 2;
    if (ave4ScreenZ >= 0 && ave4ScreenZ <= size) {
      ctx.beginPath();
      ctx.moveTo(0, ave4ScreenZ);
      ctx.lineTo(size, ave4ScreenZ);
      ctx.stroke();
    }
    // Avenue 5 (z = -480) - Police Precinct Boulevard
    const ave5ScreenZ = (-480 - centerPos.z) * scale + size / 2;
    if (ave5ScreenZ >= 0 && ave5ScreenZ <= size) {
      ctx.beginPath();
      ctx.moveTo(0, ave5ScreenZ);
      ctx.lineTo(size, ave5ScreenZ);
      ctx.stroke();
    }

    // Draw Landmark Pins (5 Villages, Police HQ, Pier Marina, Silicon Towers, Datacenter, Waterfall, Mountains)
    this.landmarks.forEach(lm => {
      const rx = (lm.x - centerPos.x) * scale + size / 2;
      const rz = (lm.z - centerPos.z) * scale + size / 2;
      if (Math.hypot(rx - size / 2, rz - size / 2) < size / 2 - 12) {
        ctx.font = '13px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(lm.icon, rx, rz);
      }
    });

    // Draw Flashing Police Cruiser Blip on Radar when Wanted (if not driving it)
    if (this.policeCar && this.wantedLevel > 0 && !isPolice) {
      const px = (this.policeCar.position.x - centerPos.x) * scale + size / 2;
      const pz = (this.policeCar.position.z - centerPos.z) * scale + size / 2;
      if (Math.hypot(px - size / 2, pz - size / 2) < size / 2 - 8) {
        ctx.fillStyle = (Math.sin(Date.now() * 0.02) > 0) ? '#ef4444' : '#3b82f6';
        ctx.beginPath();
        ctx.arc(px, pz, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // Player Direction Arrow
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate(-(this.isDriving ? (isPolice ? this.policeCarRot : this.carRot) : this.playerRot));
    ctx.fillStyle = isPolice ? '#60a5fa' : '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(5, 6);
    ctx.lineTo(0, 3);
    ctx.lineTo(-5, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  showGameNotification(text) {
    const banner = document.getElementById('game-quest-banner');
    if (banner) {
      banner.innerHTML = `<i class="fas fa-bullhorn"></i> ${text}`;
      banner.classList.add('show');
      setTimeout(() => banner.classList.remove('show'), 5000);
    }
  }

  updateHUDVehicleStatus(isDriving, vehicleName = '') {
    const speedGauge = document.getElementById('hud-speedometer-box');
    if (speedGauge) speedGauge.style.display = isDriving ? 'flex' : 'none';
    this.updateLocationHUD();
  }

  warpToLandmark(id) {
    if (id === 'education' || id === 'ktu') id = 'village_education';
    if (id === 'skills') id = 'village_skills';
    if (id === 'experience') id = 'village_experience';
    if (id === 'projects') id = 'village_projects';
    if (id === 'profile' || id === 'home') id = 'village_profile';
    if (id === 'lighthouse') id = 'beacon';
    if (id === 'mountains' || id === 'mountain') id = 'mountains';
    if (id === 'waterfall' || id === 'park') id = 'waterfall';
    if (id === 'police' || id === 'police_station' || id === 'station') id = 'police_hq';
    if (id === 'pier' || id === 'marina') id = 'coastal_pier';
    if (id === 'beach' || id === 'golden_beach' || id === 'pacific_beach') id = 'beach_resort';
    if (id === 'bridge' || id === 'palam' || id === 'gateway') id = 'gateway_bridge';
    if (id === 'sports' || id === 'arena' || id === 'playground' || id === 'ground' || id === 'pitch') id = 'sports_arena';
    if (id === 'certificates' || id === 'certs' || id === 'honors' || id === 'cert') id = 'certificates_pavilion';
    if (id === 'silicon' || id === 'towers' || id === 'ai_tower') id = 'silicon_towers';
    if (id === 'datacenter' || id === 'cloud' || id === 'server') id = 'datacenter_park';
    if (id === 'showroom' || id === 'cars' || id === 'motorsports' || id === 'car_showroom' || id === 'dealership') id = 'car_showroom';

    const lm = this.landmarks.find(l => l.id === id);
    if (!lm) return;

    if (this.isDriving) {
      const isPolice = (this.currentVehicle === 'police');
      const activePos = isPolice ? this.policeCarPos : this.carPos;
      const activeMesh = isPolice ? this.policeCar : this.car;

      activePos.x = lm.x + 15;
      activePos.z = lm.z + 15;
      if (activeMesh) activeMesh.position.set(activePos.x, 0, activePos.z);
      this.cameraYaw = isPolice ? this.policeCarRot : this.carRot;
      this.cameraPitch = 0.26;
    } else {
      this.playerPos.x = lm.x;
      this.playerPos.z = lm.z + 20;
      this.player.position.set(this.playerPos.x, 0, this.playerPos.z);
      this.cameraYaw = Math.PI;
      this.cameraPitch = 0.26;
      this.playerRot = Math.PI;
    }

    this.showGameNotification(`⚡ FAST TRAVEL TO: ${lm.name.toUpperCase()}`);
    if (window.gameAudio) window.gameAudio.playDiscoveryChime();
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

window.OpenWorldGame = OpenWorldGame;
