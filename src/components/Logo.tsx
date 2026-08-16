import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  showTagline = true,
  className = '',
}) => {
  const isDark = variant === 'dark';
  const textColor = isDark ? '#000000' : '#FFFFFF';

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7 sm:w-8 sm:h-8',
    lg: 'w-9 h-9 sm:w-10 sm:h-10',
    xl: 'w-11 h-11 sm:w-12 sm:h-12',
  };

  const textSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl md:text-2xl',
    lg: 'text-xl sm:text-2xl md:text-3xl',
    xl: 'text-2xl sm:text-3xl md:text-4xl',
  };

  const taglineSizes = {
    sm: 'text-[7px]',
    md: 'text-[7px] sm:text-[8px]',
    lg: 'text-[8px] sm:text-[9px]',
    xl: 'text-[9px] sm:text-[10px]',
  };

  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 select-none ${className}`}>
      {/* Official QuickSurfaces Circular Emblem */}
      <svg
        viewBox="0 0 58 58"
        className={`${iconSizes[size]} shrink-0`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ring outline */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M29 55C43.3594 55 55 43.3594 55 29C55 14.6406 43.3594 3 29 3C14.6406 3 3 14.6406 3 29C3 43.3594 14.6406 55 29 55ZM29 58C45.0163 58 58 45.0163 58 29C58 12.9837 45.0163 0 29 0C12.9837 0 0 12.9837 0 29C0 45.0163 12.9837 58 29 58Z"
          fill={textColor}
        />
        {/* Left Orange Plank */}
        <path
          d="M7.16016 33.937H19.7045L24.8439 15.7129H19.145L7.16016 33.937Z"
          fill="#FF8407"
        />
        {/* Center Perspective Orange Plank */}
        <path
          d="M32.7332 18.9111H25.5557L20.778 42.5058H37.4101L32.7332 18.9111Z"
          fill="#FF8407"
        />
        {/* Right Orange Plank */}
        <path
          d="M50.9978 33.937H38.491L33.3832 15.7129H39.0327L50.9978 33.937Z"
          fill="#FF8407"
        />
      </svg>

      {/* Official Typography: Quick (Bold) + Surfaces (Light/Regular) */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline tracking-[-0.03em] leading-none">
          <span
            className={`font-black ${textSizes[size]}`}
            style={{ color: textColor, fontFamily: "'Poppins', sans-serif", fontWeight: 900 }}
          >
            Quick
          </span>
          <span
            className={`font-normal ${textSizes[size]}`}
            style={{ color: textColor, fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}
          >
            Surfaces
          </span>
        </div>
        {showTagline && (
          <span
            className={`${taglineSizes[size]} font-bold text-[#FF8407] tracking-[0.22em] uppercase mt-0.5 font-heading`}
          >
            Luxury Vinyl Flooring
          </span>
        )}
      </div>
    </div>
  );
};
