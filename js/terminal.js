// ========================================================
// 10D Interactive Developer CLI Console (HAMNA-OS)
// ========================================================

class DevTerminal {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input');
    this.commandHistory = [];
    this.historyIndex = -1;

    this.commands = {
      help: () => `
<div class="cmd-result">
  <p class="term-accent">AVAILABLE SYSTEM COMMANDS:</p>
  <div class="cmd-table">
    <span><strong class="term-cyan">bio</strong>          - Read developer background & vision</span>
    <span><strong class="term-cyan">skills</strong>       - List fullstack technical competencies</span>
    <span><strong class="term-cyan">projects</strong>     - Inspect Collab-Hub & Trendrove</span>
    <span><strong class="term-cyan">experience</strong>   - View industry roles (Cognilearn, Softroniics)</span>
    <span><strong class="term-cyan">education</strong>    - Display MCA (KTU) & BCA degrees</span>
    <span><strong class="term-cyan">contact</strong>      - Get direct communication channels</span>
    <span><strong class="term-cyan">cv</strong>           - Download Fathima Hamna's verified resume</span>
    <span><strong class="term-cyan">matrix</strong>       - Stream cyberpunk neural code</span>
    <span><strong class="term-cyan">sudo hire</strong>    - Initialize fast-track hiring protocol</span>
    <span><strong class="term-cyan">clear</strong>        - Flush terminal buffer</span>
  </div>
</div>`,

      bio: () => `
<div class="cmd-result">
  <p><strong class="term-green">IDENTITY:</strong> Fathima Hamna K</p>
  <p><strong class="term-green">ROLE:</strong> Python Fullstack Developer & Software Engineer</p>
  <p><strong class="term-green">LOCATION:</strong> Calicut, Kerala, India</p>
  <p class="term-dim">"Python Full Stack developer skilled in HTML, CSS, Bootstrap, JavaScript, React, Python, and Django, with UI design expertise in Figma. Passionate about building resilient web applications and driving innovation in dynamic engineering teams."</p>
</div>`,

      skills: () => `
<div class="cmd-result">
  <p class="term-accent">TECHNICAL STACK MATRIX:</p>
  <p>⚡ <strong class="term-cyan">Frontend:</strong> React.js, JavaScript (ES6+), HTML5, CSS3, Bootstrap</p>
  <p>🐍 <strong class="term-purple">Backend:</strong> Python 3, Django, RESTful APIs, CRUD Architecture</p>
  <p>🗄️ <strong class="term-green">Database:</strong> MySQL, Relational Database Modeling</p>
  <p>🛠️ <strong class="term-yellow">Tools & Design:</strong> Git, GitHub, Figma UI Design, Responsive Web Design</p>
  <p>🤝 <strong class="term-dim">Soft Skills:</strong> Teamwork & Collaboration, Problem Solving, Quick Learning, Adaptability</p>
</div>`,

      projects: () => `
<div class="cmd-result">
  <p class="term-accent">ENGINEERED PRODUCTION PROJECTS:</p>
  <p>🚀 <strong class="term-cyan">1. Collab-Hub (Full Stack Startup-Investor Platform)</strong></p>
  <p class="term-dim">   Stack: Python, Django, React.js, Bootstrap, MySQL</p>
  <p class="term-dim">   Features: User authentication, investor-founder matchmaking, profile management, form validations.</p>
  <br>
  <p>👗 <strong class="term-purple">2. Trendrove (AI Fashion Recommendation System)</strong></p>
  <p class="term-dim">   Stack: Python, Django, Computer Vision / Color Analysis, React UI</p>
  <p class="term-dim">   Features: Skin tone-based color suggestion, automated dress pair matching, dynamic outfit explorer.</p>
</div>`,

      experience: () => `
<div class="cmd-result">
  <p class="term-accent">PROFESSIONAL WORK HISTORY:</p>
  <p>🔹 <strong class="term-cyan">Development Intern @ Cognilearn</strong> (08/2026 – Present)</p>
  <p class="term-dim">   • Real-world software project development and team integration.</p>
  <p class="term-dim">   • Research & Development (R&D) in modern technologies & architectures.</p>
  <p class="term-dim">   • Technical presentations, sprint reviews, and agile problem solving.</p>
  <br>
  <p>🔹 <strong class="term-purple">Python Fullstack Intern @ Softroniics, Calicut</strong> (05/2025 – 06/2026)</p>
  <p class="term-dim">   • Developed web applications using Python and Django framework.</p>
  <p class="term-dim">   • Engineered responsive web interfaces with HTML, CSS, JavaScript, and Bootstrap.</p>
  <p class="term-dim">   • Built reusable UI components using React.js.</p>
  <p class="term-dim">   • Implemented backend logic, database schema & integration in MySQL.</p>
  <p class="term-dim">   • Prototyped UI layouts in Figma.</p>
</div>`,

      education: () => `
<div class="cmd-result">
  <p class="term-accent">ACADEMIC FOUNDATION:</p>
  <p>🎓 <strong class="term-green">Master of Computer Application (MCA)</strong></p>
  <p class="term-dim">   APJ Abdul Kalam Technological University (KTU) | 08/2026 – Present</p>
  <br>
  <p>🎓 <strong class="term-cyan">Bachelor of Computer Application (BCA)</strong></p>
  <p class="term-dim">   University of Calicut | 2022 – 2025</p>
</div>`,

      contact: () => `
<div class="cmd-result">
  <p class="term-accent">COMMUNICATION UPLINK:</p>
  <p>📧 Email: <a href="mailto:fhamna882@gmail.com" class="term-link">fhamna882@gmail.com</a></p>
  <p>📞 Phone: <a href="tel:+919645087259" class="term-link">+91 9645087259</a></p>
  <p>📍 Location: Calicut, Kerala, India</p>
  <p>💼 LinkedIn: <a href="https://linkedin.com" target="_blank" class="term-link">linkedin.com/in/fathima-hamna</a></p>
  <p>🐙 GitHub: <a href="https://github.com" target="_blank" class="term-link">github.com/fathima-hamna</a></p>
</div>`,

      cv: () => {
        window.open('hamna_cv.pdf', '_blank');
        return '<p class="term-green">✔ CV dispatch initiated. Opening hamna_cv.pdf...</p>';
      },

      download: () => {
        window.open('hamna_cv.pdf', '_blank');
        return '<p class="term-green">✔ CV dispatch initiated. Opening hamna_cv.pdf...</p>';
      },

      matrix: () => {
        let stream = '<div class="matrix-rain">';
        const chars = '01010101PYTHON_DJANGO_REACT_MYSQL_HAMNA_MCA_DEV_2026';
        for (let i = 0; i < 4; i++) {
          stream += `<p class="term-green" style="letter-spacing:4px; opacity:${0.4 + i * 0.2};">${chars.split('').sort(() => 0.5 - Math.random()).slice(0, 32).join('')}</p>`;
        }
        stream += '</div>';
        return stream;
      },

      'sudo hire': () => {
        setTimeout(() => {
          const contact = document.getElementById('contact');
          if (contact) contact.scrollIntoView({ behavior: 'smooth' });
        }, 600);
        return `<p class="term-green">🚀 ACCESS GRANTED. Routing directly to Priority Contact Channel...</p>`;
      },

      hire: () => {
        setTimeout(() => {
          const contact = document.getElementById('contact');
          if (contact) contact.scrollIntoView({ behavior: 'smooth' });
        }, 600);
        return `<p class="term-green">🚀 ACCESS GRANTED. Routing directly to Priority Contact Channel...</p>`;
      },

      clear: () => {
        this.output.innerHTML = '';
        return '';
      }
    };

    this.init();
  }

  init() {
    if (!this.input || !this.output) return;

    this.input.addEventListener('keydown', (e) => {
      if (window.soundEngine) window.soundEngine.playKey();

      if (e.key === 'Enter') {
        const cmdText = this.input.value.trim();
        if (cmdText) {
          this.executeCommand(cmdText);
          this.commandHistory.push(cmdText);
          this.historyIndex = this.commandHistory.length;
        }
        this.input.value = '';
      } else if (e.key === 'ArrowUp') {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.commandHistory[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        if (this.historyIndex < this.commandHistory.length - 1) {
          this.historyIndex++;
          this.input.value = this.commandHistory[this.historyIndex];
        } else {
          this.historyIndex = this.commandHistory.length;
          this.input.value = '';
        }
      }
    });

    // Terminal quick buttons
    document.querySelectorAll('.term-quick-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const cmd = btn.getAttribute('data-cmd');
        if (cmd) {
          this.input.value = cmd;
          this.executeCommand(cmd);
          this.input.value = '';
        }
      });
    });
  }

  executeCommand(rawCmd) {
    const cmd = rawCmd.toLowerCase();
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = `<span class="term-prompt">hamna@dev-nexus:~$</span> <span class="term-cmd-echo">${rawCmd}</span>`;
    this.output.appendChild(line);

    if (window.soundEngine) window.soundEngine.playClick();

    if (this.commands[cmd]) {
      const response = this.commands[cmd]();
      if (response) {
        const resEl = document.createElement('div');
        resEl.innerHTML = response;
        this.output.appendChild(resEl);
      }
    } else {
      const errorEl = document.createElement('div');
      errorEl.className = 'term-error';
      errorEl.innerHTML = `command not found: "${rawCmd}". Type <strong class="term-cyan">help</strong> to see available commands.`;
      this.output.appendChild(errorEl);
    }

    // Auto scroll to bottom
    this.container.scrollTop = this.container.scrollHeight;
  }
}

window.DevTerminal = DevTerminal;
