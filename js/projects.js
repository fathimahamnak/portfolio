// ========================================================
// 10D Interactive Project Simulators & Holo-Deck Modals
// Collab-Hub & Trendrove
// ========================================================

const trendroveData = {
  warm_peachy: {
    label: 'Warm Peachy Undertone',
    hex: '#f3d0b2',
    harmonyScore: 98,
    palette: [
      { name: 'Terracotta', hex: '#e07a5f' },
      { name: 'Warm Mustard', hex: '#f4a261' },
      { name: 'Sage Green', hex: '#81b29a' },
      { name: 'Cream Ivory', hex: '#f4f1de' }
    ],
    outfits: [
      { title: 'Smart Casual Elegance', pair: 'Terracotta Knit Sweater + Ivory Linen Pants', occasion: 'Work & Coffee Meetups' },
      { title: 'Evening Harmony', pair: 'Deep Emerald Slip Dress + Camel Wool Overcoat', occasion: 'Semi-Formal Gatherings' }
    ]
  },
  golden_olive: {
    label: 'Golden Olive Undertone',
    hex: '#c89f78',
    harmonyScore: 96,
    palette: [
      { name: 'Burnt Ochre', hex: '#cc5a36' },
      { name: 'Forest Emerald', hex: '#264653' },
      { name: 'Warm Sand', hex: '#e9c46a' },
      { name: 'Deep Teal', hex: '#2a9d8f' }
    ],
    outfits: [
      { title: 'Urban Tech Minimalist', pair: 'Deep Teal Overshirt + Sand Chinos + White Sneakers', occasion: 'Creative Studio' },
      { title: 'Autumn Trench Ensemble', pair: 'Burnt Ochre Trench + Navy Silk Trouser', occasion: 'High-Impact Keynotes' }
    ]
  },
  deep_rich: {
    label: 'Rich Espresso Undertone',
    hex: '#6c4731',
    harmonyScore: 99,
    palette: [
      { name: 'Electric Cobalt', hex: '#2563eb' },
      { name: 'Vibrant Marigold', hex: '#fbbf24' },
      { name: 'Pure Crisp White', hex: '#ffffff' },
      { name: 'Ruby Crimson', hex: '#e11d48' }
    ],
    outfits: [
      { title: 'High-Contrast Power Suit', pair: 'Cobalt Single-Breasted Blazer + Marigold Accents', occasion: 'Leadership Summits' },
      { title: 'Contemporary Luxe', pair: 'Ruby Cashmere Knit + Crisp White Straight-Legs', occasion: 'Weekend Galas' }
    ]
  },
  cool_porcelain: {
    label: 'Cool Porcelain Undertone',
    hex: '#fde5d4',
    harmonyScore: 95,
    palette: [
      { name: 'Dusty Rose', hex: '#db2777' },
      { name: 'Slate Blue', hex: '#475569' },
      { name: 'Lavender Mist', hex: '#c084fc' },
      { name: 'Charcoal Noir', hex: '#1e293b' }
    ],
    outfits: [
      { title: 'Modern Monochromatic', pair: 'Dusty Rose Silk Blouse + Slate Tailored Trousers', occasion: 'Corporate & Conference' },
      { title: 'Casual Chic', pair: 'Lavender Oversized Cardigan + Dark Wash Denim', occasion: 'Daily Casual' }
    ]
  }
};

const collabHubStartups = [
  { name: 'Aura AI', stage: 'Seed', category: 'DeepTech', raised: '$3.5M', desc: 'GenAI copilots for automated logistics.' },
  { name: 'BioSyn Health', stage: 'Pre-Seed', category: 'HealthTech', raised: '$850K', desc: 'Real-time biomarker monitoring engine.' },
  { name: 'VoltFin Protocol', stage: 'Series A', category: 'Fintech', raised: '$6.2M', desc: 'Next-generation algorithmic micro-lending.' },
  { name: 'TerraClean Energy', stage: 'Seed', category: 'CleanTech', raised: '$2.1M', desc: 'Smart grid load balancer using IoT.' }
];

class ProjectEngine {
  constructor() {
    this.initTrendrove();
    this.initCollabHub();
    this.initModals();
  }

  // 1. Trendrove Simulator
  initTrendrove() {
    const swatches = document.querySelectorAll('.skin-swatch');
    const resultContainer = document.getElementById('trendrove-dynamic-results');

    swatches.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playClick();
        swatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');

        const toneKey = swatch.getAttribute('data-tone');
        this.renderTrendroveTone(toneKey, resultContainer);
      });
    });

    // Render default on load
    if (resultContainer) {
      this.renderTrendroveTone('golden_olive', resultContainer);
    }
  }

  renderTrendroveTone(toneKey, container) {
    if (!container || !trendroveData[toneKey]) return;
    const data = trendroveData[toneKey];

    container.innerHTML = `
      <div class="tone-result-header">
        <div class="tone-badge" style="border-left: 4px solid ${data.hex};">
          <span class="tone-name">${data.label}</span>
          <span class="tone-score">AI Match Confidence: <strong class="text-cyan">${data.harmonyScore}%</strong></span>
        </div>
      </div>

      <div class="palette-grid">
        <span class="sim-label">COMPUTED HARMONY PALETTE:</span>
        <div class="swatches-row">
          ${data.palette.map(p => `
            <div class="palette-chip" title="${p.name}">
              <span class="chip-color" style="background-color: ${p.hex};"></span>
              <span class="chip-label">${p.name}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="outfit-pairs-grid">
        <span class="sim-label">ALGORITHMIC OUTFIT PAIRINGS:</span>
        <div class="pairs-row">
          ${data.outfits.map(o => `
            <div class="pair-card">
              <div class="pair-title">✨ ${o.title}</div>
              <div class="pair-details">${o.pair}</div>
              <div class="pair-tag">${o.occasion}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 2. Collab-Hub Simulator
  initCollabHub() {
    const filterBtns = document.querySelectorAll('.ch-filter-btn');
    const listEl = document.getElementById('collabhub-startup-list');
    const pitchBtn = document.getElementById('simulate-pitch-btn');

    if (filterBtns) {
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          if (window.soundEngine) window.soundEngine.playClick();
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const category = btn.getAttribute('data-filter');
          this.renderStartups(category, listEl);
        });
      });
    }

    if (listEl) {
      this.renderStartups('All', listEl);
    }

    if (pitchBtn) {
      pitchBtn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playWhoosh();
        pitchBtn.innerHTML = '<i class="fas fa-check"></i> Pitch Dispatched to 14 VCs!';
        pitchBtn.classList.add('btn-success');
        setTimeout(() => {
          pitchBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Simulate Founder Pitch Submission';
          pitchBtn.classList.remove('btn-success');
        }, 3000);
      });
    }
  }

  renderStartups(category, container) {
    if (!container) return;
    const filtered = category === 'All'
      ? collabHubStartups
      : collabHubStartups.filter(s => s.category === category);

    container.innerHTML = filtered.map(s => `
      <div class="ch-startup-card">
        <div class="ch-top">
          <h4 class="ch-name">${s.name}</h4>
          <span class="ch-stage">${s.stage}</span>
        </div>
        <p class="ch-desc">${s.desc}</p>
        <div class="ch-bottom">
          <span class="ch-raised">Funding: <strong>${s.raised}</strong></span>
          <span class="ch-badge">${s.category}</span>
        </div>
      </div>
    `).join('');
  }

  // 3. Project Detail Modals
  initModals() {
    const modalBackdrop = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-dynamic-body');
    const modalClose = document.getElementById('modal-close-btn');

    document.querySelectorAll('.open-modal-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const projectId = trigger.getAttribute('data-project');
        this.openModal(projectId, modalBackdrop, modalContent);
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', () => this.closeModal(modalBackdrop));
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) this.closeModal(modalBackdrop);
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
        this.closeModal(modalBackdrop);
      }
    });
  }

  openModal(id, backdrop, body) {
    if (!backdrop || !body) return;
    if (window.soundEngine) window.soundEngine.playWhoosh();

    if (id === 'collabhub') {
      body.innerHTML = `
        <div class="modal-project-view">
          <div class="modal-head">
            <span class="modal-tag">FULL STACK WEB ARCHITECTURE</span>
            <h2>Collab-Hub: Startup & VC Investor Bridge</h2>
          </div>
          <img src="assets/collabhub.jpg" alt="Collab-Hub Dashboard" class="modal-hero-img">
          
          <div class="modal-section">
            <h3>Architectural Overview</h3>
            <p>Collab-Hub is an end-to-end fullstack platform designed to eliminate friction between early-stage startup founders seeking capital and angel/venture capital investors looking for vetted opportunities.</p>
          </div>

          <div class="modal-grid-2">
            <div class="modal-box">
              <h4>⚡ Backend Engine (Python & Django)</h4>
              <ul>
                <li>Custom JWT & Session Authentication with role-based access controls (Founders vs Investors).</li>
                <li>RESTful API endpoints for startup application submission, profile updates, and status tracking.</li>
                <li>Normalized MySQL relational schema ensuring fast queries across startup funding stages.</li>
                <li>Data validation pipelines safeguarding pitch deck assets and financial metrics.</li>
              </ul>
            </div>
            <div class="modal-box">
              <h4>🎨 Frontend Interface (React & Bootstrap)</h4>
              <ul>
                <li>Modular React component architecture with stateful search, filter, and sorting.</li>
                <li>Responsive UI designed with Bootstrap and custom CSS glassmorphism.</li>
                <li>Interactive investor dashboard showcasing funding pipelines and key performance indicators.</li>
                <li>Tested and debugged thoroughly for cross-browser stability.</li>
              </ul>
            </div>
          </div>
        </div>
      `;
    } else if (id === 'trendrove') {
      body.innerHTML = `
        <div class="modal-project-view">
          <div class="modal-head">
            <span class="modal-tag">AI & COMPUTER VISION INTEGRATION</span>
            <h2>Trendrove: Intelligent Fashion Recommendation System</h2>
          </div>
          <img src="assets/trendrove.jpg" alt="Trendrove Interface" class="modal-hero-img">
          
          <div class="modal-section">
            <h3>System Mission</h3>
            <p>Trendrove is a smart style advisor built on Python and Django that analyzes user complexion and undertone to recommend harmonious apparel color combinations, taking the guesswork out of fashion matching.</p>
          </div>

          <div class="modal-grid-2">
            <div class="modal-box">
              <h4>🧠 Algorithmic Recommendation Engine</h4>
              <ul>
                <li>Color Space Analysis logic mapping skin undertones (warm, cool, neutral) to complimentary color triads.</li>
                <li>Curated clothing pairing heuristics recommending upper and lower body matches.</li>
                <li>Django backend serving fast REST recommendation payloads with caching.</li>
                <li>Extensible architecture prepared for future computer vision webcam selfie integration.</li>
              </ul>
            </div>
            <div class="modal-box">
              <h4>✨ User Experience & Visual Design</h4>
              <ul>
                <li>Intuitive discovery interface allowing users to explore curated outfit pairs effortlessly.</li>
                <li>Interactive harmony score badges offering visual clarity on style matches.</li>
                <li>Figma-prototyped sleek dark-mode aesthetics with high accessibility.</li>
                <li>Tested across mobile and desktop environments for smooth responsiveness.</li>
              </ul>
            </div>
          </div>
        </div>
      `;
    }

    backdrop.classList.add('active');
  }

  closeModal(backdrop) {
    if (backdrop) {
      if (window.soundEngine) window.soundEngine.playClick();
      backdrop.classList.remove('active');
    }
  }
}

window.ProjectEngine = ProjectEngine;
