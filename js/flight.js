// ========================================================
// 10D Spatial Flight Engine: Continuous Z-Axis Fly-Through
// Navigates camera through 3D portals on free scroll
// ========================================================

class SpatialFlightEngine {
  constructor() {
    this.currentDepth = 0;
    this.targetDepth = 0;
    this.maxDepth = 7500;
    this.isFlying = false;
    this.lastTouchY = 0;

    // Sector waypoints in 3D Space
    this.sectors = [
      { id: 'hero-sector', anchor: 0, name: 'ACT 01: HERO CORE', camX: 0, camY: 0, rotY: 0, rotZ: 0 },
      { id: 'skills-sector', anchor: 1400, name: 'ACT 02: NEURAL STACK', camX: -60, camY: 30, rotY: -0.12, rotZ: -0.03 },
      { id: 'collabhub-sector', anchor: 2800, name: 'ACT 03: COLLAB-HUB', camX: 70, camY: -20, rotY: 0.14, rotZ: 0.04 },
      { id: 'trendrove-sector', anchor: 4200, name: 'ACT 04: TRENDROVE AI', camX: -70, camY: -10, rotY: -0.12, rotZ: -0.03 },
      { id: 'journey-sector', anchor: 5600, name: 'ACT 05: EXPERIENCE & MCA', camX: 40, camY: 20, rotY: 0.08, rotZ: 0.02 },
      { id: 'uplink-sector', anchor: 7000, name: 'ACT 06: COMMAND & UPLINK', camX: 0, camY: 0, rotY: 0, rotZ: 0 }
    ];

    this.activeSectorIndex = 0;
    this.init();
  }

  init() {
    // 1. Wheel Scroll Listener (Replaces boring vertical scroll with 3D Z-flight)
    window.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

    // 2. Touch Gestures for mobile/tablets
    window.addEventListener('touchstart', (e) => {
      this.lastTouchY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      const delta = (this.lastTouchY - e.touches[0].clientY) * 2.2;
      this.lastTouchY = e.touches[0].clientY;
      this.targetDepth = Math.max(0, Math.min(this.maxDepth, this.targetDepth + delta));
    }, { passive: true });

    // 3. Keyboard Arrow Navigation
    window.addEventListener('keydown', (e) => {
      // Don't intercept if user is typing in terminal or input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        this.warpToNextSector();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        this.warpToPrevSector();
      }
    });

    // 4. Flight Rail Waypoint Clicks
    document.querySelectorAll('.flight-waypoint-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetAnchor = parseInt(btn.getAttribute('data-anchor'), 10);
        this.warpToDepth(targetAnchor);
      });
    });

    // 5. Header Nav Links Warp Integration
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const targetMap = {
          '#hero': 0,
          '#skills': 1400,
          '#projects': 2800,
          '#experience': 5600,
          '#education': 5600,
          '#terminal': 7000,
          '#contact': 7000
        };
        if (targetMap[href] !== undefined) {
          e.preventDefault();
          this.warpToDepth(targetMap[href]);
        }
      });
    });

    // Start render loop
    this.animate();
  }

  onWheel(e) {
    // Check if the event target is inside an internally scrollable element (like terminal or modal)
    let el = e.target;
    let isInsideScrollable = false;
    while (el && el !== document.body) {
      if (el.scrollHeight > el.clientHeight && (el.classList.contains('terminal-body') || el.classList.contains('modal-container'))) {
        isInsideScrollable = true;
        break;
      }
      el = el.parentElement;
    }

    if (isInsideScrollable) return; // Allow normal scroll inside terminal

    e.preventDefault();
    const delta = e.deltaY * 1.6;
    this.targetDepth = Math.max(0, Math.min(this.maxDepth, this.targetDepth + delta));

    // Play subtle warp buzz when scrolling fast
    if (Math.abs(e.deltaY) > 80 && window.soundEngine && Math.random() < 0.15) {
      window.soundEngine.playHover();
    }
  }

  warpToDepth(anchor) {
    if (window.soundEngine) window.soundEngine.playWarp();
    this.targetDepth = Math.max(0, Math.min(this.maxDepth, anchor));
  }

  warpToNextSector() {
    if (this.activeSectorIndex < this.sectors.length - 1) {
      this.warpToDepth(this.sectors[this.activeSectorIndex + 1].anchor);
    }
  }

  warpToPrevSector() {
    if (this.activeSectorIndex > 0) {
      this.warpToDepth(this.sectors[this.activeSectorIndex - 1].anchor);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Inertial physics lerp
    const diff = this.targetDepth - this.currentDepth;
    this.currentDepth += diff * 0.08;

    // Determine active sector
    let closestIndex = 0;
    let minDistance = Infinity;

    this.sectors.forEach((sec, idx) => {
      const d = Math.abs(this.currentDepth - sec.anchor);
      if (d < minDistance) {
        minDistance = d;
        closestIndex = idx;
      }
    });

    if (closestIndex !== this.activeSectorIndex) {
      this.activeSectorIndex = closestIndex;
      this.updateHUD();
    }

    // Interpolate camera banking & trajectory between sectors
    const currentSec = this.sectors[this.activeSectorIndex];
    const targetZ = 800 - this.currentDepth;

    if (window.universe) {
      window.universe.setFlightState({
        x: currentSec.camX,
        y: currentSec.camY,
        z: targetZ,
        rotY: currentSec.rotY,
        rotZ: currentSec.rotZ,
        velocity: Math.abs(diff)
      });
    }

    // Transform DOM Sector Portals in 3D Space
    this.renderSectors3D();
  }

  renderSectors3D() {
    this.sectors.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (!el) return;

      // Distance from camera to this sector
      const dist = sec.anchor - this.currentDepth;

      if (dist > 1800) {
        // Deep in background ahead
        el.style.transform = `translate3d(0, 0, -2000px) scale(0.15)`;
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        el.style.visibility = 'hidden';
      } else if (dist > 0) {
        // Approaching camera from front
        const progress = 1 - (dist / 1800);
        const zTranslate = -dist * 0.8;
        const scale = 0.4 + progress * 0.6;
        const opacity = Math.min(1, Math.max(0, (progress - 0.2) * 1.3));

        el.style.visibility = 'visible';
        el.style.transform = `translate3d(0, 0, ${zTranslate}px) scale(${scale})`;
        el.style.opacity = opacity;
        el.style.pointerEvents = progress > 0.85 ? 'auto' : 'none';
      } else if (dist >= -600) {
        // Active in focus / passing through
        const progress = Math.abs(dist) / 600;
        const zTranslate = Math.abs(dist) * 1.2;
        const scale = 1 + progress * 0.4;
        const opacity = Math.max(0, 1 - progress * 1.2);

        el.style.visibility = 'visible';
        el.style.transform = `translate3d(0, 0, ${zTranslate}px) scale(${scale})`;
        el.style.opacity = opacity;
        el.style.pointerEvents = progress < 0.3 ? 'auto' : 'none';
      } else {
        // Passed behind camera
        el.style.transform = `translate3d(0, 0, 1000px) scale(1.6)`;
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        el.style.visibility = 'hidden';
      }
    });
  }

  updateHUD() {
    const activeSec = this.sectors[this.activeSectorIndex];

    // Update Depth Readout
    const depthEl = document.getElementById('flight-depth-display');
    if (depthEl) {
      depthEl.textContent = `${Math.round(this.currentDepth * 1.2)} LY`;
    }

    // Update Sector Badge
    const sectorEl = document.getElementById('flight-sector-display');
    if (sectorEl) {
      sectorEl.textContent = activeSec.name;
    }

    // Update Flight Rail Waypoints
    document.querySelectorAll('.flight-waypoint-btn').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === this.activeSectorIndex);
    });

    // Update Header Nav Links
    const navAnchors = ['#hero', '#skills', '#projects', '#projects', '#experience', '#contact'];
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === navAnchors[this.activeSectorIndex]);
    });
  }
}

window.SpatialFlightEngine = SpatialFlightEngine;
