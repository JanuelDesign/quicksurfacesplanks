import React, { useState } from 'react';
import { FloorPlanModel, FlooringProduct, FloorScope } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Layers, Sparkles, Eye, Ruler } from 'lucide-react';

interface InteractiveFloorPlan2DProps {
  model: FloorPlanModel;
  selectedProduct: FlooringProduct;
  floorScope: FloorScope;
  onChangeFloorScope?: (scope: FloorScope) => void;
  onSelectRoom?: (roomName: string) => void;
}

export const InteractiveFloorPlan2D: React.FC<InteractiveFloorPlan2DProps> = ({
  model,
  selectedProduct,
  floorScope,
  onChangeFloorScope,
  onSelectRoom,
}) => {
  const { lang } = useLanguage();
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [activeTabDual, setActiveTabDual] = useState<'floor1' | 'floor2' | 'both'>('both');
  const [selectedRoomModal, setSelectedRoomModal] = useState<string | null>(null);

  // Dynamic wood tones based on active selected swatch
  const woodBaseColor = selectedProduct.colorHex || '#c4a682';
  const woodSecondaryColor = selectedProduct.secondaryColorHex || '#a1815d';

  // Active view level calculation
  const isFloor1 = floorScope === 'floor1' || floorScope === 'floor1_stairs';
  const hasStairs = floorScope === 'floor1_stairs' || floorScope === 'floor2_stairs';

  // Calculate dynamic metraje based on scope
  const sqftNet = isFloor1
    ? model.sqftFirstFloor || 510
    : model.sqftSecondFloor || 465;

  const wasteSqft = Math.ceil(sqftNet * 0.07);
  const sqftRec = sqftNet + wasteSqft;

  const boxesCount = Math.ceil(sqftRec / (selectedProduct.sqftPerBox || 24.26));

  const handleRoomClick = (roomName: string) => {
    setSelectedRoomModal(roomName);
    onSelectRoom?.(roomName);
  };

  const modelKey = (model.name || '').toLowerCase();

  // Model-specific SVG rendering functions
  const renderFirstFloorSVG = () => {
    // 1. BANDOL (3 Bed / 3 Bath - Has Bed 3 on 1st Floor)
    if (modelKey.includes('bandol')) {
      return (
        <g>
          {/* Kitchen Zone */}
          <g className="cursor-pointer" onClick={() => handleRoomClick('Kitchen')}>
            <rect x="44" y="84" width="195" height="195" fill="url(#planksTextureFloor)" className="transition-all hover:opacity-90" />
            <rect x="48" y="88" width="60" height="110" fill="#000000" opacity="0.3" stroke="#FFFFFF" strokeWidth="1.5" />
            <rect x="140" y="140" width="50" height="90" rx="4" fill="#000000" opacity="0.35" stroke="#FFFFFF" strokeWidth="2" />
            <text x="165" y="190" fill="#FFFFFF" fontSize="11" fontWeight="800" textAnchor="middle">ISLAND</text>
            {showDimensions && (
              <g>
                <rect x="52" y="110" width="135" height="42" rx="6" fill="#000000" fillOpacity="0.88" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="119" y="128" fill="#FFFFFF" fontSize="15" fontWeight="900" textAnchor="middle">KITCHEN</text>
                <text x="119" y="145" fill="#FF8407" fontSize="13" fontWeight="900" textAnchor="middle">7&apos;10&quot; x 11&apos;4&quot;</text>
              </g>
            )}
          </g>

          {/* Dining Room */}
          <g className="cursor-pointer" onClick={() => handleRoomClick('Dining Room')}>
            <rect x="239" y="84" width="217" height="195" fill="url(#planksTextureFloor)" className="transition-all hover:opacity-90" />
            <rect x="285" y="130" width="120" height="70" rx="8" fill="#000000" opacity="0.3" stroke="#FFFFFF" strokeWidth="1.5" />
            {showDimensions && (
              <g>
                <rect x="280" y="140" width="145" height="42" rx="6" fill="#000000" fillOpacity="0.88" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="352" y="158" fill="#FFFFFF" fontSize="15" fontWeight="900" textAnchor="middle">DINING ROOM</text>
                <text x="352" y="175" fill="#FF8407" fontSize="13" fontWeight="900" textAnchor="middle">9&apos;8&quot; x 11&apos;4&quot;</text>
              </g>
            )}
          </g>

          <line x1="239" y1="84" x2="239" y2="280" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 4" />

          {/* Family Room */}
          <g className="cursor-pointer" onClick={() => handleRoomClick('Family Room')}>
            <rect x="44" y="280" width="240" height="250" fill="url(#planksTextureFloor)" className="transition-all hover:opacity-90" />
            <path d="M 50 300 L 190 300 L 190 340 L 90 340 L 90 470 L 50 470 Z" fill="#000000" opacity="0.3" stroke="#FFFFFF" strokeWidth="1.5" />
            {showDimensions && (
              <g>
                <rect x="65" y="375" width="165" height="46" rx="8" fill="#000000" fillOpacity="0.9" stroke="#FF8407" strokeWidth="2" />
                <text x="147" y="396" fill="#FFFFFF" fontSize="16" fontWeight="900" textAnchor="middle">FAMILY ROOM</text>
                <text x="147" y="414" fill="#FF8407" fontSize="14" fontWeight="900" textAnchor="middle">14&apos;2&quot; x 10&apos;8&quot; • 151 SF</text>
              </g>
            )}
          </g>

          {/* Stairs (17 Steps) */}
          <g className="cursor-pointer" onClick={() => handleRoomClick('Stairs')}>
            <rect x="375" y="370" width="85" height="180" fill="#1F2937" stroke="#FFFFFF" strokeWidth="2" />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((i) => (
              <line key={i} x1="375" y1={370 + i * 10.5} x2="460" y2={370 + i * 10.5} stroke="#FF8407" strokeWidth="2" />
            ))}
            <rect x="380" y="435" width="75" height="34" rx="4" fill="#000000" fillOpacity="0.9" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="417" y="450" fill="#FF8407" fontSize="11" fontWeight="900" textAnchor="middle">ESCALERAS</text>
            <text x="417" y="463" fill="#FFFFFF" fontSize="10" fontWeight="800" textAnchor="middle">17 PASOS (UP)</text>
          </g>

          {/* Bath 3 (Existing Tile) */}
          <g className="cursor-pointer" onClick={() => handleRoomClick('Bath 3')}>
            <rect x="44" y="530" width="180" height="100" fill="url(#tileTextureBath)" stroke="#FFFFFF" strokeWidth="2.5" />
            <rect x="48" y="534" width="50" height="92" rx="6" fill="#374151" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="120" cy="575" r="14" fill="#374151" stroke="#FFFFFF" strokeWidth="1.5" />
            <rect x="150" y="535" width="40" height="40" fill="#374151" stroke="#FFFFFF" strokeWidth="1.5" />
            {showDimensions && (
              <g>
                <rect x="100" y="590" width="115" height="32" rx="4" fill="#000000" fillOpacity="0.9" stroke="#94A3B8" strokeWidth="1" />
                <text x="157" y="605" fill="#FFFFFF" fontSize="12" fontWeight="900" textAnchor="middle">BATH 3</text>
                <text x="157" y="617" fill="#94A3B8" fontSize="9" fontWeight="700" textAnchor="middle">(Baldosa Existente)</text>
              </g>
            )}
          </g>

          {/* Bedroom 3 */}
          <g className="cursor-pointer" onClick={() => handleRoomClick('Bedroom 3')}>
            <rect x="44" y="630" width="240" height="186" fill="url(#planksTextureFloor)" stroke="#FFFFFF" strokeWidth="2.5" />
            <rect x="52" y="700" width="90" height="105" rx="6" fill="#000000" opacity="0.3" stroke="#FFFFFF" strokeWidth="1.5" />
            {showDimensions && (
              <g>
                <rect x="65" y="660" width="165" height="46" rx="8" fill="#000000" fillOpacity="0.9" stroke="#FF8407" strokeWidth="2" />
                <text x="147" y="681" fill="#FFFFFF" fontSize="16" fontWeight="900" textAnchor="middle">BEDROOM 3</text>
                <text x="147" y="699" fill="#FF8407" fontSize="14" fontWeight="900" textAnchor="middle">10&apos; x 11&apos;10&quot; • 118 SF</text>
              </g>
            )}
          </g>

          {/* Foyer & Covered Entry */}
          <g className="cursor-pointer" onClick={() => handleRoomClick('Foyer')}>
            <rect x="284" y="530" width="176" height="286" fill="url(#planksTextureFloor)" />
            <rect x="325" y="730" width="135" height="86" fill="#1E293B" stroke="#FFFFFF" strokeWidth="2" />
            <text x="392" y="775" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle">COVERED ENTRY</text>
            {showDimensions && (
              <g>
                <rect x="295" y="640" width="100" height="34" rx="6" fill="#000000" fillOpacity="0.9" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="345" y="658" fill="#FFFFFF" fontSize="14" fontWeight="900" textAnchor="middle">FOYER</text>
                <text x="345" y="670" fill="#FF8407" fontSize="10" fontWeight="800" textAnchor="middle">ENTRADA</text>
              </g>
            )}
          </g>

          {/* Wall lines */}
          <line x1="40" y1="280" x2="460" y2="280" stroke="#FFFFFF" strokeWidth="3.5" />
          <line x1="40" y1="530" x2="284" y2="530" stroke="#FFFFFF" strokeWidth="3.5" />
          <line x1="40" y1="630" x2="284" y2="630" stroke="#FFFFFF" strokeWidth="3.5" />
          <line x1="284" y1="530" x2="284" y2="820" stroke="#FFFFFF" strokeWidth="3.5" />
          <line x1="375" y1="370" x2="375" y2="550" stroke="#FFFFFF" strokeWidth="3.5" />
        </g>
      );
    }

    // 2. CASIS / MONTE CARLO / RESERVE / VENCE (Great Room / Living / Dining Open Layout)
    const isVence = modelKey.includes('vence');
    const isMonteCarlo = modelKey.includes('monte');
    const isReserve = modelKey.includes('reserve');

    const livingDims = isVence
      ? '13\'10" x 13\'7"'
      : isMonteCarlo
      ? '14\'8" x 12\'8"'
      : isReserve
      ? '14\'0" x 12\'0"'
      : '17\'6" x 12\'0"';

    const familyDims = isVence
      ? '10\'6" x 16\'10"'
      : isMonteCarlo
      ? '11\'4" x 10\'0"'
      : isReserve
      ? '17\'6" x 12\'0"'
      : '12\'0" x 11\'6"';

    const kitchenDims = isVence
      ? '9\'6" x 11\'6"'
      : isMonteCarlo
      ? '8\'0" x 11\'4"'
      : isReserve
      ? '9\'0" x 11\'6"'
      : '8\'6" x 11\'6"';

    const diningDims = isVence
      ? '12\'0" x 10\'0"'
      : isMonteCarlo
      ? '10\'0" x 11\'4"'
      : isReserve
      ? '14\'0" x 12\'0"'
      : '10\'0" x 11\'6"';

    return (
      <g>
        {/* Kitchen & Island Top Area */}
        <g className="cursor-pointer" onClick={() => handleRoomClick('Kitchen')}>
          <rect x="44" y="84" width="200" height="210" fill="url(#planksTextureFloor)" />
          <rect x="48" y="88" width="65" height="120" fill="#000000" opacity="0.35" stroke="#FFFFFF" strokeWidth="1.5" />
          <rect x="135" y="145" width="55" height="95" rx="6" fill="#000000" opacity="0.35" stroke="#FFFFFF" strokeWidth="2" />
          <text x="162" y="195" fill="#FFFFFF" fontSize="11" fontWeight="800" textAnchor="middle">ISLAND</text>
          {showDimensions && (
            <g>
              <rect x="52" y="105" width="140" height="44" rx="6" fill="#000000" fillOpacity="0.9" stroke="#FFFFFF" strokeWidth="1.5" />
              <text x="122" y="124" fill="#FFFFFF" fontSize="15" fontWeight="900" textAnchor="middle">KITCHEN</text>
              <text x="122" y="141" fill="#FF8407" fontSize="13" fontWeight="900" textAnchor="middle">{kitchenDims}</text>
            </g>
          )}
        </g>

        {/* Dining Area */}
        <g className="cursor-pointer" onClick={() => handleRoomClick('Dining Room')}>
          <rect x="244" y="84" width="212" height="210" fill="url(#planksTextureFloor)" />
          <rect x="285" y="140" width="125" height="75" rx="8" fill="#000000" opacity="0.3" stroke="#FFFFFF" strokeWidth="1.5" />
          {showDimensions && (
            <g>
              <rect x="280" y="145" width="145" height="44" rx="6" fill="#000000" fillOpacity="0.9" stroke="#FFFFFF" strokeWidth="1.5" />
              <text x="352" y="164" fill="#FFFFFF" fontSize="15" fontWeight="900" textAnchor="middle">DINING ROOM</text>
              <text x="352" y="181" fill="#FF8407" fontSize="13" fontWeight="900" textAnchor="middle">{diningDims}</text>
            </g>
          )}
        </g>

        <line x1="244" y1="84" x2="244" y2="294" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 4" />

        {/* Family Room / Great Room (Middle Zone) */}
        <g className="cursor-pointer" onClick={() => handleRoomClick('Family Room')}>
          <rect x="44" y="294" width="280" height="260" fill="url(#planksTextureFloor)" />
          <path d="M 50 310 L 220 310 L 220 350 L 100 350 L 100 490 L 50 490 Z" fill="#000000" opacity="0.3" stroke="#FFFFFF" strokeWidth="1.5" />
          {showDimensions && (
            <g>
              <rect x="65" y="390" width="175" height="48" rx="8" fill="#000000" fillOpacity="0.92" stroke="#FF8407" strokeWidth="2" />
              <text x="152" y="412" fill="#FFFFFF" fontSize="16" fontWeight="900" textAnchor="middle">
                {isReserve || isMonteCarlo ? 'FAMILY ROOM' : 'GREAT ROOM'}
              </text>
              <text x="152" y="430" fill="#FF8407" fontSize="14" fontWeight="900" textAnchor="middle">{familyDims}</text>
            </g>
          )}
        </g>

        {/* Stairs (17 Steps) */}
        <g className="cursor-pointer" onClick={() => handleRoomClick('Stairs')}>
          <rect x="365" y="350" width="95" height="190" fill="#1F2937" stroke="#FFFFFF" strokeWidth="2" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((i) => (
            <line key={i} x1="365" y1={350 + i * 11} x2="460" y2={350 + i * 11} stroke="#FF8407" strokeWidth="2" />
          ))}
          <rect x="372" y="420" width="82" height="38" rx="4" fill="#000000" fillOpacity="0.92" stroke="#FF8407" strokeWidth="1.5" />
          <text x="413" y="436" fill="#FF8407" fontSize="11" fontWeight="900" textAnchor="middle">ESCALERAS</text>
          <text x="413" y="450" fill="#FFFFFF" fontSize="10" fontWeight="800" textAnchor="middle">17 PASOS (UP)</text>
        </g>

        {/* Powder Room (1/2 Baño - Tile) */}
        <g className="cursor-pointer" onClick={() => handleRoomClick('Powder Room')}>
          <rect x="44" y="554" width="140" height="95" fill="url(#tileTextureBath)" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="90" cy="595" r="14" fill="#374151" stroke="#FFFFFF" strokeWidth="1.5" />
          <rect x="130" y="560" width="40" height="40" fill="#374151" stroke="#FFFFFF" strokeWidth="1.5" />
          {showDimensions && (
            <g>
              <rect x="52" y="605" width="115" height="32" rx="4" fill="#000000" fillOpacity="0.9" stroke="#94A3B8" strokeWidth="1" />
              <text x="109" y="620" fill="#FFFFFF" fontSize="12" fontWeight="900" textAnchor="middle">1/2 BATH</text>
              <text x="109" y="632" fill="#94A3B8" fontSize="9" fontWeight="700" textAnchor="middle">(Baldosa)</text>
            </g>
          )}
        </g>

        {/* Living Room / Front Salon */}
        <g className="cursor-pointer" onClick={() => handleRoomClick('Living Room')}>
          <rect x="44" y="649" width="280" height="167" fill="url(#planksTextureFloor)" stroke="#FFFFFF" strokeWidth="2.5" />
          <rect x="60" y="685" width="120" height="70" rx="6" fill="#000000" opacity="0.3" stroke="#FFFFFF" strokeWidth="1.5" />
          {showDimensions && (
            <g>
              <rect x="70" y="695" width="175" height="46" rx="8" fill="#000000" fillOpacity="0.92" stroke="#FF8407" strokeWidth="2" />
              <text x="157" y="716" fill="#FFFFFF" fontSize="16" fontWeight="900" textAnchor="middle">LIVING ROOM</text>
              <text x="157" y="734" fill="#FF8407" fontSize="14" fontWeight="900" textAnchor="middle">{livingDims}</text>
            </g>
          )}
        </g>

        {/* Foyer & Covered Entry Porch */}
        <g className="cursor-pointer" onClick={() => handleRoomClick('Covered Entry')}>
          <rect x="324" y="554" width="136" height="262" fill="url(#planksTextureFloor)" />
          <rect x="335" y="725" width="125" height="91" fill="#1E293B" stroke="#FFFFFF" strokeWidth="2" />
          <text x="397" y="765" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle">COVERED</text>
          <text x="397" y="782" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle">ENTRY</text>
          {showDimensions && (
            <g>
              <rect x="335" y="640" width="105" height="34" rx="6" fill="#000000" fillOpacity="0.9" stroke="#FFFFFF" strokeWidth="1.5" />
              <text x="387" y="658" fill="#FFFFFF" fontSize="14" fontWeight="900" textAnchor="middle">FOYER</text>
              <text x="387" y="670" fill="#FF8407" fontSize="10" fontWeight="800" textAnchor="middle">ENTRADA</text>
            </g>
          )}
        </g>

        {/* Walls */}
        <line x1="40" y1="294" x2="460" y2="294" stroke="#FFFFFF" strokeWidth="3.5" />
        <line x1="40" y1="554" x2="324" y2="554" stroke="#FFFFFF" strokeWidth="3.5" />
        <line x1="40" y1="649" x2="324" y2="649" stroke="#FFFFFF" strokeWidth="3.5" />
        <line x1="324" y1="554" x2="324" y2="820" stroke="#FFFFFF" strokeWidth="3.5" />
        <line x1="365" y1="350" x2="365" y2="554" stroke="#FFFFFF" strokeWidth="3.5" />
      </g>
    );
  };

  const renderSecondFloorSVG = () => {
    const isBandol = modelKey.includes('bandol');
    const isVence = modelKey.includes('vence');
    const isMonteCarlo = modelKey.includes('monte');
    const isReserve = modelKey.includes('reserve');

    const suiteDims = isBandol
      ? '12\'0" x 10\'10" • 130 SF'
      : isVence
      ? '12\'0" x 15\'0" • 180 SF'
      : isMonteCarlo
      ? '15\'0" x 12\'0" • 180 SF'
      : isReserve
      ? '12\'0" x 12\'10" • 154 SF'
      : '12\'0" x 12\'0" • 144 SF';

    const bed2Dims = isBandol
      ? '12\'0" x 10\'0" • 120 SF'
      : isVence
      ? '11\'6" x 11\'0" • 127 SF'
      : isMonteCarlo
      ? '11\'0" x 10\'0" • 110 SF'
      : isReserve
      ? '12\'0" x 10\'6" • 126 SF'
      : '11\'0" x 10\'0" • 110 SF';

    const bed3Dims = isBandol
      ? '' // Bandol has Bed 3 on 1st Floor
      : isVence
      ? '11\'0" x 10\'6" • 116 SF'
      : isMonteCarlo
      ? '10\'6" x 10\'4" • 109 SF'
      : isReserve
      ? '11\'0" x 10\'0" • 110 SF'
      : '10\'6" x 10\'0" • 105 SF';

    return (
      <g>
        {/* Owner's Suite Zone */}
        <g className="cursor-pointer" onClick={() => handleRoomClick("Owner's Suite")}>
          <rect x="44" y="84" width="265" height="240" fill="url(#planksTextureFloor)" className="transition-all hover:opacity-90" />
          <rect x="52" y="100" width="130" height="150" rx="6" fill="#000000" opacity="0.3" stroke="#FFFFFF" strokeWidth="1.5" />
          <rect x="58" y="105" width="55" height="30" rx="3" fill="#FFFFFF" opacity="0.3" />
          <rect x="120" y="105" width="55" height="30" rx="3" fill="#FFFFFF" opacity="0.3" />
          {showDimensions && (
            <g>
              <rect x="85" y="160" width="180" height="52" rx="8" fill="#000000" fillOpacity="0.92" stroke="#FF8407" strokeWidth="2" />
              <text x="175" y="183" fill="#FFFFFF" fontSize="17" fontWeight="900" textAnchor="middle">OWNER&apos;S SUITE</text>
              <text x="175" y="202" fill="#FF8407" fontSize="14" fontWeight="900" textAnchor="middle">{suiteDims}</text>
            </g>
          )}
        </g>

        {/* Owner's Bath (Double Vanity & Shower - Tile) */}
        <g className="cursor-pointer" onClick={() => handleRoomClick('Owner Bath')}>
          <rect x="309" y="84" width="147" height="240" fill="url(#tileTextureBath)" stroke="#FFFFFF" strokeWidth="2.5" />
          <rect x="375" y="90" width="75" height="100" fill="#374151" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="412" cy="115" r="10" fill="#1F2937" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="412" cy="165" r="10" fill="#1F2937" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="340" cy="180" r="14" fill="#374151" stroke="#FFFFFF" strokeWidth="1.5" />
          <rect x="315" y="225" width="135" height="95" fill="#1E293B" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="315" y1="225" x2="450" y2="320" stroke="#64748B" strokeWidth="1.5" />
          <line x1="450" y1="225" x2="315" y2="320" stroke="#64748B" strokeWidth="1.5" />
          <text x="382" y="280" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle">SHOWER</text>
          {showDimensions && (
            <g>
              <rect x="318" y="115" width="80" height="34" rx="4" fill="#000000" fillOpacity="0.9" stroke="#94A3B8" strokeWidth="1" />
              <text x="358" y="132" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle">BATH 1</text>
              <text x="358" y="144" fill="#94A3B8" fontSize="9" fontWeight="700" textAnchor="middle">(Baldosa)</text>
            </g>
          )}
        </g>

        {/* Walk-in Closet */}
        <g className="cursor-pointer" onClick={() => handleRoomClick('Walk-In Closet')}>
          <rect x="44" y="324" width="150" height="150" fill="url(#planksTextureFloor)" stroke="#FFFFFF" strokeWidth="2.5" />
          {showDimensions && (
            <g>
              <rect x="52" y="375" width="135" height="46" rx="6" fill="#000000" fillOpacity="0.9" stroke="#FFFFFF" strokeWidth="1.5" />
              <text x="119" y="396" fill="#FFFFFF" fontSize="14" fontWeight="900" textAnchor="middle">W.I.C.</text>
              <text x="119" y="413" fill="#FF8407" fontSize="13" fontWeight="900" textAnchor="middle">CLOSET</text>
            </g>
          )}
        </g>

        {/* Laundry & HVAC Closets */}
        <g>
          <rect x="240" y="380" width="85" height="74" fill="#1F2937" stroke="#FFFFFF" strokeWidth="2" />
          <text x="282" y="412" fill="#FFFFFF" fontSize="11" fontWeight="800" textAnchor="middle">LAUNDRY</text>
          <text x="282" y="426" fill="#94A3B8" fontSize="9" fontWeight="700" textAnchor="middle">W/D</text>

          <rect x="240" y="454" width="85" height="60" fill="#1F2937" stroke="#FFFFFF" strokeWidth="2" />
          <text x="282" y="488" fill="#FFFFFF" fontSize="12" fontWeight="900" textAnchor="middle">HVAC</text>
        </g>

        {/* Hallway & Stairs Arrival (17 Steps) */}
        <g>
          <rect x="194" y="324" width="140" height="250" fill="url(#planksTextureFloor)" />
          <rect x="334" y="380" width="122" height="174" fill="#1F2937" stroke="#FFFFFF" strokeWidth="2.5" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((i) => (
            <line key={i} x1="334" y1={380 + i * 10} x2="456" y2={380 + i * 10} stroke="#FF8407" strokeWidth="2" />
          ))}
          <rect x="345" y="445" width="100" height="42" rx="6" fill="#000000" fillOpacity="0.9" stroke="#FF8407" strokeWidth="2" />
          <text x="395" y="462" fill="#FF8407" fontSize="12" fontWeight="900" textAnchor="middle">17 ESCALONES</text>
          <text x="395" y="477" fill="#FFFFFF" fontSize="9" fontWeight="800" textAnchor="middle">SQUARE STEP NOSE</text>
        </g>

        {/* Bandol 2nd Floor (Bed 2 + Bath 2) vs Casis/Monte Carlo/Reserve/Vence (Bed 2 + Bed 3 + Bath 2) */}
        {isBandol ? (
          <>
            {/* Bedroom 2 */}
            <g className="cursor-pointer" onClick={() => handleRoomClick('Bedroom 2')}>
              <rect x="44" y="574" width="250" height="242" fill="url(#planksTextureFloor)" stroke="#FFFFFF" strokeWidth="2.5" />
              <rect x="52" y="660" width="120" height="145" rx="6" fill="#000000" opacity="0.3" stroke="#FFFFFF" strokeWidth="1.5" />
              {showDimensions && (
                <g>
                  <rect x="65" y="615" width="170" height="48" rx="8" fill="#000000" fillOpacity="0.92" stroke="#FF8407" strokeWidth="2" />
                  <text x="150" y="638" fill="#FFFFFF" fontSize="16" fontWeight="900" textAnchor="middle">BEDROOM 2</text>
                  <text x="150" y="655" fill="#FF8407" fontSize="14" fontWeight="900" textAnchor="middle">{bed2Dims}</text>
                </g>
              )}
            </g>

            {/* Bathroom 2 (Tile) */}
            <g className="cursor-pointer" onClick={() => handleRoomClick('Bath 2')}>
              <rect x="294" y="574" width="162" height="242" fill="url(#tileTextureBath)" stroke="#FFFFFF" strokeWidth="2.5" />
              <rect x="305" y="582" width="140" height="60" rx="8" fill="#374151" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="350" cy="700" r="14" fill="#374151" stroke="#FFFFFF" strokeWidth="1.5" />
              <rect x="390" y="730" width="60" height="70" fill="#374151" stroke="#FFFFFF" strokeWidth="1.5" />
              {showDimensions && (
                <g>
                  <rect x="320" y="650" width="115" height="34" rx="4" fill="#000000" fillOpacity="0.9" stroke="#94A3B8" strokeWidth="1" />
                  <text x="377" y="667" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle">BATH 2</text>
                  <text x="377" y="679" fill="#94A3B8" fontSize="9" fontWeight="700" textAnchor="middle">(Baldosa Existente)</text>
                </g>
              )}
            </g>
            <line x1="294" y1="574" x2="294" y2="820" stroke="#FFFFFF" strokeWidth="3.5" />
          </>
        ) : (
          <>
            {/* Casis / Monte Carlo / Reserve / Vence: Bed 2, Bed 3 & Bath 2 */}
            {/* Bedroom 2 */}
            <g className="cursor-pointer" onClick={() => handleRoomClick('Bedroom 2')}>
              <rect x="44" y="574" width="200" height="242" fill="url(#planksTextureFloor)" stroke="#FFFFFF" strokeWidth="2.5" />
              <rect x="52" y="660" width="95" height="135" rx="6" fill="#000000" opacity="0.3" stroke="#FFFFFF" strokeWidth="1.5" />
              {showDimensions && (
                <g>
                  <rect x="55" y="615" width="165" height="46" rx="8" fill="#000000" fillOpacity="0.92" stroke="#FF8407" strokeWidth="2" />
                  <text x="137" y="636" fill="#FFFFFF" fontSize="15" fontWeight="900" textAnchor="middle">BEDROOM 2</text>
                  <text x="137" y="653" fill="#FF8407" fontSize="13" fontWeight="900" textAnchor="middle">{bed2Dims}</text>
                </g>
              )}
            </g>

            {/* Bedroom 3 */}
            <g className="cursor-pointer" onClick={() => handleRoomClick('Bedroom 3')}>
              <rect x="244" y="574" width="130" height="242" fill="url(#planksTextureFloor)" stroke="#FFFFFF" strokeWidth="2.5" />
              <rect x="250" y="670" width="80" height="120" rx="6" fill="#000000" opacity="0.3" stroke="#FFFFFF" strokeWidth="1.5" />
              {showDimensions && (
                <g>
                  <rect x="248" y="615" width="122" height="46" rx="8" fill="#000000" fillOpacity="0.92" stroke="#FF8407" strokeWidth="2" />
                  <text x="309" y="636" fill="#FFFFFF" fontSize="14" fontWeight="900" textAnchor="middle">BEDROOM 3</text>
                  <text x="309" y="653" fill="#FF8407" fontSize="12" fontWeight="900" textAnchor="middle">{bed3Dims}</text>
                </g>
              )}
            </g>

            {/* Bath 2 (Tile) */}
            <g className="cursor-pointer" onClick={() => handleRoomClick('Bath 2')}>
              <rect x="374" y="574" width="82" height="242" fill="url(#tileTextureBath)" stroke="#FFFFFF" strokeWidth="2.5" />
              <rect x="380" y="582" width="70" height="60" rx="6" fill="#374151" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="415" cy="700" r="12" fill="#374151" stroke="#FFFFFF" strokeWidth="1.5" />
              {showDimensions && (
                <g>
                  <rect x="377" y="640" width="76" height="34" rx="4" fill="#000000" fillOpacity="0.9" stroke="#94A3B8" strokeWidth="1" />
                  <text x="415" y="657" fill="#FFFFFF" fontSize="11" fontWeight="900" textAnchor="middle">BATH 2</text>
                  <text x="415" y="669" fill="#94A3B8" fontSize="8" fontWeight="700" textAnchor="middle">(Baldosa)</text>
                </g>
              )}
            </g>

            <line x1="244" y1="574" x2="244" y2="820" stroke="#FFFFFF" strokeWidth="3.5" />
            <line x1="374" y1="574" x2="374" y2="820" stroke="#FFFFFF" strokeWidth="3.5" />
          </>
        )}

        {/* Walls */}
        <line x1="40" y1="324" x2="460" y2="324" stroke="#FFFFFF" strokeWidth="3.5" />
        <line x1="40" y1="574" x2="460" y2="574" stroke="#FFFFFF" strokeWidth="3.5" />
        <line x1="309" y1="80" x2="309" y2="324" stroke="#FFFFFF" strokeWidth="3.5" />
      </g>
    );
  };

  return (
    <div className="bg-[#FFFFFF] text-[#0F172A] rounded-3xl p-4 sm:p-7 border border-[#CBD5E1] shadow-xl relative overflow-hidden font-sans">
      {/* Top Header Controls Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-[#000000] text-[#FF8407] text-xs font-black tracking-wider uppercase">
              {lang === 'es' ? 'Plano 2D Arquitectónico' : 'Architectural 2D Plan'}
            </span>
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0]">
              {model.name} ({model.sqft} SF) • {model.collection}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
              {floorScope === 'floor1'
                ? lang === 'es' ? 'Solo 1er Piso' : '1st Floor Only'
                : floorScope === 'floor1_stairs'
                ? lang === 'es' ? '1er Piso + Escaleras' : '1st Floor + Stairs'
                : floorScope === 'floor2'
                ? lang === 'es' ? 'Solo 2do Piso' : '2nd Floor Only'
                : lang === 'es' ? '2do Piso + Escaleras' : '2nd Floor + Stairs'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 font-medium">
            {lang === 'es' ? 'Superficie a Instalar:' : 'Installation Area:'}{' '}
            <strong className="text-[#000000] font-black">{sqftNet} sq ft {lang === 'es' ? 'netos' : 'net'}</strong> •{' '}
            {lang === 'es' ? 'Material Recomendado (+7% desperdicio):' : 'Recommended Material (+7% waste):'}{' '}
            <strong className="text-[#FF8407] font-black">{sqftRec} sq ft ({boxesCount} {lang === 'es' ? 'cajas' : 'boxes'})</strong>
            {hasStairs && (
              <>
                {' '}• <strong className="text-[#000000] font-black">{lang === 'es' ? '17 Escalones Square Step Nose' : '17 Steps Square Step Nose'}</strong>
              </>
            )}
          </p>
        </div>

        {/* Action Controls - Prominent 2D Dimension Toggle Button */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setShowDimensions(!showDimensions)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              showDimensions
                ? 'bg-[#FF8407] text-[#000000] ring-2 ring-[#FF8407]/50 shadow-lg'
                : 'bg-[#0F172A] text-white hover:bg-[#1E293B] border border-slate-700'
            }`}
          >
            {showDimensions ? <Eye className="w-4 h-4 text-black" /> : <Ruler className="w-4 h-4 text-[#FF8407]" />}
            <span>
              {showDimensions
                ? lang === 'es'
                  ? '✓ Dimensiones Visibles en Plano 2D'
                  : '✓ 2D Plan Dimensions Visible'
                : lang === 'es'
                ? 'Ver Dimensiones en el Plano 2D'
                : 'View Dimensions on 2D Plan'}
            </span>
          </button>
        </div>
      </div>

      {/* 2D Architectural CAD Floor Plan Canvas - High-Contrast Grayscale & White Lines */}
      <div className="relative w-full bg-[#111827] rounded-2xl p-3 sm:p-6 overflow-hidden border-2 border-[#374151] shadow-2xl">
        {/* Subtle Architectural Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"></div>

        {/* SVG Definition Container */}
        <div className="w-full max-w-xl mx-auto">
          {/* ========================================================
              FIRST FLOOR (PLANTA BAJA) SVG
              ======================================================== */}
          {isFloor1 ? (
            <div className="flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-white/20">
                <span className="text-sm sm:text-base font-black text-white tracking-wide uppercase flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF8407]"></span>
                  {lang === 'es' ? '1er Piso (Planta Baja)' : '1st Floor (Ground Level)'}
                </span>
                <span className="text-xs font-bold text-slate-300 font-mono">
                  ~{model.sqftFirstFloor || 510} SF {lang === 'es' ? 'Neto' : 'Net'} {hasStairs ? (lang === 'es' ? '+ 17 Escalones' : '+ 17 Steps') : ''}
                </span>
              </div>

              <svg
                viewBox="0 0 500 860"
                className="w-full h-auto select-none rounded-xl drop-shadow-2xl"
              >
                <defs>
                  {/* Dynamic Floor Planks Texture */}
                  <pattern id="planksTextureFloor" width="48" height="14" patternUnits="userSpaceOnUse">
                    <rect width="48" height="14" fill={woodBaseColor} />
                    <line x1="0" y1="0" x2="48" y2="0" stroke={woodSecondaryColor} strokeWidth="1.2" strokeOpacity="0.8" />
                    <line x1="0" y1="7" x2="48" y2="7" stroke={woodSecondaryColor} strokeWidth="1.2" strokeOpacity="0.8" />
                    <line x1="24" y1="0" x2="24" y2="7" stroke={woodSecondaryColor} strokeWidth="1.2" strokeOpacity="0.8" />
                    <line x1="0" y1="7" x2="0" y2="14" stroke={woodSecondaryColor} strokeWidth="1.2" strokeOpacity="0.8" />
                    <line x1="48" y1="7" x2="48" y2="14" stroke={woodSecondaryColor} strokeWidth="1.2" strokeOpacity="0.8" />
                  </pattern>

                  {/* Tile pattern for non-vinyl areas (Baths, Patio) */}
                  <pattern id="tileTextureBath" width="16" height="16" patternUnits="userSpaceOnUse">
                    <rect width="16" height="16" fill="#1F2937" />
                    <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#4B5563" strokeWidth="1" />
                  </pattern>
                </defs>

                {/* Exterior Foundation Background */}
                <rect x="20" y="20" width="460" height="820" rx="16" fill="#0B0F17" stroke="#374151" strokeWidth="2" />

                {/* TOP: PATIO (Tile / Concrete - Not Vinyl) */}
                <g>
                  <rect x="180" y="25" width="160" height="50" fill="#1E293B" stroke="#64748B" strokeWidth="2" strokeDasharray="4 4" rx="4" />
                  <text x="260" y="55" fill="#94A3B8" fontSize="14" fontWeight="800" textAnchor="middle">
                    {lang === 'es' ? 'PATIO EXTERIOR' : 'OUTDOOR PATIO'}
                  </text>
                </g>

                {/* MAIN HOUSE EXTERIOR WALL BORDER */}
                <rect x="40" y="80" width="420" height="740" rx="8" fill="#111827" stroke="#FFFFFF" strokeWidth="4" />

                {/* Render Dynamic Model Floor Plan */}
                {renderFirstFloorSVG()}

                {/* Clean Thick Perimeter Walls */}
                <rect x="40" y="80" width="420" height="740" rx="8" fill="none" stroke="#FFFFFF" strokeWidth="5" />
              </svg>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-white/20">
                <span className="text-sm sm:text-base font-black text-white tracking-wide uppercase flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF8407]"></span>
                  {lang === 'es' ? '2do Piso (Planta Alta)' : '2nd Floor (Upper Level)'}
                </span>
                <span className="text-xs font-bold text-slate-300 font-mono">
                  ~{model.sqftSecondFloor || 465} SF {hasStairs ? (lang === 'es' ? '+ 17 Escalones' : '+ 17 Steps') : (lang === 'es' ? 'Neto' : 'Net')}
                </span>
              </div>

              <svg
                viewBox="0 0 500 860"
                className="w-full h-auto select-none rounded-xl drop-shadow-2xl"
              >
                {/* Exterior Foundation Background */}
                <rect x="20" y="20" width="460" height="820" rx="16" fill="#0B0F17" stroke="#374151" strokeWidth="2" />

                {/* MAIN HOUSE EXTERIOR WALL BORDER */}
                <rect x="40" y="80" width="420" height="740" rx="8" fill="#111827" stroke="#FFFFFF" strokeWidth="4" />

                {/* Render Dynamic Model 2nd Floor */}
                {renderSecondFloorSVG()}

                {/* Clean Thick Perimeter Walls */}
                <rect x="40" y="80" width="420" height="740" rx="8" fill="none" stroke="#FFFFFF" strokeWidth="5" />
              </svg>
            </div>
          )}
        </div>

        {/* Legend Sub-Bar below the Canvas */}
        <div className="mt-4 pt-3 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-sm border border-white/40 shadow-xs"
                style={{ backgroundColor: woodBaseColor }}
              ></span>
              <span className="font-bold text-white">
                {lang === 'es' ? 'Piso' : 'Flooring'} {selectedProduct.name} ({selectedProduct.thickness || '5.5mm'})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-[#1F2937] border border-slate-500"></span>
              <span className="text-slate-400">
                {lang === 'es' ? 'Baños / Patio (Área existente no incluida)' : 'Baths / Patio (Existing Tile Area)'}
              </span>
            </div>

            {hasStairs && (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-sm bg-[#FF8407]"></span>
                <span className="font-bold text-[#FF8407]">
                  {lang === 'es' ? '17 Escalones Square Step Nose' : '17 Steps Square Step Nose'}
                </span>
              </div>
            )}
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            {lang === 'es' ? '*Toca cualquier habitación para ver detalles' : '*Tap any room to view details'}
          </span>
        </div>
      </div>

      {/* Interactive Room Inspection Drawer/Popup if selected */}
      {selectedRoomModal && (
        <div className="mt-4 p-4 rounded-2xl bg-[#0F172A] text-white border border-[#334155] flex items-center justify-between gap-4 animate-fadeIn">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF8407]" />
              <span className="font-black text-sm text-[#FF8407] uppercase">
                {lang === 'es' ? 'Habitación Seleccionada:' : 'Selected Room:'} {selectedRoomModal}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {lang === 'es'
                ? `Instalación continua con tablones ${selectedProduct.name} de ${selectedProduct.thickness || '5.5mm'} sin transiciones intermedias antiestéticas.`
                : `Seamless installation with ${selectedProduct.name} ${selectedProduct.thickness || '5.5mm'} planks without unsightly transition strips.`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSelectedRoomModal(null)}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer shrink-0"
          >
            {lang === 'es' ? 'Cerrar' : 'Close'}
          </button>
        </div>
      )}
    </div>
  );
};
