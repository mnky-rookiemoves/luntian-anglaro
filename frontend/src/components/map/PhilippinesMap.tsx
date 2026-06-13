/**
 * 🗺️ LUNTIAN ANGLARO — Interactive Philippines Map
 * SVG-based clickable region map with Kalikasan Engine overlay
 */

import { useState } from 'react';
import type { Region } from '@/types/game.types';

interface PhilippinesMapProps {
  regions: Region[];
  onRegionClick: (region: Region) => void;
  activeRegionId: number | null;
}

// SVG path data for simplified Philippine regions
const REGION_PATHS: Record<string, { d: string; cx: number; cy: number }> = {
  HUB: {
    d: 'M195,235 L215,225 L225,235 L225,255 L215,265 L195,255 Z',
    cx: 210, cy: 245,
  },
  NCR: {
    d: 'M185,200 L230,185 L245,200 L245,230 L230,245 L200,245 L185,230 Z',
    cx: 215, cy: 215,
  },
  MNL_BAY: {
    d: 'M155,240 L195,225 L200,250 L195,280 L170,290 L150,275 Z',
    cx: 175, cy: 260,
  },
  CAR: {
    d: 'M175,120 L225,105 L240,125 L235,165 L210,175 L180,165 L170,145 Z',
    cx: 205, cy: 140,
  },
  MIN_FOR: {
    d: 'M200,380 L260,360 L300,380 L310,420 L290,460 L250,470 L210,450 L195,420 Z',
    cx: 252, cy: 415,
  },
  TUB: {
    d: 'M120,380 L165,370 L180,395 L170,430 L140,440 L115,420 Z',
    cx: 148, cy: 405,
  },
};

const REGION_COLORS: Record<string, { fill: string; glow: string }> = {
  HUB: { fill: '#FFD600', glow: '#FFD60066' },
  NCR: { fill: '#4CAF50', glow: '#4CAF5066' },
  MNL_BAY: { fill: '#2196F3', glow: '#2196F366' },
  CAR: { fill: '#FF5722', glow: '#FF572266' },
  MIN_FOR: { fill: '#9C27B0', glow: '#9C27B066' },
  TUB: { fill: '#00BCD4', glow: '#00BCD466' },
};

const PhilippinesMap = ({ regions, onRegionClick, activeRegionId }: PhilippinesMapProps) => {
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <svg
        viewBox="80 80 280 420"
        className="w-full h-auto"
        style={{ filter: 'drop-shadow(0 0 20px rgba(46, 125, 50, 0.15))' }}
      >
        <defs>
          {/* Glow filters for each region */}
          {Object.entries(REGION_COLORS).map(([code, colors]) => (
            <filter key={code} id={`glow-${code}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor={colors.glow} result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}

          {/* Ocean pattern */}
          <pattern id="ocean" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#0a1628" />
            <circle cx="4" cy="4" r="0.5" fill="#1565C022" />
          </pattern>
        </defs>

        {/* Ocean background */}
        <rect x="80" y="80" width="280" height="420" fill="url(#ocean)" rx="12" />

        {/* Decorative sea waves */}
        <text x="100" y="500" fontSize="8" fill="#1565C033" className="select-none">
          ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
        </text>
        <text x="120" y="100" fontSize="8" fill="#1565C033" className="select-none">
          ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
        </text>

        {/* Connecting lines between regions */}
        {[
          ['CAR', 'NCR'], ['NCR', 'HUB'], ['NCR', 'MNL_BAY'],
          ['HUB', 'MIN_FOR'], ['MNL_BAY', 'TUB'], ['HUB', 'TUB'],
        ].map(([from, to], i) => {
          const a = REGION_PATHS[from];
          const b = REGION_PATHS[to];
          return (
            <line
              key={i}
              x1={a.cx} y1={a.cy}
              x2={b.cx} y2={b.cy}
              stroke="#2E7D3222"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          );
        })}

        {/* Region shapes */}
        {regions.map((region) => {
          const path = REGION_PATHS[region.code];
          const colors = REGION_COLORS[region.code];
          if (!path || !colors) return null;

          const isActive = activeRegionId === region.id;
          const isHovered = hoveredCode === region.code;
          const isHighlighted = isActive || isHovered;

          return (
            <g
              key={region.id}
              onClick={() => onRegionClick(region)}
              onMouseEnter={() => setHoveredCode(region.code)}
              onMouseLeave={() => setHoveredCode(null)}
              className="cursor-pointer"
              style={{ transition: 'all 0.3s ease' }}
            >
              {/* Region shape */}
              <path
                d={path.d}
                fill={isHighlighted ? `${colors.fill}44` : `${colors.fill}18`}
                stroke={isHighlighted ? colors.fill : `${colors.fill}66`}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                filter={isHighlighted ? `url(#glow-${region.code})` : undefined}
                style={{ transition: 'all 0.3s ease' }}
              />

              {/* Region center dot */}
              <circle
                cx={path.cx}
                cy={path.cy}
                r={isHighlighted ? 5 : 3}
                fill={colors.fill}
                opacity={isHighlighted ? 1 : 0.7}
                style={{ transition: 'all 0.3s ease' }}
              >
                {isHighlighted && (
                  <animate attributeName="r" values="5;7;5" dur="1.5s" repeatCount="indefinite" />
                )}
              </circle>

              {/* Region label */}
              <text
                x={path.cx}
                y={path.cy - 12}
                textAnchor="middle"
                fontSize={isHighlighted ? 10 : 8}
                fontWeight={isHighlighted ? 'bold' : 'normal'}
                fill={isHighlighted ? colors.fill : `${colors.fill}99`}
                className="select-none pointer-events-none"
                style={{ transition: 'all 0.3s ease' }}
              >
                {region.name}
              </text>

              {/* Lock icon for locked regions */}
              {!region.is_unlocked_by_default && (
                <text
                  x={path.cx + 25}
                  y={path.cy + 4}
                  fontSize="8"
                  fill={`${colors.fill}66`}
                  className="select-none pointer-events-none"
                >
                  🔒
                </text>
              )}

              {/* Guardian icon */}
              {region.guardian_name && (
                <text
                  x={path.cx - 25}
                  y={path.cy + 4}
                  fontSize="8"
                  fill={`${colors.fill}88`}
                  className="select-none pointer-events-none"
                >
                  🛡️
                </text>
              )}
            </g>
          );
        })}

        {/* Compass Rose */}
        <g transform="translate(320, 120)">
          <circle r="15" fill="#1a2e1a" stroke="#2E7D3244" strokeWidth="1" />
          <text textAnchor="middle" y="-5" fontSize="6" fill="#4CAF5088" className="select-none">N</text>
          <text textAnchor="middle" y="10" fontSize="6" fill="#4CAF5044" className="select-none">S</text>
          <text textAnchor="middle" x="-8" y="3" fontSize="6" fill="#4CAF5044" className="select-none">W</text>
          <text textAnchor="middle" x="8" y="3" fontSize="6" fill="#4CAF5044" className="select-none">E</text>
          <line x1="0" y1="-12" x2="0" y2="-3" stroke="#4CAF50" strokeWidth="1" />
        </g>

        {/* Map title */}
        <text x="210" y="505" textAnchor="middle" fontSize="7" fill="#4CAF5033" className="select-none">
          LUNTIAN ANGLARO — Mapa ng Pilipinas
        </text>
      </svg>
    </div>
  );
};

export default PhilippinesMap;