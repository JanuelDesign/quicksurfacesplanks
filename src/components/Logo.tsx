import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  showTagline = true,
}) => {
  const isDark = variant === 'dark';

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Official Circular Icon with 3 Orange Perspective Planks */}
      <div
        className={`${iconSizes[size]} rounded-full bg-[#000000] border-2 border-[#000000] flex items-center justify-center p-1.5 shadow-md flex-shrink-0 relative overflow-hidden`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left plank (angled trapezoid) */}
          <polygon
            points="35,30 46,30 24,70 12,70"
            fill="#FF8407"
          />
          {/* Center plank (perspective trapezoid) */}
          <polygon
            points="48,37 58,37 66,78 40,78"
            fill="#FF8407"
          />
          {/* Right plank (angled trapezoid) */}
          <polygon
            points="60,30 71,30 93,70 81,70"
            fill="#FF8407"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center leading-none">
          <span
            className={`font-black tracking-tight ${textSizes[size]} ${
              isDark ? 'text-[#000000]' : 'text-[#FFFFFF]'
            }`}
          >
            Quick
          </span>
          <span
            className={`font-normal tracking-tight ${textSizes[size]} ${
              isDark ? 'text-[#000000]' : 'text-[#FFFFFF]'
            }`}
          >
            Surfaces
          </span>
        </div>
        {showTagline && (
          <span className="text-[9px] font-bold text-[#FF8407] tracking-widest uppercase mt-0.5">
            Luxury Vinyl Flooring
          </span>
        )}
      </div>
    </div>
  );
};
