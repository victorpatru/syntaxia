import { WaveformOrbProps } from "@syntaxia/shared";
import { useEffect, useState } from "react";

export function WaveformRingOrb({
  isActive,
  audioLevel = 0.5,
  size = "medium",
}: WaveformOrbProps) {
  const [waveformData, setWaveformData] = useState([
    0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.3, 0.2,
  ]);

  // Size configurations
  const sizeConfig = {
    small: { orb: 16, container: 32 },
    medium: { orb: 24, container: 48 },
    large: { orb: 48, container: 120 },
    xlarge: { orb: 64, container: 160 },
  };

  const { orb: orbSize, container: containerSize } = sizeConfig[size];

  useEffect(() => {
    if (!isActive) return;

    // TODO: Replace with actual audio level data from ElevenLabs
    // const updateWaveform = (audioData: Float32Array) => {
    //   const processedData = Array.from(audioData, value => Math.abs(value));
    //   setWaveformData(processedData.slice(0, 10));
    // };

    // Mock waveform data generator - replace with actual API data
    const interval = setInterval(() => {
      setWaveformData(() =>
        Array.from({ length: 10 }, () => {
          // Mix some real audio level data with random variation
          const baseLevel = audioLevel || 0.1;
          const variation = (Math.random() - 0.5) * 0.4;
          return Math.max(0.1, Math.min(0.9, baseLevel + variation));
        }),
      );
    }, 200);

    return () => clearInterval(interval);
  }, [isActive, audioLevel]);

  return (
    <div className="flex justify-center items-center h-48">
      <div className="relative">
        {/* Central orb */}
        <div
          className="bg-terminal-green/10 border border-terminal-green"
          style={{
            width: `${containerSize}px`,
            height: `${containerSize}px`,
          }}
        ></div>

        {/* Animated waveform rings */}
        {waveformData.map((amplitude, index) => (
          <div
            key={index}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-terminal-green/60 transition-all duration-200"
            style={{
              width: `${containerSize + amplitude * containerSize}px`,
              height: `${containerSize + amplitude * containerSize}px`,
              opacity: amplitude * 0.8,
              animationDelay: `${index * 50}ms`,
            }}
          ></div>
        ))}

        {/* Center indicator */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-terminal-amber"
          style={{
            width: `${orbSize}px`,
            height: `${orbSize}px`,
          }}
        ></div>
      </div>
    </div>
  );
}
