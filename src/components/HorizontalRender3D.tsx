import React, { useState } from 'react';
import { FloorPlanModel, FlooringProduct } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Info, Eye, Layers, Check, Maximize2 } from 'lucide-react';

interface HorizontalRender3DProps {
  model: FloorPlanModel;
  selectedProduct: FlooringProduct;
  onSelectRoom?: (roomName: string) => void;
}

export const HorizontalRender3D: React.FC<HorizontalRender3DProps> = ({
  model,
  selectedProduct,
  onSelectRoom,
}) => {
  const { lang, t } = useLanguage();
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // Dynamic wood tones based on active selected swatch
  const woodBaseColor = selectedProduct.colorHex || '#c4a682';
  const woodSecondaryColor = selectedProduct.secondaryColorHex || '#a1815d';

  return (
    <div className="bg-[#FFFFFF] text-[#111827] rounded-3xl p-4 sm:p-7 border border-[#E2E8F0] shadow-xl relative overflow-hidden font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-[#000000] text-[#FF8407] text-xs font-black tracking-wider uppercase">
              3D Render
            </span>
            <h3 className="text-xl font-black text-[#000000] tracking-tight">
              {t('renderTitle')}
            </h3>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5 font-medium">
            {model.name} ({model.communityName}) • {model.sqft} sq ft Net Area + 15 Custom Steps
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
            <span className="text-[#64748B] font-mono">({selectedProduct.category})</span>
          </div>

          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              showLabels
                ? 'bg-[#000000] text-[#FFFFFF]'
                : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#000000]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#FF8407]" />
            <span>{showLabels ? 'Hide Dimensions' : 'Show Dimensions'}</span>
          </button>
        </div>
      </div>

      {/* 3D Architectural Horizontal Cutaway Canvas Container */}
      <div className="relative w-full bg-[#1A1A1A] rounded-2xl p-2 sm:p-4 overflow-hidden border border-[#CBD5E1] shadow-2xl">
        {/* Ambient room glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-orange-500/5 pointer-events-none"></div>

        {/* High Precision SVG 3D Floor Cutaway */}
        <svg
          viewBox="0 0 960 540"
          className="w-full h-auto max-h-[580px] select-none rounded-xl"
          style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.5))' }}
        >
          <defs>
            {/* Dynamic Planks Pattern in Horizontal Perspective */}
            <pattern
              id="horizontalPlanks3D"
              width="60"
              height="18"
              patternUnits="userSpaceOnUse"
            >
              <rect width="60" height="18" fill={woodBaseColor} />
              <line x1="0" y1="0" x2="60" y2="0" stroke={woodSecondaryColor} strokeWidth="1" strokeOpacity="0.6" />
              <line x1="0" y1="9" x2="60" y2="9" stroke={woodSecondaryColor} strokeWidth="1" strokeOpacity="0.6" />
              <line x1="30" y1="0" x2="30" y2="9" stroke={woodSecondaryColor} strokeWidth="1" strokeOpacity="0.6" />
              <line x1="0" y1="9" x2="0" y2="18" stroke={woodSecondaryColor} strokeWidth="1" strokeOpacity="0.6" />
              <line x1="60" y1="9" x2="60" y2="18" stroke={woodSecondaryColor} strokeWidth="1" strokeOpacity="0.6" />
            </pattern>

            {/* Bathroom Gray Tiles Pattern */}
            <pattern id="bathTile3D" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="16" height="16" fill="#4B5563" />
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#6B7280" strokeWidth="1" />
            </pattern>

            {/* Stairs Tread Pattern */}
            <pattern id="stairsPlanks3D" width="10" height="20" patternUnits="userSpaceOnUse">
              <rect width="10" height="20" fill={woodBaseColor} />
              <line x1="0" y1="20" x2="10" y2="20" stroke={woodSecondaryColor} strokeWidth="2" />
            </pattern>

            {/* Realistic Drop Shadows */}
            <filter id="wallShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="3" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.6" />
            </filter>
            <filter id="furnitureShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Background Outer Border Floor Outline */}
          <rect x="10" y="10" width="940" height="520" rx="14" fill="#2B2D31" />

          {/* ========================================================
              FLOOR SURFACES (Continuous Luxury Vinyl Flooring)
              ======================================================== */}
          {/* Top-Left Bedroom 2 */}
          <rect
            x="200"
            y="20"
            width="230"
            height="235"
            fill="url(#horizontalPlanks3D)"
            className="transition-all duration-300"
          />

          {/* Top-Center Closet & Bath Alcove */}
          <rect x="435" y="20" width="80" height="160" fill="url(#horizontalPlanks3D)" />
          <rect x="520" y="20" width="105" height="210" fill="url(#horizontalPlanks3D)" />
          <rect x="425" y="185" width="90" height="70" fill="url(#horizontalPlanks3D)" />

          {/* Top-Right Primary Bedroom (Owner's Suite) */}
          <rect
            x="630"
            y="20"
            width="310"
            height="310"
            fill="url(#horizontalPlanks3D)"
            className="transition-all duration-300"
          />

          {/* Center Hallway Area (Continuous Flow) */}
          <rect x="250" y="260" width="345" height="250" fill="url(#horizontalPlanks3D)" />

          {/* Bottom-Right Primary Closet & Primary Bathroom */}
          <rect x="610" y="335" width="170" height="175" fill="url(#horizontalPlanks3D)" />
          <rect x="785" y="335" width="155" height="175" fill="url(#bathTile3D)" />

          {/* Bottom-Left Bedroom 3 */}
          <rect
            x="30"
            y="245"
            width="220"
            height="265"
            fill="url(#horizontalPlanks3D)"
            className="transition-all duration-300"
          />

          {/* Top-Left Exterior Balcony/Roof Area */}
          <rect x="20" y="20" width="175" height="220" fill="#475569" opacity="0.9" />
          <text x="107" y="130" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="600">
            Balcony / Terrace Area
          </text>

          {/* ========================================================
              ARCHITECTURAL CUTAWAY 3D WALLS (Thick 3D Beveled Walls)
              ======================================================== */}
          <g filter="url(#wallShadow)">
            {/* Exterior Perimeter Walls */}
            <path
              d="M 15 15 L 945 15 L 945 525 L 15 525 Z M 25 25 L 25 515 L 935 515 L 935 25 Z"
              fill="#525866"
            />

            {/* Wall separating Left Balcony & Bedroom 2 */}
            <rect x="195" y="20" width="10" height="235" fill="#525866" />

            {/* Wall separating Top Bedrooms & Closets */}
            <rect x="430" y="20" width="10" height="170" fill="#525866" />
            <rect x="515" y="20" width="10" height="220" fill="#525866" />
            <rect x="425" y="180" width="100" height="10" fill="#525866" />
            <rect x="425" y="250" width="100" height="10" fill="#525866" />

            {/* Wall separating Primary Suite and Center */}
            <rect x="625" y="20" width="10" height="315" fill="#525866" />

            {/* Wall dividing Primary Suite and Bottom Primary Closets/Bath */}
            <rect x="625" y="330" width="315" height="10" fill="#525866" />
            <rect x="780" y="335" width="10" height="175" fill="#525866" />

            {/* Wall between Bottom-Left Bedroom and Hallway */}
            <rect x="250" y="245" width="10" height="265" fill="#525866" />
            <rect x="30" y="245" width="225" height="10" fill="#525866" />
          </g>

          {/* ========================================================
              FURNITURE & ROOM DETAILS (Matching Render en 3D)
              ======================================================== */}
          {/* 1. TOP-LEFT BEDROOM (10' 0" x 11' 1") */}
          <g filter="url(#furnitureShadow)">
            {/* Queen Bed */}
            <rect x="290" y="25" width="110" height="120" rx="8" fill="#D6D3D1" stroke="#A8A29E" strokeWidth="2" />
            {/* Headboard */}
            <rect x="285" y="20" width="120" height="14" rx="4" fill="#78716C" />
            {/* Pillows */}
            <rect x="300" y="36" width="40" height="24" rx="5" fill="#94A3B8" />
            <rect x="350" y="36" width="40" height="24" rx="5" fill="#94A3B8" />
            {/* Blanket Sheet */}
            <rect x="290" y="70" width="110" height="75" rx="6" fill="#F5F5F4" />
            {/* Nightstands */}
            <rect x="235" y="30" width="35" height="32" rx="4" fill="#E7E5E4" stroke="#D6D3D1" />
            <circle cx="252" cy="46" r="6" fill="#FBBF24" opacity="0.8" />
            <rect x="405" y="30" width="22" height="32" rx="4" fill="#E7E5E4" stroke="#D6D3D1" />
            {/* Plant */}
            <circle cx="230" cy="85" r="14" fill="#15803D" opacity="0.9" />
            <circle cx="230" cy="85" r="8" fill="#22C55E" />
            {/* Side Plant bottom */}
            <circle cx="230" cy="190" r="16" fill="#15803D" opacity="0.9" />
            <circle cx="230" cy="190" r="9" fill="#22C55E" />
          </g>

          {/* 2. TOP-RIGHT PRIMARY BEDROOM (11' 11" x 14' 11") */}
          <g filter="url(#furnitureShadow)">
            {/* Master King Bed */}
            <rect x="715" y="25" width="165" height="150" rx="10" fill="#E7E5E4" stroke="#A8A29E" strokeWidth="2" />
            {/* Master Headboard */}
            <rect x="705" y="18" width="185" height="16" rx="5" fill="#57534E" />
            {/* Luxury Master Pillows */}
            <rect x="730" y="36" width="60" height="30" rx="6" fill="#94A3B8" />
            <rect x="805" y="36" width="60" height="30" rx="6" fill="#94A3B8" />
            {/* Duvet */}
            <rect x="715" y="80" width="165" height="95" rx="8" fill="#FAFAF9" />
            {/* Nightstands with lamps */}
            <rect x="655" y="32" width="40" height="38" rx="5" fill="#E7E5E4" stroke="#D6D3D1" />
            <circle cx="675" cy="51" r="7" fill="#FBBF24" opacity="0.85" />
            <rect x="888" y="32" width="38" height="38" rx="5" fill="#E7E5E4" stroke="#D6D3D1" />
            <circle cx="907" cy="51" r="7" fill="#FBBF24" opacity="0.85" />
            {/* Plant */}
            <circle cx="685" cy="205" r="18" fill="#15803D" opacity="0.95" />
            <circle cx="685" cy="205" r="10" fill="#22C55E" />
          </g>

          {/* 3. PRIMARY CLOSET & PRIMARY BATHROOM */}
          <g filter="url(#furnitureShadow)">
            {/* Closet Hanger Rail */}
            <line x1="620" y1="365" x2="770" y2="365" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="6,4" />
            {/* Primary Bathroom Fixtures (Tub, Vanity, Toilet) */}
            <rect x="830" y="345" width="40" height="28" rx="4" fill="#FFFFFF" stroke="#CBD5E1" />
            <rect x="890" y="345" width="35" height="35" rx="6" fill="#FFFFFF" stroke="#CBD5E1" />
            <circle cx="907" cy="362" r="9" fill="#E2E8F0" />
            <rect x="870" y="475" width="60" height="30" rx="4" fill="#334155" />
          </g>

          {/* 4. 15 CUSTOM STAIRS (DOWN) WITH INTEGRATED NOSINGS */}
          <g filter="url(#furnitureShadow)">
            {/* Stairwell Outer Rim Box */}
            <rect x="330" y="405" width="180" height="105" rx="6" fill="#FFFFFF" stroke="#D6D3D1" strokeWidth="4" />
            {/* 15 Step Treads in Matching Plank Texture */}
            {Array.from({ length: 15 }).map((_, i) => (
              <rect
                key={i}
                x={340 + i * 11}
                y="420"
                width="10.5"
                height="85"
                fill={woodBaseColor}
                stroke={woodSecondaryColor}
                strokeWidth="0.75"
              />
            ))}
            {/* Stair Nosing & (Down) Stairs Label */}
            <rect x="405" y="445" width="80" height="36" rx="6" fill="#000000" fillOpacity="0.85" />
            <text x="445" y="460" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
              Stairs
            </text>
            <text x="445" y="473" textAnchor="middle" fill="#FF8407" fontSize="9" fontWeight="bold">
              (Down) • 15 Steps
            </text>
          </g>

          {/* 5. BOTTOM-LEFT BEDROOM (10' 0" x 11' 5") */}
          <g filter="url(#furnitureShadow)">
            {/* Bed */}
            <rect x="90" y="325" width="105" height="135" rx="8" fill="#D6D3D1" stroke="#A8A29E" strokeWidth="2" />
            <rect x="90" y="370" width="105" height="90" rx="6" fill="#F5F5F4" />
            <rect x="100" y="335" width="38" height="25" rx="4" fill="#94A3B8" />
            <rect x="145" y="335" width="38" height="25" rx="4" fill="#94A3B8" />
            {/* Nightstands */}
            <rect x="45" y="435" width="35" height="35" rx="4" fill="#E7E5E4" stroke="#D6D3D1" />
            <circle cx="62" cy="452" r="6" fill="#FBBF24" opacity="0.8" />
            <rect x="205" y="435" width="35" height="35" rx="4" fill="#E7E5E4" stroke="#D6D3D1" />
            <circle cx="222" cy="452" r="6" fill="#FBBF24" opacity="0.8" />
            {/* Closet bottom */}
            <rect x="280" y="420" width="35" height="85" rx="4" fill="#44403C" />
            <text x="297" y="465" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" transform="rotate(-90 297 465)">
              Closet
            </text>
          </g>

          {/* ========================================================
              DIMENSION LABELS & ROOM BADGES OVERLAYS (When showLabels = true)
              ======================================================== */}
          {showLabels && (
            <g className="transition-opacity duration-300">
              {/* Bedroom Top-Left */}
              <g className="cursor-pointer" onClick={() => onSelectRoom && onSelectRoom("Bedroom 2")}>
                <rect x="300" y="165" width="90" height="34" rx="6" fill="#000000" fillOpacity="0.75" />
                <text x="345" y="179" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                  Bedroom
                </text>
                <text x="345" y="192" textAnchor="middle" fill="#FF8407" fontSize="10" fontWeight="bold">
                  10' 0" x 11' 1"
                </text>
              </g>

              {/* Closet 7' 0" x 2' 3" */}
              <text x="475" y="90" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" transform="rotate(90 475 90)">
                Closet 7' 0" x 2' 3"
              </text>

              {/* Bedroom Center 7' 11" x 4' 11" */}
              <g>
                <rect x="535" y="105" width="80" height="32" rx="5" fill="#000000" fillOpacity="0.75" />
                <text x="575" y="118" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                  Bedroom / Bath
                </text>
                <text x="575" y="130" textAnchor="middle" fill="#FF8407" fontSize="9" fontWeight="bold">
                  7' 11" x 4' 11"
                </text>
              </g>

              {/* Closet 2' 8" x 3' 2" */}
              <g>
                <rect x="435" y="200" width="70" height="28" rx="4" fill="#000000" fillOpacity="0.75" />
                <text x="470" y="212" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">
                  Closet
                </text>
                <text x="470" y="223" textAnchor="middle" fill="#FF8407" fontSize="8" fontWeight="bold">
                  2' 8" x 3' 2"
                </text>
              </g>

              {/* Primary Bedroom 11' 11" x 14' 11" */}
              <g className="cursor-pointer" onClick={() => onSelectRoom && onSelectRoom("Primary Bedroom")}>
                <rect x="740" y="200" width="125" height="36" rx="6" fill="#000000" fillOpacity="0.75" />
                <text x="802" y="216" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">
                  Primary Bedroom
                </text>
                <text x="802" y="230" textAnchor="middle" fill="#FF8407" fontSize="11" fontWeight="bold">
                  11' 11" x 14' 11"
                </text>
              </g>

              {/* Primary Closet 4' 11" x 5' 9" */}
              <g>
                <rect x="640" y="415" width="105" height="32" rx="5" fill="#000000" fillOpacity="0.75" />
                <text x="692" y="428" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                  Primary Closet
                </text>
                <text x="692" y="440" textAnchor="middle" fill="#FF8407" fontSize="9" fontWeight="bold">
                  4' 11" x 5' 9"
                </text>
              </g>

              {/* Primary Bathroom 4' 11" x 7' 11" */}
              <g>
                <rect x="805" y="415" width="115" height="32" rx="5" fill="#000000" fillOpacity="0.75" />
                <text x="862" y="428" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                  Primary Bathroom
                </text>
                <text x="862" y="440" textAnchor="middle" fill="#FF8407" fontSize="9" fontWeight="bold">
                  4' 11" x 7' 11"
                </text>
              </g>

              {/* Bedroom Bottom-Left 10' 0" x 11' 5" */}
              <g className="cursor-pointer" onClick={() => onSelectRoom && onSelectRoom("Bedroom 3")}>
                <rect x="95" y="260" width="95" height="34" rx="6" fill="#000000" fillOpacity="0.75" />
                <text x="142" y="274" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                  Bedroom
                </text>
                <text x="142" y="287" textAnchor="middle" fill="#FF8407" fontSize="10" fontWeight="bold">
                  10' 0" x 11' 5"
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Highlights & Scope Badges */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <p className="text-[#64748B] font-bold">Total Net Area</p>
          <p className="text-[#FF8407] font-black text-base">{model.sqft} sq ft</p>
        </div>
        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <p className="text-[#64748B] font-bold">Stairs Count</p>
          <p className="text-[#000000] font-black text-base">15 Custom Steps</p>
        </div>
        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <p className="text-[#64748B] font-bold">Door Transitions</p>
          <p className="text-[#000000] font-black text-base">Continuous No-T-Molding</p>
        </div>
        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <p className="text-[#64748B] font-bold">Subfloor & Baseboards</p>
          <p className="text-[#FF8407] font-black text-base">Included in Turnkey</p>
        </div>
      </div>
    </div>
  );
};
