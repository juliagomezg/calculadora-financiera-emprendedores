import React, { useState, useRef, useEffect } from 'react';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  disabled?: boolean;
}

const Slider = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  color = "bg-blue-600",
  label,
  showValue = true,
  disabled = false
}: SliderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(Number(e.target.value));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    
    let newValue = value;
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(min, value - step);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(max, value + step);
        break;
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      default:
        return;
    }
    
    e.preventDefault();
    onChange(newValue);
  };
  
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="w-full space-y-2 sm:space-y-3">
      {label && (
        <label className="block text-sm sm:text-base font-medium text-gray-700">
          {label}
          {showValue && (
            <span className="ml-2 text-blue-600 font-semibold">
              {value}
            </span>
          )}
        </label>
      )}
      
      <div className="relative w-full h-6 sm:h-8 flex items-center touch-target">
        <input
          ref={sliderRef}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          step={step}
          disabled={disabled}
          onMouseDown={() => !disabled && setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="absolute w-full h-0 opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={label || `Slider from ${min} to ${max}`}
        />
        
        {/* Track */}
        <div className={`w-full h-2 sm:h-3 rounded-full transition-all duration-200 ${
          disabled ? 'bg-gray-200' : 'bg-gray-200 hover:bg-gray-300'
        }`}>
          {/* Progress */}
          <div
            className={`h-full rounded-full transition-all duration-200 ${
              disabled ? 'bg-gray-400' : color
            } ${isDragging || isFocused ? 'shadow-lg' : ''}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Thumb */}
        <div
          className={`absolute h-5 w-5 sm:h-6 sm:w-6 rounded-full shadow-md border-2 border-white transition-all duration-200 ${
            disabled 
              ? 'bg-gray-400 cursor-not-allowed' 
              : `${color.replace('bg-', 'bg-')} cursor-pointer hover:scale-110`
          } ${
            isDragging || isFocused 
              ? 'scale-125 shadow-lg ring-2 ring-blue-500 ring-opacity-50' 
              : 'scale-100'
          }`}
          style={{ left: `calc(${percentage}% - ${12}px)` }}
        />
        
        {/* Focus indicator */}
        {isFocused && !disabled && (
          <div
            className="absolute h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-500 opacity-20 pointer-events-none transition-all duration-200"
            style={{ left: `calc(${percentage}% - ${16}px)` }}
          />
        )}
      </div>
      
      {/* Min/Max labels */}
      <div className="flex justify-between text-xs sm:text-sm text-gray-500 px-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default Slider;