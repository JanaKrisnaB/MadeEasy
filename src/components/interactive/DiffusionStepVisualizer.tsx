import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Eye, RefreshCw, Layers } from 'lucide-react';

export const DiffusionStepVisualizer: React.FC = () => {
  const [timestep, setTimestep] = useState<number>(1000); // 1000 = pure noise, 0 = sharp image
  const [isDenoising, setIsDenoising] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Noise schedule formulas
  // beta_t linear schedule from 1e-4 to 0.02
  const progress = (1000 - timestep) / 1000; // 0 to 1
  const alphaBar = Math.pow(1 - progress, 2); // approximate signal-to-noise
  const signalWeight = Math.sqrt(progress);
  const noiseWeight = Math.sqrt(1 - progress);

  // Render simulated denoising on HTML canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    // We render a synthetic star/galaxy target pattern obscured by Gaussian noise
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;

        // Clean signal: circular radial gradient + cross beams (like a star)
        const dx = (x - width / 2) / (width / 2);
        const dy = (y - height / 2) / (height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        let signal = Math.max(0, 1 - dist * 1.5);

        // Add 4-point star spike
        const cross = Math.max(0, 1 - Math.abs(dx * dy * 12));
        signal = Math.min(1, signal + cross * 0.4);

        // Pure random Gaussian noise (-1 to 1)
        const noise = (Math.random() - 0.5) * 2;

        // Linear combination: x_t = sqrt(alphaBar) * x_0 + sqrt(1 - alphaBar) * epsilon
        const blended = signalWeight * signal + noiseWeight * noise;
        const pixelVal = Math.floor(Math.max(0, Math.min(1, blended)) * 255);

        // Palette: deep cyber cyan / purple
        data[idx] = Math.floor(pixelVal * 0.4); // R
        data[idx + 1] = Math.floor(pixelVal * 0.9); // G
        data[idx + 2] = Math.floor(pixelVal * 1.0); // B
        data[idx + 3] = 255; // Alpha
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [timestep, signalWeight, noiseWeight]);

  // Automated step playback
  useEffect(() => {
    let timer: any;
    if (isDenoising && timestep > 0) {
      timer = setTimeout(() => {
        setTimestep((t) => Math.max(0, t - 20));
      }, 50);
    } else if (timestep === 0) {
      setIsDenoising(false);
    }
    return () => clearTimeout(timer);
  }, [isDenoising, timestep]);

  return (
    <div className="bg-[#0e1117] border border-[#232734] rounded-lg p-5 text-[#e2e8f0]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#232734]">
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-white uppercase font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            DDPM Reverse Diffusion Denoising Step Simulator
          </h4>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Formula: <code className="text-cyan-300 font-mono">x_{'{t-1}'} = 1/&radic;&alpha;_t (x_t - (1-&alpha;_t)/&radic;(1-&alpha;&#772;_t) &epsilon;_&theta;(x_t, t)) + &sigma;_t z</code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (timestep === 0) setTimestep(1000);
              setIsDenoising(!isDenoising);
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-mono font-bold transition-colors"
          >
            {isDenoising ? 'Pause Denoising' : timestep === 0 ? 'Restart Diffusion' : 'Animate Reverse Step'}
          </button>
          <button
            onClick={() => {
              setIsDenoising(false);
              setTimestep(1000);
            }}
            className="p-1 bg-[#181c26] border border-[#2e3446] hover:text-white text-[#94a3b8] rounded text-xs"
            title="Reset to pure noise"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Step Slider */}
      <div className="my-4 p-3 bg-[#131722] rounded border border-[#232734] font-mono text-xs">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[#cbd5e1]">Reverse Timestep (t):</span>
          <span className="text-cyan-400 font-bold text-sm">t = {timestep} / 1000</span>
        </div>
        <input
          type="range"
          min="0"
          max="1000"
          step="10"
          value={timestep}
          onChange={(e) => {
            setIsDenoising(false);
            setTimestep(parseInt(e.target.value));
          }}
          className="w-full accent-cyan-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#64748b] mt-1">
          <span>t = 0 (Sharp Sample)</span>
          <span>t = 500 (Intermediate Feature)</span>
          <span>t = 1000 (Pure Gaussian Noise &sim; N(0, I))</span>
        </div>
      </div>

      {/* Visual Canvas & Signal Decomposition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 items-center">
        <div className="flex flex-col items-center justify-center p-3 bg-[#131722] rounded border border-[#232734]">
          <canvas
            ref={canvasRef}
            width={160}
            height={160}
            className="rounded border border-[#232734] bg-black shadow-inner"
          />
          <span className="text-[11px] font-mono text-[#94a3b8] mt-2">
            Latent State Representation <code className="text-white">x_t</code>
          </span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-2.5 bg-[#131722] rounded border border-[#232734]">
            <div className="flex justify-between text-[#94a3b8] mb-1">
              <span>Clean Signal Ratio &radic;&alpha;&#772;_t:</span>
              <span className="text-cyan-400 font-bold">{(progress * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-[#181c26] rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 transition-all" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>

          <div className="p-2.5 bg-[#131722] rounded border border-[#232734]">
            <div className="flex justify-between text-[#94a3b8] mb-1">
              <span>Noise Ratio &radic;(1 - &alpha;&#772;_t):</span>
              <span className="text-amber-400 font-bold">{((1 - progress) * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-[#181c26] rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 transition-all" style={{ width: `${(1 - progress) * 100}%` }} />
            </div>
          </div>

          <div className="p-2.5 bg-[#131722] rounded border border-[#232734] text-[11px] text-[#cbd5e1] space-y-1">
            <div className="text-white font-bold">U-Net Noise Prediction &epsilon;_&theta;:</div>
            <p className="text-[#94a3b8]">
              At each step, the U-Net predicts the exact Gaussian noise vector added at timestep <code className="text-white">{timestep}</code>.
              Subtracting this scaled estimate gradually reveals high-fidelity structure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
