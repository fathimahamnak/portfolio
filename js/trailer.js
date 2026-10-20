// ========================================================
// 10D Cinematic Movie Trailer Engine
// Autonomous 3D camera navigation & spatial warp tour
// ========================================================

class CinematicTrailer {
  constructor() {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentSceneIndex = 0;
    this.sceneTimer = null;
    this.typewriterInterval = null;

    this.scenes = [
      {
        depth: 0,
        chapter: 'ACT 01 // SYSTEM INITIALIZATION',
        subtitle: 'Meet Fathima Hamna K — Python Fullstack Developer & Software Engineer engineering resilient web architectures.',
        duration: 6500
      },
      {
        depth: 1400,
        chapter: 'ACT 02 // NEURAL TECH STACK',
        subtitle: 'Frontends built with modular React.js. Backends powered by Python & Django with high-throughput REST APIs and MySQL.',
        duration: 7000
      },
      {
        depth: 2800,
        chapter: 'ACT 03 // COLLAB-HUB ECOSYSTEM',
        subtitle: 'Collab-Hub: Full-stack platform bridging ambitious startups with global venture investors, featuring secure auth and profile management.',
        duration: 7500
      },
      {
        depth: 4200,
        chapter: 'ACT 04 // TRENDROVE AI INTELLIGENCE',
        subtitle: 'Trendrove: AI-driven fashion engine analyzing skin-tone harmonies and automated outfit combinations.',
        duration: 7500
      },
      {
        depth: 5600,
        chapter: 'ACT 05 // PRODUCTION EXPERIENCE',
        subtitle: 'Industry-proven at Cognilearn (R&D) and Softroniics (Python Fullstack), backed by MCA from KTU.',
        duration: 7000
      },
      {
        depth: 7000,
        chapter: 'ACT 06 // MISSION CONTROL & UPLINK',
        subtitle: 'Ready to engineer your next high-impact software system. Available for immediate developer roles.',
        duration: 6500
      }
    ];

    this.initElements();
  }

  initElements() {
    this.overlay = document.getElementById('cinematic-overlay');
    this.subtitleEl = document.getElementById('cinematic-subtitle');
    this.chapterEl = document.getElementById('cinematic-chapter');
    this.progressBar = document.getElementById('cinematic-progress');
    this.playBtn = document.getElementById('start-trailer-btn');
    this.navPlayBtn = document.getElementById('nav-trailer-btn');
    this.pauseBtn = document.getElementById('trailer-pause-btn');
    this.skipBtn = document.getElementById('trailer-skip-btn');
    this.exitBtn = document.getElementById('trailer-exit-btn');

    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.start());
    }
    if (this.navPlayBtn) {
      this.navPlayBtn.addEventListener('click', () => this.start());
    }
    if (this.pauseBtn) {
      this.pauseBtn.addEventListener('click', () => this.togglePause());
    }
    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', () => this.nextScene());
    }
    if (this.exitBtn) {
      this.exitBtn.addEventListener('click', () => this.stop());
    }
  }

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.isPaused = false;
    this.currentSceneIndex = 0;

    document.body.classList.add('cinema-mode');
    if (this.overlay) {
      this.overlay.classList.add('active');
    }

    if (window.soundEngine) {
      window.soundEngine.playWhoosh();
      window.soundEngine.startCinematicDrone();
    }

    this.playScene(0);
  }

  playScene(index) {
    if (!this.isPlaying || index >= this.scenes.length) {
      this.finish();
      return;
    }

    this.currentSceneIndex = index;
    const scene = this.scenes[index];

    // Fly flight engine to exact sector depth
    if (window.flightEngine) {
      window.flightEngine.warpToDepth(scene.depth);
    }

    // Update Chapter Title
    if (this.chapterEl) {
      this.chapterEl.textContent = scene.chapter;
    }

    // Typewriter effect for narrative subtitle
    this.typeSubtitle(scene.subtitle);

    // Progress bar animation
    if (this.progressBar) {
      this.progressBar.style.transition = 'none';
      this.progressBar.style.width = '0%';
      setTimeout(() => {
        if (this.isPlaying && !this.isPaused) {
          this.progressBar.style.transition = `width ${scene.duration}ms linear`;
          this.progressBar.style.width = '100%';
        }
      }, 50);
    }

    if (window.soundEngine) {
      window.soundEngine.playBeep(480 + index * 70, 'sine', 0.15, 0.08);
    }

    clearTimeout(this.sceneTimer);
    this.sceneTimer = setTimeout(() => {
      if (this.isPlaying && !this.isPaused) {
        this.playScene(index + 1);
      }
    }, scene.duration);
  }

  typeSubtitle(text) {
    clearInterval(this.typewriterInterval);
    if (!this.subtitleEl) return;

    this.subtitleEl.textContent = '';
    let i = 0;
    this.typewriterInterval = setInterval(() => {
      if (i < text.length) {
        this.subtitleEl.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(this.typewriterInterval);
      }
    }, 26);
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.pauseBtn) {
      this.pauseBtn.innerHTML = this.isPaused
        ? '<i class="fas fa-play"></i> RESUME'
        : '<i class="fas fa-pause"></i> PAUSE';
    }

    if (this.isPaused) {
      clearTimeout(this.sceneTimer);
      if (this.progressBar) {
        const computedWidth = window.getComputedStyle(this.progressBar).width;
        this.progressBar.style.transition = 'none';
        this.progressBar.style.width = computedWidth;
      }
    } else {
      this.nextScene();
    }
  }

  nextScene() {
    clearTimeout(this.sceneTimer);
    this.playScene(this.currentSceneIndex + 1);
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    clearTimeout(this.sceneTimer);
    clearInterval(this.typewriterInterval);

    document.body.classList.remove('cinema-mode');
    if (this.overlay) {
      this.overlay.classList.remove('active');
    }

    if (window.soundEngine) {
      window.soundEngine.stopCinematicDrone();
      window.soundEngine.playClick();
    }
  }

  finish() {
    this.stop();
    if (window.flightEngine) {
      window.flightEngine.warpToDepth(7000); // Dock at Uplink
    }
  }
}

window.CinematicTrailer = CinematicTrailer;
