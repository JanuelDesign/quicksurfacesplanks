import React, { useState } from 'react';
import { FloorPlanModel, FlooringProduct } from '../types';
import { Maximize2, Layers, CheckCircle2, Sparkles, Compass } from 'lucide-react';

interface FloorPlanSVGProps {
  model: FloorPlanModel;
  selectedProduct?: FlooringProduct;
  activeRoomIndex?: number | null;
  onSelectRoom?: (index: number) => void;
}

export const FloorPlanSVG: React.FC<FloorPlanSVGProps> = ({
  model,
  selectedProduct,
  activeRoomIndex,
  onSelectRoom,
}) => {
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [fillMode, setFillMode] = useState<'texture' | 'blueprint'>('texture');

  const woodColor = selectedProduct?.colorHex || '#c7b299';
  const woodColorDark = selectedProduct?.secondaryColorHex || '#a69076';

  return (
    <div className="bg-[#0e0e0e] text-[#FFFFFF] rounded-2xl p-5 sm:p-7 border border-[#262626] shadow-xl relative overflow-hidden">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-40"></div>

      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-[#141414] border border-[#FF8407]/40 text-[#FF8407] text-xs font-black">
              2D
            </span>
            <h3 className="text-lg font-black text-[#FFFFFF] tracking-tight">
              {model.name} Architectural Floor Plan
            </h3>
          </div>
          <p className="text-xs text-[#A4A4A4] mt-0.5">
            {model.address} • {model.collection} • 2nd Floor Level
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFillMode(fillMode === 'texture' ? 'blueprint' : 'texture')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              fillMode === 'texture'
                ? 'bg-[#FF8407] text-[#000000]'
                : 'bg-[#141414] text-[#FFFFFF] border border-[#262626] hover:bg-[#262626]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{fillMode === 'texture' ? (selectedProduct?.name || 'Vinyl View') : 'Blueprint'}</span>
          </button>

          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showDimensions
                ? 'bg-[#141414] text-[#FF8407] border border-[#FF8407]/40'
                : 'bg-[#141414] text-[#A4A4A4] border border-[#262626] hover:text-[#FFFFFF]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Dimensions</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative z-10 w-full flex items-center justify-center bg-[#000000] rounded-2xl p-4 sm:p-6 border border-[#262626] min-h-[380px]">
        <svg
          viewBox="0 0 460 620"
          className="w-full max-w-[420px] max-h-[500px] select-none"
          style={{ filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.8))' }}
        >
          <defs>
            {/* Realistic wood plank pattern */}
            <pattern
              id="vinylPlanks"
              width="40"
              height="16"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(0)"
            >
              <rect width="40" height="16" fill={woodColor} />
              <line x1="0" y1="0" x2="40" y2="0" stroke={woodColorDark} strokeWidth="0.75" />
              <line x1="0" y1="8" x2="40" y2="8" stroke={woodColorDark} strokeWidth="0.75" />
              <line x1="20" y1="0" x2="20" y2="8" stroke={woodColorDark} strokeWidth="0.75" />
              <line x1="0" y1="8" x2="0" y2="16" stroke={woodColorDark} strokeWidth="0.75" />
              <line x1="40" y1="8" x2="40" y2="16" stroke={woodColorDark} strokeWidth="0.75" />
            </pattern>

            {/* Tile pattern for baths */}
            <pattern id="bathTile" width="12" height="12" patternUnits="userSpaceOnUse">
              <rect width="12" height="12" fill="#262626" />
              <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#404040" strokeWidth="0.8" />
            </pattern>

            {/* Stairs pattern */}
            <pattern id="stairsPattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill={woodColor} />
              <line x1="0" y1="10" x2="10" y2="10" stroke={woodColorDark} strokeWidth="1.2" />
            </pattern>
          </defs>

          {/* Outer Boundary Wall */}
          <rect
            x="20"
            y="20"
            width="420"
            height="580"
            rx="12"
            fill="#0e0e0e"
            stroke="#262626"
            strokeWidth="4"
          />

          {/* Top-Left: Primary Bedroom (Owner's Suite) */}
          <g
            className="cursor-pointer transition-opacity"
            onMouseEnter={() => setHoveredRoom(0)}
            onMouseLeave={() => setHoveredRoom(null)}
            onClick={() => onSelectRoom && onSelectRoom(0)}
          >
            <rect
              x="30"
              y="30"
              width="230"
              height="240"
              rx="4"
              fill={fillMode === 'texture' ? 'url(#vinylPlanks)' : '#141414'}
              stroke={hoveredRoom === 0 ? '#FF8407' : '#262626'}
              strokeWidth={hoveredRoom === 0 ? 3 : 1.5}
            />
            {/* Bed illustration */}
            <rect x="50" y="45" width="100" height="110" rx="6" fill="#000000" fillOpacity="0.85" stroke="#404040" strokeWidth="1.5" />
            <rect x="58" y="52" width="38" height="22" rx="4" fill="#262626" />
            <rect x="104" y="52" width="38" height="22" rx="4" fill="#262626" />
            <line x1="50" y1="90" x2="150" y2="90" stroke="#404040" strokeWidth="1.5" />

            <text x="145" y="195" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">
              Owner's Suite
            </text>
            {showDimensions && (
              <text x="145" y="215" textAnchor="middle" fill="#A4A4A4" fontSize="10" fontWeight="600">
                {model.rooms[0]?.dimensions || '12\' x 14\''}
              </text>
            )}
            <rect x="35" y="35" width="48" height="18" rx="4" fill="#FF8407" fillOpacity="0.9" />
            <text x="59" y="48" textAnchor="middle" fill="#000000" fontSize="9" fontWeight="bold">
              VINYL
            </text>
          </g>

          {/* Top-Right: Primary Bath */}
          <g className="cursor-pointer">
            <rect
              x="265"
              y="30"
              width="165"
              height="125"
              rx="4"
              fill="url(#bathTile)"
              stroke="#262626"
              strokeWidth="1.5"
            />
            {/* Double Vanity & Tub */}
            <rect x="330" y="36" width="90" height="30" rx="3" fill="#141414" stroke="#404040" strokeWidth="1" />
            <circle cx="350" cy="51" r="8" fill="#262626" />
            <circle cx="395" cy="51" r="8" fill="#262626" />
            <rect x="272" y="36" width="50" height="70" rx="4" fill="#141414" stroke="#404040" strokeWidth="1" />
            <text x="345" y="115" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
              Primary Bath
            </text>
          </g>

          {/* Middle-Right: Walk-in Closet */}
          <g
            className="cursor-pointer transition-opacity"
            onMouseEnter={() => setHoveredRoom(1)}
            onMouseLeave={() => setHoveredRoom(null)}
          >
            <rect
              x="265"
              y="160"
              width="165"
              height="110"
              rx="4"
              fill={fillMode === 'texture' ? 'url(#vinylPlanks)' : '#141414'}
              stroke={hoveredRoom === 1 ? '#FF8407' : '#262626'}
              strokeWidth={hoveredRoom === 1 ? 3 : 1.5}
            />
            {/* Shelving bars */}
            <line x1="275" y1="170" x2="420" y2="170" stroke="#404040" strokeWidth="2" strokeDasharray="3,3" />
            <line x1="275" y1="260" x2="420" y2="260" stroke="#404040" strokeWidth="2" strokeDasharray="3,3" />
            <text x="347" y="215" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
              Walk-In Closet
            </text>
            {showDimensions && (
              <text x="347" y="232" textAnchor="middle" fill="#A4A4A4" fontSize="9" fontWeight="600">
                {model.rooms[1]?.dimensions || '6\' x 7\''}
              </text>
            )}
            <rect x="270" y="165" width="48" height="16" rx="3" fill="#FF8407" fillOpacity="0.9" />
            <text x="294" y="177" textAnchor="middle" fill="#000000" fontSize="8" fontWeight="bold">
              VINYL
            </text>
          </g>

          {/* Center: Stairs (17 Square Steps) & Hallway */}
          <g
            className="cursor-pointer transition-opacity"
            onMouseEnter={() => setHoveredRoom(5)}
            onMouseLeave={() => setHoveredRoom(null)}
          >
            {/* Staircase Run with 17 steps */}
            <rect
              x="30"
              y="275"
              width="90"
              height="145"
              rx="4"
              fill={fillMode === 'texture' ? 'url(#stairsPattern)' : '#141414'}
              stroke={hoveredRoom === 5 ? '#FF8407' : '#262626'}
              strokeWidth={hoveredRoom === 5 ? 3 : 1.5}
            />
            {/* 17 step lines */}
            {Array.from({ length: 17 }).map((_, i) => (
              <line
                key={i}
                x1="30"
                y1={275 + i * (145 / 17)}
                x2="120"
                y2={275 + i * (145 / 17)}
                stroke="#000000"
                strokeWidth="1.2"
              />
            ))}
            <rect x="35" y="325" width="80" height="28" rx="4" fill="#000000" fillOpacity="0.9" />
            <text x="75" y="340" textAnchor="middle" fill="#FF8407" fontSize="10" fontWeight="bold">
              17 Square Steps
            </text>
            <text x="75" y="350" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold">
              (Down / Glued)
            </text>

            {/* Central Hallway */}
            <rect
              x="125"
              y="275"
              width="170"
              height="145"
              rx="4"
              fill={fillMode === 'texture' ? 'url(#vinylPlanks)' : '#141414'}
              stroke="#262626"
              strokeWidth="1"
            />
            <text x="210" y="345" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
              Hallway Landing
            </text>

            {/* HVAC & Laundry alcove */}
            <rect x="300" y="275" width="130" height="65" rx="3" fill="#141414" stroke="#262626" strokeWidth="1" />
            <text x="365" y="312" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
              Laundry / HVAC
            </text>

            {/* Bath 2 */}
            <rect x="300" y="345" width="130" height="75" rx="3" fill="url(#bathTile)" stroke="#262626" strokeWidth="1" />
            <rect x="310" y="355" width="40" height="55" rx="3" fill="#141414" stroke="#404040" />
            <text x="380" y="390" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
              Bath 2
            </text>
          </g>

          {/* Bottom-Left: Bedroom 2 */}
          <g
            className="cursor-pointer transition-opacity"
            onMouseEnter={() => setHoveredRoom(2)}
            onMouseLeave={() => setHoveredRoom(null)}
          >
            <rect
              x="30"
              y="425"
              width="190"
              height="165"
              rx="4"
              fill={fillMode === 'texture' ? 'url(#vinylPlanks)' : '#141414'}
              stroke={hoveredRoom === 2 ? '#FF8407' : '#262626'}
              strokeWidth={hoveredRoom === 2 ? 3 : 1.5}
            />
            {/* Bed 2 */}
            <rect x="40" y="475" width="75" height="90" rx="4" fill="#000000" fillOpacity="0.85" stroke="#404040" strokeWidth="1" />
            <text x="125" y="495" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">
              Bedroom 2
            </text>
            {showDimensions && (
              <text x="125" y="512" textAnchor="middle" fill="#A4A4A4" fontSize="9" fontWeight="600">
                {model.rooms[3]?.dimensions || '10\' x 10\'10"'}
              </text>
            )}
            <rect x="35" y="430" width="48" height="16" rx="3" fill="#FF8407" fillOpacity="0.9" />
            <text x="59" y="442" textAnchor="middle" fill="#000000" fontSize="8" fontWeight="bold">
              VINYL
            </text>
          </g>

          {/* Bottom-Right: Bedroom 3 / 4 */}
          <g
            className="cursor-pointer transition-opacity"
            onMouseEnter={() => setHoveredRoom(3)}
            onMouseLeave={() => setHoveredRoom(null)}
          >
            <rect
              x="225"
              y="425"
              width="205"
              height="165"
              rx="4"
              fill={fillMode === 'texture' ? 'url(#vinylPlanks)' : '#141414'}
              stroke={hoveredRoom === 3 ? '#FF8407' : '#262626'}
              strokeWidth={hoveredRoom === 3 ? 3 : 1.5}
            />
            {/* Bed 3 */}
            <rect x="325" y="475" width="75" height="90" rx="4" fill="#000000" fillOpacity="0.85" stroke="#404040" strokeWidth="1" />
            <text x="295" y="495" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">
              Bedroom 3
            </text>
            {showDimensions && (
              <text x="295" y="512" textAnchor="middle" fill="#A4A4A4" fontSize="9" fontWeight="600">
                {model.rooms[4]?.dimensions || '10\'6" x 10\''}
              </text>
            )}
            <rect x="230" y="430" width="48" height="16" rx="3" fill="#FF8407" fillOpacity="0.9" />
            <text x="254" y="442" textAnchor="middle" fill="#000000" fontSize="8" fontWeight="bold">
              VINYL
            </text>
          </g>
        </svg>
      </div>

      {/* Highlights & Scope Badges */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-xl bg-[#141414] border border-[#262626]">
          <p className="text-[#A4A4A4]">Total Net Area</p>
          <p className="text-[#FF8407] font-bold text-sm">{model.sqft} sq ft</p>
        </div>
        <div className="p-2.5 rounded-xl bg-[#141414] border border-[#262626]">
          <p className="text-[#A4A4A4]">Stairs Count</p>
          <p className="text-[#FF8407] font-bold text-sm">17 Square Steps</p>
        </div>
        <div className="p-2.5 rounded-xl bg-[#141414] border border-[#262626]">
          <p className="text-[#A4A4A4]">Baseboards</p>
          <p className="text-[#FFFFFF] font-bold text-sm">Detach & Reinstall</p>
        </div>
        <div className="p-2.5 rounded-xl bg-[#141414] border border-[#262626]">
          <p className="text-[#A4A4A4]">Subfloor</p>
          <p className="text-[#FFFFFF] font-bold text-sm">Tearout & Leveling</p>
        </div>
      </div>
    </div>
  );
};
