/**
 * GTA V Mobile Touch Controller & Virtual Joystick System
 * Author: Fathima Hamna K Portfolio
 * Fully featured virtual analog joystick, ergonomic action cluster,
 * multi-touch camera look, and contextual responsive HUD.
 */

(function () {
  'use strict';

  class GTAMobileController {
    constructor() {
      this.joystickZone = document.getElementById('mobile-joystick-zone');
      this.joystickBase = document.getElementById('joystick-base');
      this.joystickKnob = document.getElementById('joystick-knob');

      this.activeTouchId = null;
      this.baseCenter = { x: 0, y: 0 };
      this.maxRadius = 50; // max displacement in px

      this.btnDrive = document.getElementById('m-btn-drive');
      this.btnInteract = document.getElementById('m-btn-interact');
      this.btnJump = document.getElementById('m-btn-jump');
      this.btnSprint = document.getElementById('m-btn-sprint');
      this.btnHorn = document.getElementById('m-btn-horn');
      this.btnCam = document.getElementById('m-btn-cam');
      this.btnRespawn = document.getElementById('m-btn-respawn');
      this.btnShowroom = document.getElementById('m-btn-showroom');
      this.btnFastTravel = document.getElementById('m-btn-fast-travel');

      this.lblDrive = document.getElementById('m-label-drive');
      this.lblInteract = document.getElementById('m-label-interact');
      this.lblJump = document.getElementById('m-label-jump');

      this.arrows = {
        up: document.querySelector('#joystick-base .arrow-up'),
        down: document.querySelector('#joystick-base .arrow-down'),
        left: document.querySelector('#joystick-base .arrow-left'),
        right: document.querySelector('#joystick-base .arrow-right')
      };

      this.init();
    }

    init() {
      if (!this.joystickBase || !this.joystickKnob) return;

      this.bindJoystickEvents();
      this.bindActionButtons();
      this.startHUDObserver();

      // Ensure viewport orientation changes recalculate dimensions
      window.addEventListener('resize', () => this.recalcBaseCenter(), { passive: true });
      window.addEventListener('orientationchange', () => {
        setTimeout(() => this.recalcBaseCenter(), 300);
      });
    }

    recalcBaseCenter() {
      if (!this.joystickBase) return;
      const rect = this.joystickBase.getBoundingClientRect();
      this.baseCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      this.maxRadius = Math.max(26, Math.min(48, rect.width * 0.38));
    }

    vibrate(ms = 15) {
      if (navigator.vibrate) {
        try { navigator.vibrate(ms); } catch (e) { }
      }
    }

    bindJoystickEvents() {
      const zone = this.joystickZone || this.joystickBase;

      const onTouchStart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (this.activeTouchId !== null) return;

        const touch = e.changedTouches[0];
        this.activeTouchId = touch.identifier;
        this.recalcBaseCenter();
        this.handleJoystickMove(touch.clientX, touch.clientY);
        this.vibrate(10);
      };

      const onTouchMove = (e) => {
        if (this.activeTouchId === null) return;
        e.preventDefault();
        e.stopPropagation();

        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.identifier === this.activeTouchId) {
            this.handleJoystickMove(t.clientX, t.clientY);
            break;
          }
        }
      };

      const onTouchEnd = (e) => {
        if (this.activeTouchId === null) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === this.activeTouchId) {
            this.resetJoystick();
            break;
          }
        }
      };

      zone.addEventListener('touchstart', onTouchStart, { passive: false });
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd, { passive: true });
      window.addEventListener('touchcancel', onTouchEnd, { passive: true });

      // Mouse drag fallback for testing on desktop browser responsive devtools
      let isMouseDown = false;
      zone.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        this.recalcBaseCenter();
        this.handleJoystickMove(e.clientX, e.clientY);
      });
      window.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;
        this.handleJoystickMove(e.clientX, e.clientY);
      });
      window.addEventListener('mouseup', () => {
        if (!isMouseDown) return;
        isMouseDown = false;
        this.resetJoystick();
      });
    }

    handleJoystickMove(clientX, clientY) {
      const dx = clientX - this.baseCenter.x;
      const dy = clientY - this.baseCenter.y;
      const dist = Math.hypot(dx, dy);

      const angle = Math.atan2(dy, dx);
      const clampedDist = Math.min(dist, this.maxRadius);

      const knobX = Math.cos(angle) * clampedDist;
      const knobY = Math.sin(angle) * clampedDist;

      this.joystickKnob.style.transform = `translate3d(${knobX}px, ${knobY}px, 0)`;

      // Normalized input coordinates (-1 to 1)
      const normX = clampedDist > 5 ? (knobX / this.maxRadius) : 0;
      const normY = clampedDist > 5 ? (knobY / this.maxRadius) : 0;

      // Apply directly to window.game
      if (window.game) {
        window.game.analogForward = -normY; // Up is forward
        window.game.analogStrafe = normX;   // Right is positive strafe

        // Digital key fallback for compatibility
        const threshold = 0.22;
        window.game.keys['w'] = normY < -threshold;
        window.game.keys['arrowup'] = normY < -threshold;

        window.game.keys['s'] = normY > threshold;
        window.game.keys['arrowdown'] = normY > threshold;

        window.game.keys['a'] = normX < -threshold;
        window.game.keys['arrowleft'] = normX < -threshold;

        window.game.keys['d'] = normX > threshold;
        window.game.keys['arrowright'] = normX > threshold;
      }

      // Visual arrow glow indicators
      if (this.arrows.up) this.arrows.up.classList.toggle('active', normY < -0.28);
      if (this.arrows.down) this.arrows.down.classList.toggle('active', normY > 0.28);
      if (this.arrows.left) this.arrows.left.classList.toggle('active', normX < -0.28);
      if (this.arrows.right) this.arrows.right.classList.toggle('active', normX > 0.28);
    }

    resetJoystick() {
      this.activeTouchId = null;
      if (this.joystickKnob) {
        this.joystickKnob.style.transition = 'transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)';
        this.joystickKnob.style.transform = 'translate3d(0, 0, 0)';
        setTimeout(() => {
          if (this.joystickKnob) this.joystickKnob.style.transition = 'none';
        }, 200);
      }

      if (window.game) {
        window.game.analogForward = 0;
        window.game.analogStrafe = 0;
        window.game.keys['w'] = false;
        window.game.keys['s'] = false;
        window.game.keys['a'] = false;
        window.game.keys['d'] = false;
        window.game.keys['arrowup'] = false;
        window.game.keys['arrowdown'] = false;
        window.game.keys['arrowleft'] = false;
        window.game.keys['arrowright'] = false;
      }

      Object.values(this.arrows).forEach(arrow => {
        if (arrow) arrow.classList.remove('active');
      });
    }

    bindActionButtons() {
      const attachTouchTap = (elem, callback) => {
        if (!elem) return;
        const trigger = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.vibrate(25);
          callback();
        };
        elem.addEventListener('touchstart', trigger, { passive: false });
        elem.addEventListener('click', trigger);
      };

      const attachTouchHold = (elem, onStart, onEnd) => {
        if (!elem) return;
        const start = (e) => {
          e.preventDefault();
          e.stopPropagation();
          elem.classList.add('holding');
          this.vibrate(15);
          onStart();
        };
        const end = (e) => {
          elem.classList.remove('holding');
          onEnd();
        };
        elem.addEventListener('touchstart', start, { passive: false });
        elem.addEventListener('touchend', end, { passive: true });
        elem.addEventListener('touchcancel', end, { passive: true });
        elem.addEventListener('mousedown', start);
        elem.addEventListener('mouseup', end);
        elem.addEventListener('mouseleave', end);
      };

      // 1. Enter / Exit Car (F)
      attachTouchTap(this.btnDrive, () => {
        if (window.game) {
          window.game.toggleVehicleDrive();
        }
      });

      // 2. Interact / Enter Building (E)
      attachTouchTap(this.btnInteract, () => {
        if (window.game) {
          window.game.triggerInteraction();
        }
      });

      // 3. Jump (on foot) / Drift Handbrake (in car) (Space)
      attachTouchHold(
        this.btnJump,
        () => {
          if (window.game) {
            window.game.keys[' '] = true;
            window.game.mobileHandbrake = true;
            if (!window.game.isDriving) {
              window.game.triggerJump();
            }
          }
        },
        () => {
          if (window.game) {
            window.game.keys[' '] = false;
            window.game.mobileHandbrake = false;
          }
        }
      );

      // 4. Sprint / Nitro Boost (Shift)
      attachTouchHold(
        this.btnSprint,
        () => {
          if (window.game) {
            window.game.keys['shift'] = true;
            window.game.mobileSprint = true;
            if (window.game.isDriving && window.gameAudio && window.gameAudio.playNitro) {
              window.gameAudio.playNitro();
            }
          }
        },
        () => {
          if (window.game) {
            window.game.keys['shift'] = false;
            window.game.mobileSprint = false;
          }
        }
      );

      // 5. Horn / Police Siren (H)
      attachTouchTap(this.btnHorn, () => {
        if (window.game) {
          if (window.game.isDriving) {
            if (window.game.currentVehicle === 'police') {
              window.game.togglePoliceSiren();
            } else {
              if (window.gameAudio && window.gameAudio.playHorn) {
                window.gameAudio.playHorn();
              }
            }
          } else {
            window.game.showGameNotification('📢 ENTER A VEHICLE [F] TO HONK OR USE POLICE SIREN');
          }
        }
      });

      // 6. Camera View (V)
      attachTouchTap(this.btnCam, () => {
        if (window.game) window.game.toggleCameraView();
      });

      // 7. Reset / Rollover Recovery (R)
      attachTouchTap(this.btnRespawn, () => {
        if (window.game) {
          if (window.game.isDriving) {
            window.game.repairCarInWorkshop();
          } else {
            window.game.cycleRadioStation();
          }
        }
      });

      // 8. Car Showroom (C)
      attachTouchTap(this.btnShowroom, () => {
        if (window.game) window.game.openCarShowroom();
      });

      // 9. Fast Travel / Map (ESC)
      attachTouchTap(this.btnFastTravel, () => {
        if (window.game) window.game.toggleGPSMap();
      });
    }

    startHUDObserver() {
      let lastNearVehicle = false;
      let lastNearInteract = false;
      let lastDriving = null;

      const updateMobileHUD = () => {
        if (!window.game) return;

        const isDriving = window.game.isDriving;

        // State changes between driving and on-foot
        if (isDriving !== lastDriving) {
          lastDriving = isDriving;
          if (isDriving) {
            if (this.lblDrive) this.lblDrive.textContent = 'EXIT';
            if (this.btnDrive) {
              const icon = this.btnDrive.querySelector('i');
              if (icon) icon.className = 'fas fa-sign-out-alt';
              this.btnDrive.classList.add('active-driving');
            }
            if (this.lblJump) this.lblJump.textContent = 'DRIFT';
            if (this.btnJump) {
              const icon = this.btnJump.querySelector('i');
              if (icon) icon.className = 'fas fa-tachometer-alt';
            }
            if (this.btnHorn) this.btnHorn.style.display = 'flex';
          } else {
            if (this.lblDrive) this.lblDrive.textContent = 'DRIVE';
            if (this.btnDrive) {
              const icon = this.btnDrive.querySelector('i');
              if (icon) icon.className = 'fas fa-car';
              this.btnDrive.classList.remove('active-driving');
            }
            if (this.lblJump) this.lblJump.textContent = 'JUMP';
            if (this.btnJump) {
              const icon = this.btnJump.querySelector('i');
              if (icon) icon.className = 'fas fa-arrow-up';
            }
          }
        }

        // Proximity to vehicle glow
        if (!isDriving && window.game.playerPos && window.game.carPos) {
          const distToSupercar = Math.hypot(
            window.game.playerPos.x - window.game.carPos.x,
            window.game.playerPos.z - window.game.carPos.z
          );
          const distToPolice = window.game.policeCarPos ? Math.hypot(
            window.game.playerPos.x - window.game.policeCarPos.x,
            window.game.playerPos.z - window.game.policeCarPos.z
          ) : Infinity;

          const isNear = (distToSupercar < 50 || distToPolice < 50);
          if (isNear !== lastNearVehicle) {
            lastNearVehicle = isNear;
            if (this.btnDrive) this.btnDrive.classList.toggle('pulse-ready', isNear);
          }
        }

        // Proximity to building / interactive zone glow
        const hasInteract = Boolean(window.game.activeInteraction);
        if (hasInteract !== lastNearInteract) {
          lastNearInteract = hasInteract;
          if (this.btnInteract) {
            this.btnInteract.classList.toggle('pulse-ready', hasInteract);
            if (hasInteract && window.game.activeInteraction.name) {
              const shortName = window.game.activeInteraction.name.split(' ')[0].substring(0, 7).toUpperCase();
              if (this.lblInteract) this.lblInteract.textContent = shortName;
            } else {
              if (this.lblInteract) this.lblInteract.textContent = 'ENTER';
            }
          }
        }
      };

      setInterval(updateMobileHUD, 150);
    }
  }

  // Initialize controller when DOM is ready
  function initMobileSystem() {
    window.gtaMobileController = new GTAMobileController();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileSystem);
  } else {
    initMobileSystem();
  }

})();
