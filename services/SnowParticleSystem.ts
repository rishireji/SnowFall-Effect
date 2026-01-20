import { SnowConfig } from '../types';

class Particle {
  x: number;
  y: number;
  vx: number; // Velocity X
  vy: number; // Velocity Y
  size: number;
  opacity: number;
  canvasWidth: number;
  canvasHeight: number;

  constructor(width: number, height: number, config: SnowConfig) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = (Math.random() * 2 + 1) * config.sizeMultiplier;
    this.opacity = Math.random() * config.opacity;
    
    // Initial random velocity
    this.vx = (Math.random() - 0.5) * 0.5; 
    this.vy = (Math.random() * 1 + 0.5) * config.baseSpeed;
  }

  update(width: number, height: number, windX: number, config: SnowConfig) {
    this.canvasWidth = width;
    this.canvasHeight = height;

    // Apply Wind
    this.x += this.vx + (windX * config.windSensitivity);
    this.y += this.vy;

    // Turbulence (random wiggle)
    this.x += Math.sin(this.y * 0.01) * 0.5;

    // Wrap around screen
    if (this.y > this.canvasHeight) {
      this.y = -10;
      this.x = Math.random() * this.canvasWidth;
    }
    if (this.x > this.canvasWidth) {
      this.x = 0;
    } else if (this.x < 0) {
      this.x = this.canvasWidth;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export class SnowSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number | null = null;
  private config: SnowConfig;
  private windX: number = 0;
  private mouseX: number = 0;
  
  constructor(canvas: HTMLCanvasElement, config: SnowConfig) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2D context');
    this.ctx = context;
    this.config = config;
    
    this.resize();
    this.initParticles();
    
    window.addEventListener('resize', this.resize);
    window.addEventListener('mousemove', this.handleMouseMove);
  }

  private resize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };

  private handleMouseMove = (e: MouseEvent) => {
    // Calculate simple wind based on mouse position relative to center
    const center = window.innerWidth / 2;
    // Normalized -1 to 1
    const rawWind = (e.clientX - center) / center; 
    
    // Smooth transition for wind
    this.windX = rawWind * 2; // Maximum wind strength multiplier
  };

  private initParticles() {
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push(new Particle(this.canvas.width, this.canvas.height, this.config));
    }
  }

  public updateConfig(newConfig: SnowConfig) {
    const countDiff = newConfig.particleCount - this.particles.length;
    
    // Adjust particle count intelligently without full reset
    if (countDiff > 0) {
        for(let i=0; i<countDiff; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height, newConfig));
        }
    } else if (countDiff < 0) {
        this.particles.splice(0, Math.abs(countDiff));
    }

    // Update existing particles' behavior traits where possible (like speed reference)
    // Note: Individual particle velocity is set on init, but we can iterate to update simple props if needed.
    // For this engine, we let them retain some variety, but new spawn logic uses new config.
    // However, the `update` method uses `config` for wind/movement calc, so we update the ref.
    this.config = newConfig;
  }

  public start() {
    if (!this.animationId) {
      this.loop();
    }
  }

  public stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  private loop = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(p => {
      p.update(this.canvas.width, this.canvas.height, this.windX, this.config);
      p.draw(this.ctx);
    });

    this.animationId = requestAnimationFrame(this.loop);
  };

  public destroy() {
    this.stop();
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('mousemove', this.handleMouseMove);
  }
}
