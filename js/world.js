// ========================================================
// Living World Game Engine & Interactive Climate System
// Weather simulations (Sun, Sunset, Rain, Night) & NPC Dialogues
// ========================================================

class LivingWorldEngine {
  constructor() {
    this.currentClimate = 'day';
    this.canvas = document.getElementById('weather-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.weatherParticles = [];
    this.animationFrame = null;

    this.npcQuotes = {
      founder: {
        name: 'Maya (Startup Founder)',
        avatar: '👩‍💻',
        text: '“Hamna engineered our investor pitch system using Django and React in Collab-Hub! Form validation and data pipelines are bulletproof.”'
      },
      investor: {
        name: 'David Vance (Angel Investor)',
        avatar: '👔',
        text: '“The clean architectural design of Collab-Hub makes evaluating startup metrics effortless. Hamna’s backend is truly scalable.”'
      },
      mentor: {
        name: 'Prof. Harish (KTU Academic Mentor)',
        avatar: '🎓',
        text: '“Hamna is pursuing her MCA with outstanding dedication to distributed software engineering and continuous R&D exploration.”'
      },
      designer: {
        name: 'Rhea (Fashion Stylist)',
        avatar: '🎨',
        text: '“Trendrove’s AI skin-tone color harmony engine calculated the exact warm undertone palette for my models! Absolute genius.”'
      }
    };

    this.init();
  }

  init() {
    this.initWeatherCanvas();
    this.initClimateControls();
    this.initStoryChapterTracking();
    this.initNPCDialogues();
    this.initNatureClickables();
  }

  // 1. Weather Canvas & Dynamic Climate
  initWeatherCanvas() {
    if (!this.canvas) return;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.spawnWeatherParticles();
    this.renderWeather();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  setClimate(mode) {
    this.currentClimate = mode;
    document.body.className = `climate-${mode}`;
    this.spawnWeatherParticles();

    if (window.soundEngine) {
      window.soundEngine.playChime(mode === 'monsoon' ? 440 : (mode === 'sunset' ? 520 : 660));
    }

    // Update active button state
    document.querySelectorAll('.climate-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-climate') === mode);
    });

    const climateNames = {
      day: '☀️ Sunny Daylight (Calicut Sunshine)',
      sunset: '⛅ Golden Hour (Sunset Amber)',
      monsoon: '🌧️ Kerala Monsoon (Tropical Rain & Petrichor)',
      night: '🌙 Starry Night (Bioluminescent Moon)'
    };

    if (window.showToast) {
      window.showToast(`Climate Shifted: ${climateNames[mode] || mode}`);
    }
  }

  spawnWeatherParticles() {
    this.weatherParticles = [];
    if (!this.canvas) return;

    if (this.currentClimate === 'monsoon') {
      // 120 falling raindrops
      for (let i = 0; i < 140; i++) {
        this.weatherParticles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          speed: 14 + Math.random() * 10,
          len: 15 + Math.random() * 18,
          alpha: 0.3 + Math.random() * 0.4
        });
      }
    } else if (this.currentClimate === 'night') {
      // 50 glowing fireflies
      for (let i = 0; i < 60; i++) {
        this.weatherParticles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: 1.5 + Math.random() * 2.5,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          pulse: Math.random() * Math.PI
        });
      }
    } else if (this.currentClimate === 'day') {
      // 40 gentle dandelion seeds & sunlight pollen
      for (let i = 0; i < 40; i++) {
        this.weatherParticles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: 1.5 + Math.random() * 2,
          vx: 0.3 + Math.random() * 0.7,
          vy: -0.2 - Math.random() * 0.5,
          alpha: 0.3 + Math.random() * 0.5
        });
      }
    } else if (this.currentClimate === 'sunset') {
      // 35 warm golden embers
      for (let i = 0; i < 45; i++) {
        this.weatherParticles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: 1.8 + Math.random() * 2.2,
          vx: 0.2 + Math.random() * 0.5,
          vy: -0.4 - Math.random() * 0.6,
          alpha: 0.4 + Math.random() * 0.5
        });
      }
    }
  }

  renderWeather() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.currentClimate === 'monsoon') {
      this.ctx.strokeStyle = 'rgba(180, 220, 255, 0.6)';
      this.ctx.lineWidth = 1.2;
      this.weatherParticles.forEach(p => {
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x - 2, p.y + p.len);
        this.ctx.stroke();

        p.y += p.speed;
        p.x -= 1;
        if (p.y > this.canvas.height) {
          p.y = -10;
          p.x = Math.random() * this.canvas.width;
        }
      });
    } else if (this.currentClimate === 'night') {
      this.weatherParticles.forEach(p => {
        p.pulse += 0.04;
        const currentAlpha = 0.3 + Math.sin(p.pulse) * 0.4;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(250, 240, 140, ${Math.max(0, currentAlpha)})`;
        this.ctx.shadowColor = '#fef08a';
        this.ctx.shadowBlur = 8;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = this.canvas.width;
        if (p.x > this.canvas.width) p.x = 0;
        if (p.y < 0) p.y = this.canvas.height;
        if (p.y > this.canvas.height) p.y = 0;
      });
    } else if (this.currentClimate === 'day') {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      this.weatherParticles.forEach(p => {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) p.y = this.canvas.height + 10;
        if (p.x > this.canvas.width) p.x = -10;
      });
    } else if (this.currentClimate === 'sunset') {
      this.ctx.fillStyle = 'rgba(251, 191, 36, 0.7)';
      this.weatherParticles.forEach(p => {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) p.y = this.canvas.height + 10;
        if (p.x > this.canvas.width) p.x = -10;
      });
    }

    requestAnimationFrame(() => this.renderWeather());
  }

  initClimateControls() {
    document.querySelectorAll('.climate-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-climate');
        this.setClimate(mode);
      });
    });
  }

  // 2. Story Chapter Tracking on Scroll
  initStoryChapterTracking() {
    const chapters = [
      { id: 'chapter-genesis', title: 'CHAPTER 01 // COSMIC GENESIS & THE SOLAR DAWN' },
      { id: 'chapter-nature', title: 'CHAPTER 02 // CALICUT COAST & ACADEMIC SEEDS' },
      { id: 'chapter-studio', title: 'CHAPTER 03 // THE MAKER’S LIVING COTTAGE & CODE' },
      { id: 'chapter-community', title: 'CHAPTER 04 // THE INNOVATION TOWN & COLLAB-HUB' },
      { id: 'chapter-atelier', title: 'CHAPTER 05 // THE BOTANICAL FASHION ATELIER (TRENDROVE)' },
      { id: 'chapter-academy', title: 'CHAPTER 06 // THE RESEARCH ACADEMY & KTU MCA' },
      { id: 'chapter-beacon', title: 'CHAPTER 07 // THE GLOBAL LIGHTHOUSE & UPLINK' }
    ];

    const bannerTitle = document.getElementById('story-chapter-title');
    const bannerProgress = document.getElementById('story-chapter-progress');

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.4;
      let activeIndex = 0;

      chapters.forEach((chap, idx) => {
        const el = document.getElementById(chap.id);
        if (el && scrollPos >= el.offsetTop) {
          activeIndex = idx;
        }
      });

      if (bannerTitle) {
        bannerTitle.textContent = chapters[activeIndex].title;
      }
      if (bannerProgress) {
        const progressPct = ((activeIndex + 1) / chapters.length) * 100;
        bannerProgress.style.width = `${progressPct}%`;
      }

      // Update Nav Link highlighting
      document.querySelectorAll('.nav-story-link').forEach((link, idx) => {
        link.classList.toggle('active', idx === activeIndex);
      });
    });
  }

  // 3. Interactive NPC Characters with Dialogues
  initNPCDialogues() {
    const modal = document.getElementById('npc-dialogue-modal');
    const avatarEl = document.getElementById('npc-modal-avatar');
    const nameEl = document.getElementById('npc-modal-name');
    const textEl = document.getElementById('npc-modal-text');
    const closeBtn = document.getElementById('npc-modal-close');

    document.querySelectorAll('.npc-clickable').forEach(npc => {
      npc.addEventListener('click', () => {
        const key = npc.getAttribute('data-npc');
        if (this.npcQuotes[key]) {
          const char = this.npcQuotes[key];
          if (avatarEl) avatarEl.textContent = char.avatar;
          if (nameEl) nameEl.textContent = char.name;
          if (textEl) textEl.textContent = char.text;

          if (window.soundEngine) {
            window.soundEngine.playDialogue();
          }

          if (modal) modal.classList.add('active');
        }
      });
    });

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }
  }

  // 4. Whimsical Clickables in the World (Butterflies, Coffee, etc.)
  initNatureClickables() {
    document.querySelectorAll('.world-clickable').forEach(item => {
      item.addEventListener('click', () => {
        const msg = item.getAttribute('data-fact');
        if (msg && window.showToast) {
          if (window.soundEngine) window.soundEngine.playChime(780);
          window.showToast(`✨ ${msg}`);
        }
      });
    });
  }
}

window.LivingWorldEngine = LivingWorldEngine;
