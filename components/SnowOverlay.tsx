import React, { useEffect, useRef } from 'react';
import { SnowSystem } from '../services/SnowParticleSystem';
import { SnowConfig } from '../types';

interface SnowOverlayProps {
  active: boolean;
  config: SnowConfig;
}

const SnowOverlay: React.FC<SnowOverlayProps> = ({ active, config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const systemRef = useRef<SnowSystem | null>(null);

  useEffect(() => {
    if (canvasRef.current && !systemRef.current) {
      systemRef.current = new SnowSystem(canvasRef.current, config);
    }

    if (active) {
      systemRef.current?.start();
    } else {
      systemRef.current?.stop();
    }

    // Cleanup
    return () => {
      // We don't destroy the system on re-renders unless component unmounts
      // This preserves state.
    };
  }, [active]);

  useEffect(() => {
    if (systemRef.current) {
      systemRef.current.updateConfig(config);
    }
  }, [config]);

  // Handle unmount cleanup
  useEffect(() => {
    return () => {
      if (systemRef.current) {
        systemRef.current.destroy();
        systemRef.current = null;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-1000 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
};

export default SnowOverlay;
