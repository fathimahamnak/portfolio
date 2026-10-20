// ========================================================
// The Living Odyssey Application Core Orchestrator
// Coordinates Living World Engine, Weather, Terminal & Simulators
// ========================================================

const codeSnippets = {
  python: `
# Django REST Framework - Startup Pitch Endpoint (Collab-Hub)
from rest_framework import viewsets, permissions
from .models import Startup, PitchDeck
from .serializers import StartupSerializer

class StartupViewSet(viewsets.ModelViewSet):
    queryset = Startup.objects.filter(is_active=True).order_by('-funding_raised')
    serializer_class = StartupSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(founder=self.request.user)
`,
  django: `
# Django Model - Trendrove Color Harmony & Outfit Schema
from django.db import models

class OutfitPair(models.Model):
    title = models.CharField(max_length=120)
    skin_tone_category = models.CharField(max_length=50, db_index=True)
    primary_color_hex = models.CharField(max_length=7)
    secondary_color_hex = models.CharField(max_length=7)
    harmony_confidence = models.FloatField(default=0.95)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.skin_tone_category})"
`,
  react: `
// React 18 - Trendrove Dynamic Outfit Filter Hook
import { useState, useMemo } from 'react';

export function useOutfitMatcher(skinTone, initialOutfits) {
  const [selectedTag, setSelectedTag] = useState('All');

  const harmonizedOutfits = useMemo(() => {
    return initialOutfits.filter(item => 
      item.skinTone === skinTone &&
      (selectedTag === 'All' || item.occasion === selectedTag)
    );
  }, [skinTone, selectedTag, initialOutfits]);

  return { harmonizedOutfits, selectedTag, setSelectedTag };
}
`,
  mysql: `
-- Normalized Database Schema for Collab-Hub Matching
CREATE TABLE IF NOT EXISTS tbl_startup_investments (
    investment_id INT AUTO_INCREMENT PRIMARY KEY,
    startup_id INT NOT NULL,
    investor_id INT NOT NULL,
    round_stage VARCHAR(30) NOT NULL,
    amount_in_usd DECIMAL(12, 2) NOT NULL,
    status ENUM('PENDING', 'ACCEPTED', 'CLOSED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (startup_id) REFERENCES tbl_startups(id) ON DELETE CASCADE
);
`
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Living World Game Engine
  window.world = new window.LivingWorldEngine();

  // 2. Initialize Audio Toggle Button
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isAudible = window.soundEngine.toggleSound();
      soundBtn.innerHTML = isAudible
        ? '<i class="fas fa-volume-up"></i> <span>AUDIO ON</span>'
        : '<i class="fas fa-volume-mute"></i> <span>AUDIO</span>';
      soundBtn.classList.toggle('active', isAudible);
      showToast(isAudible ? '🔔 Living World Nature Audio Enabled' : '🔇 Audio Muted');
    });
  }

  // 3. Initialize Dev Terminal
  window.terminal = new window.DevTerminal('dev-terminal');

  // 4. Initialize Projects Simulators (Collab-Hub & Trendrove)
  window.projects = new window.ProjectEngine();

  // 5. Initialize Skill Cards Code Preview Drawer
  initSkillsInteractive();

  // 6. Initialize Quick Copy Chips
  initQuickCopy();

  // 7. Initialize Contact Form
  initContactForm();

  // 8. Hover Audio Feedback
  document.querySelectorAll('a, button, .skill-artifact-card, .quick-channel-item, .npc-citizen-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (window.soundEngine) window.soundEngine.playHover();
    });
  });
});

// Skills Code Preview Drawer
function initSkillsInteractive() {
  const cards = document.querySelectorAll('.skill-artifact-card');
  const drawer = document.getElementById('code-drawer');
  const codeContent = document.getElementById('drawer-code-content');
  const drawerTitle = document.getElementById('drawer-code-title');
  const drawerClose = document.getElementById('drawer-close-btn');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const snippetKey = card.getAttribute('data-snippet');
      if (snippetKey && codeSnippets[snippetKey]) {
        if (window.soundEngine) window.soundEngine.playWhoosh();
        const titleText = card.querySelector('h4') ? card.querySelector('h4').textContent : 'ARCHITECTURE';
        drawerTitle.textContent = `${titleText} // PRODUCTION SNIPPET`;
        codeContent.textContent = codeSnippets[snippetKey].trim();
        drawer.classList.add('active');
      }
    });
  });

  if (drawerClose && drawer) {
    drawerClose.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playClick();
      drawer.classList.remove('active');
    });
  }
}

// Copy to Clipboard Helpers
function initQuickCopy() {
  document.querySelectorAll('.quick-copy-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const textToCopy = chip.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          if (window.soundEngine) window.soundEngine.playClick();
          showToast(`📋 Copied: "${textToCopy}" to clipboard!`);
          chip.classList.add('copied');
          setTimeout(() => chip.classList.remove('copied'), 2000);
        });
      }
    });
  });
}

// Global Cyber/Nature Toast
function showToast(message) {
  let toast = document.getElementById('living-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'living-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fas fa-feather-alt"></i> ${message}`;
  toast.className = 'cyber-toast show';

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.className = 'cyber-toast';
  }, 3200);
}
window.showToast = showToast;

// Contact Form Handler
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (window.soundEngine) window.soundEngine.playWhoosh();

      const name = document.getElementById('c-name').value;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING MESSAGE...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> TRANSMISSION DELIVERED!';
        submitBtn.classList.add('btn-success');
        showToast(`✔ Message received! Thank you, ${name}. Fathima Hamna will connect with you soon.`);
        form.reset();

        setTimeout(() => {
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> SEND MESSAGE';
          submitBtn.classList.remove('btn-success');
        }, 4000);
      }, 1000);
    });
  }
}
