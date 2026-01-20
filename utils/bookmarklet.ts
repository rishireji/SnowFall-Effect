export const getBookmarkletCode = () => {
  const code = `
(function () {
  if (window.frostFrameActive) {
    alert('FrostFrame is already active!');
    return;
  }
  window.frostFrameActive = true;

  // --- Configuration ---
  let config = {
    particleCount: 150,
    baseSpeed: 1.5,
    windSensitivity: 0.5,
    sizeMultiplier: 1.0,
    opacity: 0.8,
  };

  // --- Styles ---
  const style = document.createElement('style');
  style.innerHTML = \`
    .ff-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 999999; }
    .ff-controls { 
      position: fixed; bottom: 20px; right: 20px; z-index: 1000000; 
      background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(10px); 
      padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
      font-family: sans-serif; color: white; width: 200px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;
    }
    .ff-controls.minimized { width: auto; padding: 8px; background: rgba(0,0,0,0.5); }
    .ff-controls.minimized .ff-panel { display: none; }
    .ff-btn { cursor: pointer; border: none; background: transparent; color: white; display: flex; align-items: center; justify-content: center; }
    .ff-row { margin-bottom: 12px; }
    .ff-label { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; color: #cbd5e1; }
    .ff-slider { width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; appearance: none; }
    .ff-slider::-webkit-slider-thumb { appearance: none; width: 12px; height: 12px; background: #60a5fa; border-radius: 50%; cursor: pointer; }
    .ff-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; }
    .ff-title { font-size: 14px; font-weight: bold; }
    .ff-close { font-size: 18px; color: #94a3b8; }
    .ff-toggle { width: 32px; height: 32px; border-radius: 50%; background: #3b82f6; }
  \`;
  document.head.appendChild(style);

  // --- Canvas ---
  const canvas = document.createElement('canvas');
  canvas.className = 'ff-overlay';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // --- Engine Logic ---
  class Particle {
    constructor(w, h, cfg) {
      this.init(w, h, cfg);
    }
    init(w, h, cfg) {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() * 1 + 0.5) * cfg.baseSpeed;
      this.size = (Math.random() * 2 + 1) * cfg.sizeMultiplier;
      this.opacity = Math.random() * cfg.opacity;
    }
    update(w, h, wind, cfg) {
      this.x += this.vx + (wind * cfg.windSensitivity);
      this.y += this.vy;
      this.x += Math.sin(this.y * 0.01) * 0.5;
      if (this.y > h) { this.y = -10; this.x = Math.random() * w; }
      if (this.x > w) { this.x = 0; } else if (this.x < 0) { this.x = w; }
    }
    draw(c) {
      c.fillStyle = \`rgba(255, 255, 255, \${this.opacity})\`;
      c.beginPath();
      c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      c.fill();
    }
  }

  let particles = [];
  let animationId;
  let windX = 0;

  function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height, config));
    }
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update(canvas.width, canvas.height, windX, config);
      p.draw(ctx);
    });
    animationId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    const center = window.innerWidth / 2;
    windX = ((e.clientX - center) / center) * 2;
  });

  resize();
  loop();

  // --- UI Controls ---
  const panel = document.createElement('div');
  panel.className = 'ff-controls';
  panel.innerHTML = \`
    <div class="ff-header">
      <div class="ff-title">FrostFrame</div>
      <div style="display:flex; gap:8px;">
        <button class="ff-btn" id="ff-min">_</button>
        <button class="ff-btn ff-close" id="ff-kill">×</button>
      </div>
    </div>
    <div class="ff-panel">
      <div class="ff-row">
        <div class="ff-label"><span>Intensity</span><span id="ff-val-count">150</span></div>
        <input type="range" class="ff-slider" min="50" max="1000" step="50" value="150" id="ff-count">
      </div>
      <div class="ff-row">
        <div class="ff-label"><span>Speed</span><span id="ff-val-speed">1.5</span></div>
        <input type="range" class="ff-slider" min="0.5" max="5" step="0.5" value="1.5" id="ff-speed">
      </div>
    </div>
    <button class="ff-btn ff-toggle" id="ff-maximize" style="display:none;">❄️</button>
  \`;
  document.body.appendChild(panel);

  // --- UI Logic ---
  const updateEngine = () => {
    const countDiff = config.particleCount - particles.length;
    if (countDiff > 0) {
       for(let i=0; i<countDiff; i++) particles.push(new Particle(canvas.width, canvas.height, config));
    } else if (countDiff < 0) {
       particles.splice(0, Math.abs(countDiff));
    }
  };

  document.getElementById('ff-count').addEventListener('input', (e) => {
    config.particleCount = parseInt(e.target.value);
    document.getElementById('ff-val-count').innerText = config.particleCount;
    updateEngine();
  });

  document.getElementById('ff-speed').addEventListener('input', (e) => {
    config.baseSpeed = parseFloat(e.target.value);
    document.getElementById('ff-val-speed').innerText = config.baseSpeed;
    particles.forEach(p => p.vy = (Math.random() * 1 + 0.5) * config.baseSpeed);
  });

  document.getElementById('ff-kill').addEventListener('click', () => {
    cancelAnimationFrame(animationId);
    canvas.remove();
    panel.remove();
    style.remove();
    window.frostFrameActive = false;
  });

  const contentDiv = panel.querySelector('.ff-panel');
  const headerDiv = panel.querySelector('.ff-header');
  const maxBtn = document.getElementById('ff-maximize');

  document.getElementById('ff-min').addEventListener('click', () => {
    panel.classList.add('minimized');
    contentDiv.style.display = 'none';
    headerDiv.style.display = 'none';
    maxBtn.style.display = 'flex';
  });

  maxBtn.addEventListener('click', () => {
    panel.classList.remove('minimized');
    contentDiv.style.display = 'block';
    headerDiv.style.display = 'flex';
    maxBtn.style.display = 'none';
  });

})();
  `;

  // Minify slightly by removing newlines and double spaces to keep the href cleaner
  return `javascript:${encodeURIComponent(code.replace(/\s+/g, ' ').trim())}`;
};
