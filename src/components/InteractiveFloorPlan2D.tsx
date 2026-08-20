import React, { useState } from 'react';
import { FloorPlanModel, FlooringProduct } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Layers, Check, Info, ZoomIn } from 'lucide-react';

interface InteractiveFloorPlan2DProps {
  model: FloorPlanModel;
  selectedProduct: FlooringProduct;
  onSelectRoom?: (roomName: string) => void;
}

export const InteractiveFloorPlan2D: React.FC<InteractiveFloorPlan2DProps> = ({
  model,
  selectedProduct,
  onSelectRoom,
}) => {
  const { lang } = useLanguage();
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  // Dynamic wood tones based on active selected swatch
  const woodBaseColor = selectedProduct.colorHex || '#c4a682';
  const woodSecondaryColor = selectedProduct.secondaryColorHex || '#a1815d';

  // Room metrics extraction with robust defaults from model data
  const ownerSuiteDims = model.ownerSuiteDims || "12' x 11'";
  const ownerSuiteSqft = model.ownerSuiteSqft || Math.round(model.sqftNet * 0.28);
  const walkInClosetSqft = model.walkInClosetSqft || 35;

  const bed2Dims = model.bedroom2Dims || "11' x 10'";
  const bed2Sqft = model.bedroom2Sqft || Math.round(model.sqftNet * 0.22);

  const bed3Dims = model.bedroom3Dims || "10' x 10'";
  const bed3Sqft = model.bedroom3Sqft || Math.round(model.sqftNet * 0.20);

  const stairsCount = model.stepsCount || 15;
  const netAreaSqft = model.sqftNet || model.sqft || 620;

  return (
    <div className="bg-[#FFFFFF] text-[#111827] rounded-3xl p-4 sm:p-7 border border-[#E2E8F0] shadow-xl relative overflow-hidden font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-[#000000] text-[#FF8407] text-xs font-black tracking-wider uppercase">
              {lang === 'es' ? 'Plano 2D Interactivo' : 'Interactive 2D Floor Plan'}
            </span>
            <h3 className="text-xl font-black text-[#000000] tracking-tight">
              {lang === 'es'
                ? `Plano Arquitectónico 2D: ${model.name}`
                : `Interactive 2D Architectural Plan: ${model.name}`}
            </h3>
          </div>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            {model.name} ({model.communityName} · {model.collection}) •{' '}
            <strong className="text-[#000000]">{netAreaSqft} sq ft Área Neta</strong> +{' '}
            <strong className="text-[#FF8407]">{stairsCount} Escalones a Medida</strong>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
            <span
              className="w-3.5 h-3.5 rounded-full shadow-inner border border-black/20"
              style={{ backgroundColor: selectedProduct.colorHex }}
            ></span>
            <span className="font-bold text-[#000000]">{selectedProduct.name}</span>
            <span className="text-[#64748B] font-mono text-[11px]">({selectedProduct.category})</span>
          </div>

          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              showDimensions
                ? 'bg-[#000000] text-[#FFFFFF]'
                : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#000000]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#FF8407]" />
            <span>
              {showDimensions
                ? lang === 'es'
                  ? 'Ocultar Dimensiones'
                  : 'Hide Dimensions'
                : lang === 'es'
                ? 'Mostrar Dimensiones'
                : 'Show Dimensions'}
            </span>
          </button>
        </div>
      </div>

      {/* 2D Architectural CAD Floor Plan Canvas */}
      <div className="relative w-full bg-[#18181B] rounded-2xl p-3 sm:p-5 overflow-hidden border border-[#CBD5E1] shadow-2xl">
        {/* Architectural Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50"></div>

        {/* High Precision SVG 2D Floor Plan */}
        <svg
          viewBox="0 0 960 540"
          className="w-full h-auto max-h-[560px] select-none rounded-xl"
          style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.6))' }}
        >
          <defs>
            {/* Dynamic Planks Pattern in Floor Plan */}
            <pattern
              id="plan2dPlanks"
              width="50"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              <rect width="50" height="16" fill={woodBaseColor} />
              <line x1="0" y1="0" x2="50" y2="0" stroke={woodSecondaryColor} strokeWidth="1" strokeOpacity="0.7" />
              <line x1="0" y1="8" x2="50" y2="8" stroke={woodSecondaryColor} strokeWidth="1" strokeOpacity="0.7" />
              <line x1="25" y1="0" x2="25" y2="8" stroke={woodSecondaryColor} strokeWidth="1" strokeOpacity="0.7" />
              <line x1="0" y1="8" x2="0" y2="16" stroke={woodSecondaryColor} strokeWidth="1" strokeOpacity="0.7" />
              <line x1="50" y1="8" x2="50" y2="16" stroke={woodSecondaryColor} strokeWidth="1" strokeOpacity="0.7" />
            </pattern>

            {/* Bathroom Non-flooring Tile Pattern */}
            <pattern id="plan2dBathTile" width="14" height="14" patternUnits="userSpaceOnUse">
              <rect width="14" height="14" fill="#3F3F46" />
              <path d="M 14 0 L 0 0 0 14" fill="none" stroke="#52525B" strokeWidth="0.8" />
            </pattern>

            {/* Wall Drop Shadow */}
            <filter id="wallShadow2D" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Background Outer Blueprint Frame */}
          <rect x="10" y="10" width="940" height="520" rx="12" fill="#27272A" />

          {/* ========================================================
              FLOOR SURFACES (Continuous Vinyl Flooring Overlay)
              ======================================================== */}
          {/* Top-Left: Bedroom 2 */}
          <g
            className="cursor-pointer"
            onClick={() => {
              setActiveRoom('Bedroom 2');
              onSelectRoom?.('Bedroom 2');
            }}
          >
            <rect
              x="200"
              y="20"
              width="230"
              height="235"
              fill="url(#plan2dPlanks)"
              className="transition-all duration-300 hover:brightness-105"
            />
          </g>

          {/* Top-Center Closets and Alcove */}
          <rect x="435" y="20" width="80" height="160" fill="url(#plan2dPlanks)" />
          <rect x="520" y="20" width="105" height="210" fill="url(#plan2dPlanks)" />
          <rect x="425" y="185" width="90" height="70" fill="url(#plan2dPlanks)" />

          {/* Top-Right: Owner's Suite (Primary Bedroom) */}
          <g
            className="cursor-pointer"
            onClick={() => {
              setActiveRoom("Owner's Suite");
              onSelectRoom?.("Owner's Suite");
            }}
          >
            <rect
              x="630"
              y="20"
              width="310"
              height="310"
              fill="url(#plan2dPlanks)"
              className="transition-all duration-300 hover:brightness-105"
            />
          </g>

          {/* Center Hallway Flow (Continuous Luxury Vinyl) */}
          <rect x="250" y="260" width="345" height="250" fill="url(#plan2dPlanks)" />

          {/* Bottom-Right: Walk-in Closet (Vinyl) & Primary Bathroom (Existing Tile) */}
          <rect x="610" y="335" width="170" height="175" fill="url(#plan2dPlanks)" />
          <rect x="785" y="335" width="155" height="175" fill="url(#plan2dBathTile)" />

          {/* Bottom-Left: Bedroom 3 */}
          <g
            className="cursor-pointer"
            onClick={() => {
              setActiveRoom('Bedroom 3');
              onSelectRoom?.('Bedroom 3');
            }}
          >
            <rect
              x="30"
              y="245"
              width="220"
              height="265"
              fill="url(#plan2dPlanks)"
              className="transition-all duration-300 hover:brightness-105"
            />
          </g>

          {/* Top-Left Balcony / AC exterior zone */}
          <rect x="20" y="20" width="175" height="220" fill="#334155" opacity="0.9" />
          <text x="107" y="130" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="600">
            {lang === 'es' ? 'Balcón / Área Exterior' : 'Balcony / Terrace Area'}
          </text>

          {/* ========================================================
              ARCHITECTURAL WALLS (Clean CAD Perimeter & Partitions)
              ======================================================== */}
          <g filter="url(#wallShadow2D)">
            {/* Exterior Perimeter Walls */}
            <path
              d="M 15 15 L 945 15 L 945 525 L 15 525 Z M 25 25 L 25 515 L 935 515 L 935 25 Z"
              fill="#525866"
            />

            {/* Balcony partition */}
            <rect x="195" y="20" width="10" height="235" fill="#525866" />

            {/* Bedroom 2 to closet walls */}
            <rect x="430" y="20" width="10" height="170" fill="#525866" />
            <rect x="515" y="20" width="10" height="220" fill="#525866" />
            <rect x="425" y="180" width="100" height="10" fill="#525866" />
            <rect x="425" y="250" width="100" height="10" fill="#525866" />

            {/* Primary Suite partition */}
            <rect x="625" y="20" width="10" height="315" fill="#525866" />
            <rect x="625" y="330" width="315" height="10" fill="#525866" />
            <rect x="780" y="335" width="10" height="175" fill="#525866" />

            {/* Bedroom 3 partition */}
            <rect x="250" y="245" width="10" height="265" fill="#525866" />
            <rect x="30" y="245" width="225" height="10" fill="#525866" />
          </g>

          {/* ========================================================
              ARCHITECTURAL SYMBOLS & FIXTURES
              ======================================================== */}
          {/* Bed 2 outline */}
          <g>
            <rect x="285" y="30" width="105" height="120" rx="4" fill="#000000" fillOpacity="0.4" stroke="#71717A" strokeWidth="1.5" strokeDasharray="4,3" />
            <text x="337" y="95" textAnchor="middle" fill="#A1A1AA" fontSize="10" fontWeight="600">
              Bed
            </text>
          </g>

          {/* Owner's Suite King Bed Outline */}
          <g>
            <rect x="715" y="30" width="165" height="150" rx="6" fill="#000000" fillOpacity="0.4" stroke="#71717A" strokeWidth="1.5" strokeDasharray="5,3" />
            <text x="797" y="110" textAnchor="middle" fill="#A1A1AA" fontSize="12" fontWeight="700">
              King Bed
            </text>
          </g>

          {/* Bed 3 outline */}
          <g>
            <rect x="85" y="330" width="105" height="125" rx="4" fill="#000000" fillOpacity="0.4" stroke="#71717A" strokeWidth="1.5" strokeDasharray="4,3" />
            <text x="137" y="395" textAnchor="middle" fill="#A1A1AA" fontSize="10" fontWeight="600">
              Bed
            </text>
          </g>

          {/* Primary Bath Fixtures (Tub/Vanity) */}
          <rect x="830" y="350" width="45" height="30" rx="4" fill="#18181B" stroke="#71717A" strokeWidth="1.5" />
          <rect x="890" y="350" width="35" height="35" rx="6" fill="#18181B" stroke="#71717A" strokeWidth="1.5" />
          <circle cx="907" cy="367" r="8" fill="#52525B" />
          <rect x="870" y="475" width="60" height="30" rx="4" fill="#27272A" stroke="#71717A" strokeWidth="1" />
          <text x="900" y="495" textAnchor="middle" fill="#A1A1AA" fontSize="9">
            Bath Tile
          </text>

          {/* ========================================================
              STAIRCASE: EXACT STEP COUNT (stairsCount)
              ======================================================== */}
          <g>
            <rect x="325" y="400" width="190" height="110" rx="6" fill="#18181B" stroke="#71717A" strokeWidth="2" />
            {Array.from({ length: Math.min(stairsCount, 16) }).map((_, i) => {
              const stepWidth = 175 / Math.min(stairsCount, 16);
              return (
                <rect
                  key={i}
                  x={332 + i * stepWidth}
                  y="410"
                  width={stepWidth - 1}
                  height="90"
                  fill={woodBaseColor}
                  stroke={woodSecondaryColor}
                  strokeWidth="0.75"
                />
              );
            })}
            <rect x="390" y="440" width="100" height="36" rx="6" fill="#000000" fillOpacity="0.9" stroke="#FF8407" strokeWidth="1" />
            <text x="440" y="455" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
              {lang === 'es' ? 'Escaleras' : 'Stairs (Down)'}
            </text>
            <text x="440" y="468" textAnchor="middle" fill="#FF8407" fontSize="9" fontWeight="bold">
              {stairsCount} {lang === 'es' ? 'Escalones a Medida' : 'Custom Steps'}
            </text>
          </g>

          {/* ========================================================
              DIMENSION BADGES & LABELS (Toggleable)
              ======================================================== */}
          {showDimensions && (
            <g className="transition-opacity duration-300">
              {/* Bedroom 2 */}
              <g
                className="cursor-pointer"
                onClick={() => {
                  setActiveRoom('Bedroom 2');
                  onSelectRoom?.('Bedroom 2');
                }}
              >
                <rect x="290" y="165" width="105" height="42" rx="8" fill="#000000" fillOpacity="0.85" stroke="#FF8407" strokeWidth="1" />
                <text x="342" y="181" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                  Bedroom 2
                </text>
                <text x="342" y="195" textAnchor="middle" fill="#FF8407" fontSize="10" fontWeight="bold">
                  {bed2Dims}
                </text>
                <text x="342" y="205" textAnchor="middle" fill="#94A3B8" fontSize="8">
                  ~{bed2Sqft} sq ft
                </text>
              </g>

              {/* Closet */}
              <text x="475" y="90" textAnchor="middle" fill="#CBD5E1" fontSize="9" fontWeight="bold" transform="rotate(90 475 90)">
                Closet
              </text>

              {/* Owner's Suite (Primary Bedroom) */}
              <g
                className="cursor-pointer"
                onClick={() => {
                  setActiveRoom("Owner's Suite");
                  onSelectRoom?.("Owner's Suite");
                }}
              >
                <rect x="725" y="195" width="145" height="46" rx="8" fill="#000000" fillOpacity="0.85" stroke="#FF8407" strokeWidth="1.5" />
                <text x="797" y="212" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">
                  {lang === 'es' ? "Owner's Suite (Principal)" : "Owner's Suite"}
                </text>
                <text x="797" y="226" textAnchor="middle" fill="#FF8407" fontSize="11" fontWeight="bold">
                  {ownerSuiteDims}
                </text>
                <text x="797" y="238" textAnchor="middle" fill="#94A3B8" fontSize="9">
                  ~{ownerSuiteSqft} sq ft Net
                </text>
              </g>

              {/* Primary Walk-in Closet */}
              <g>
                <rect x="635" y="415" width="120" height="38" rx="6" fill="#000000" fillOpacity="0.85" stroke="#334155" strokeWidth="1" />
                <text x="695" y="430" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                  Walk-In Closet
                </text>
                <text x="695" y="443" textAnchor="middle" fill="#FF8407" fontSize="9" fontWeight="bold">
                  ~{walkInClosetSqft} sq ft
                </text>
              </g>

              {/* Primary Bathroom (Tile) */}
              <g>
                <rect x="805" y="415" width="120" height="38" rx="6" fill="#000000" fillOpacity="0.85" stroke="#334155" strokeWidth="1" />
                <text x="865" y="430" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                  Primary Bath
                </text>
                <text x="865" y="443" textAnchor="middle" fill="#94A3B8" fontSize="9">
                  {lang === 'es' ? 'Baldosa Existente' : 'Existing Wet Tile'}
                </text>
              </g>

              {/* Bedroom 3 */}
              <g
                className="cursor-pointer"
                onClick={() => {
                  setActiveRoom('Bedroom 3');
                  onSelectRoom?.('Bedroom 3');
                }}
              >
                <rect x="85" y="255" width="105" height="42" rx="8" fill="#000000" fillOpacity="0.85" stroke="#FF8407" strokeWidth="1" />
                <text x="137" y="271" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                  Bedroom 3
                </text>
                <text x="137" y="285" textAnchor="middle" fill="#FF8407" fontSize="10" fontWeight="bold">
                  {bed3Dims}
                </text>
                <text x="137" y="295" textAnchor="middle" fill="#94A3B8" fontSize="8">
                  ~{bed3Sqft} sq ft
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Highlights & Floor Scope Badges */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <p className="text-[#64748B] font-bold">{lang === 'es' ? 'Área Neta Calculada' : 'Total Net Area'}</p>
          <p className="text-[#FF8407] font-black text-base">{netAreaSqft} sq ft</p>
        </div>
        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <p className="text-[#64748B] font-bold">{lang === 'es' ? 'Peldaños de Escalera' : 'Stairs Count'}</p>
          <p className="text-[#000000] font-black text-base">{stairsCount} {lang === 'es' ? 'Escalones' : 'Steps'}</p>
        </div>
        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <p className="text-[#64748B] font-bold">{lang === 'es' ? 'Transición de Puertas' : 'Door Transitions'}</p>
          <p className="text-[#000000] font-black text-base">{lang === 'es' ? 'Continuo Sin T-Molding' : 'Continuous Flow'}</p>
        </div>
        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <p className="text-[#64748B] font-bold">{lang === 'es' ? 'Zócalos y Nivelación' : 'Subfloor Prep'}</p>
          <p className="text-[#FF8407] font-black text-base">{lang === 'es' ? 'Incluido Llave en Mano' : 'Included Turnkey'}</p>
        </div>
      </div>
    </div>
  );
};
