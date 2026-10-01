document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const secretScreen = document.getElementById('secretScreen');
  const mainContent = document.getElementById('mainContent');
  const secretForm = document.getElementById('secretForm');
  const secretCodeInput = document.getElementById('secretCodeInput');
  const errorMessage = document.getElementById('errorMessage');
  const navLockBtn = document.getElementById('navLockBtn');
  const lockBtnBottom = document.getElementById('lockBtnBottom');
  const replayBtn = document.getElementById('replayBtn');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  
  // Lightbox elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

  // Correct secret code as specified
  const SECRET_CODE = "1917";

  // Check Session Storage on Load
  if (sessionStorage.getItem('amirdhaa_unlocked') === 'true') {
    revealMainContent(false);
  }

  // Secret Form Submit
  secretForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredCode = secretCodeInput.value.trim();

    if (enteredCode === SECRET_CODE) {
      errorMessage.classList.add('hidden');
      sessionStorage.setItem('amirdhaa_unlocked', 'true');
      playUnlockSound();
      triggerUnlockBurst();
      revealMainContent(true);
    } else {
      showError();
    }
  });

  // Handle Enter key on input explicitly
  secretCodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      secretForm.dispatchEvent(new Event('submit'));
    }
  });

  function showError() {
    errorMessage.classList.remove('hidden');
    secretCodeInput.value = '';
    secretCodeInput.focus();
    playErrorSound();
  }

  // Reveal Main Website Content with Smooth Transition
  function revealMainContent(animate = true) {
    if (animate) {
      secretScreen.style.opacity = '0';
      secretScreen.style.transform = 'scale(1.05)';
      setTimeout(() => {
        secretScreen.classList.add('hidden');
        mainContent.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'instant' });
        initScrollAnimations();
      }, 700);
    } else {
      secretScreen.classList.add('hidden');
      mainContent.classList.remove('hidden');
      initScrollAnimations();
    }
  }

  // Lock Website Action
  function lockWebsite() {
    sessionStorage.removeItem('amirdhaa_unlocked');
    secretCodeInput.value = '';
    errorMessage.classList.add('hidden');
    
    mainContent.style.opacity = '0';
    setTimeout(() => {
      mainContent.classList.add('hidden');
      mainContent.style.opacity = '1';
      secretScreen.classList.remove('hidden');
      secretScreen.style.opacity = '1';
      secretScreen.style.transform = 'scale(1)';
    }, 400);
  }

  navLockBtn.addEventListener('click', lockWebsite);
  lockBtnBottom.addEventListener('click', lockWebsite);

  // Replay Memories Action (Scroll to top + burst)
  replayBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    createMultipleHearts(15);
    playChimeSound();
  });

  // Question Card Button Handlers
  const yesBtn = document.getElementById('yesBtn');
  const alwaysBtn = document.getElementById('alwaysBtn');
  const answerResponseMessage = document.getElementById('answerResponseMessage');

  if (yesBtn) {
    yesBtn.addEventListener('click', () => {
      answerResponseMessage.textContent = "Yay! 🥹🤍 A brand new chapter begins! ✨";
      answerResponseMessage.classList.remove('hidden');
      createMultipleHearts(25);
      playUnlockSound();
    });
  }

  if (alwaysBtn) {
    alwaysBtn.addEventListener('click', () => {
      answerResponseMessage.textContent = "Always & Forever Best Friends! 🫶✨";
      answerResponseMessage.classList.remove('hidden');
      createMultipleHearts(25);
      playUnlockSound();
    });
  }

  // 🖼️ LIGHTBOX MODAL HANDLERS
  const memoryCards = document.querySelectorAll('.memory-card');
  memoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.gallery-img');
      const caption = card.querySelector('.card-caption').textContent;
      
      lightboxImg.src = img.src;
      lightboxCaption.textContent = caption;
      lightboxModal.classList.remove('hidden');
      playChimeSound();
    });
  });

  lightboxCloseBtn.addEventListener('click', () => {
    lightboxModal.classList.add('hidden');
  });

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.add('hidden');
    }
  });

  // 📜 SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
  }

  // 💖 INTERACTIVE TAP / CLICK HEARTS
  document.addEventListener('click', (e) => {
    // Avoid triggering heart when clicking inputs or buttons
    if (['INPUT', 'BUTTON', 'A', 'VIDEO'].includes(e.target.tagName)) return;
    
    createClickHeart(e.clientX, e.clientY);
  });

  function createClickHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'click-heart';
    const hearts = ['🤍', '✨', '💖', '🌸', '🫶'];
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1200);
  }

  function createMultipleHearts(count = 10) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight - 100;
        createClickHeart(x, y);
      }, i * 80);
    }
  }

  // 🎆 UNLOCK BURST ANIMATION
  function triggerUnlockBurst() {
    createMultipleHearts(20);
  }

  // 🎨 CANVAS FLOATING PARTICLES & HEARTS
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 100;
      this.speed = 0.5 + Math.random() * 1.2;
      this.size = 10 + Math.random() * 16;
      this.opacity = 0.2 + Math.random() * 0.5;
      this.symbol = ['🤍', '✨', '🌸', '💕'][Math.floor(Math.random() * 4)];
      this.drift = (Math.random() - 0.5) * 0.5;
    }
    update() {
      this.y -= this.speed;
      this.x += this.drift;
      if (this.y < -30) this.reset();
    }
    draw() {
      ctx.globalAlpha = this.opacity;
      ctx.font = `${this.size}px serif`;
      ctx.fillText(this.symbol, this.x, this.y);
    }
  }

  for (let i = 0; i < 25; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // 🎵 WEB AUDIO SYNTH & AMBIENT MUSIC PLAYER
  let audioCtx = null;
  let isMusicPlaying = false;
  let synthInterval = null;

  function initAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playChimeSound() {
    try {
      initAudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.4); // C6
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch(e) {}
  }

  function playUnlockSound() {
    try {
      initAudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C chord
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.6);
        }, idx * 100);
      });
    } catch(e) {}
  }

  function playErrorSound() {
    try {
      initAudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch(e) {}
  }

  // Soft Ambient Background Lofi Synth Chords Generator for ambient music feel
  musicToggleBtn.addEventListener('click', () => {
    initAudioCtx();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isMusicPlaying) {
      isMusicPlaying = true;
      musicToggleBtn.classList.add('playing');
      musicToggleBtn.querySelector('.music-label').textContent = 'Playing 🎵';
      startAmbientSynth();
    } else {
      isMusicPlaying = false;
      musicToggleBtn.classList.remove('playing');
      musicToggleBtn.querySelector('.music-label').textContent = 'Our Song';
      stopAmbientSynth();
    }
  });

  function startAmbientSynth() {
    const chordProgressions = [
      [261.63, 329.63, 392.00, 493.88], // C maj7
      [220.00, 261.63, 329.63, 392.00], // A min7
      [174.61, 220.00, 261.63, 329.63], // F maj7
      [196.00, 246.94, 293.66, 349.23]  // G7
    ];
    let step = 0;

    function playNextChord() {
      if (!isMusicPlaying) return;
      const chord = chordProgressions[step % chordProgressions.length];
      chord.forEach(freq => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 2.5);
      });
      step++;
    }

    playNextChord();
    synthInterval = setInterval(playNextChord, 2600);
  }

  function stopAmbientSynth() {
    if (synthInterval) clearInterval(synthInterval);
  }

});
