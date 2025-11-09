
import React from 'react';
import { Unit } from '../types';

interface UnitsToggleProps {
  selectedUnit: Unit;
  onUnitChange: (unit: Unit) => void;
}

export const UnitsToggle: React.FC<UnitsToggleProps> = ({ selectedUnit, onUnitChange }) => {
  const activeClass = "bg-white/30";
  const inactiveClass = "bg-white/10";

  return (
    <div className="flex items-center p-1 bg-black/20 rounded-full text-sm font-semibold">
      <button
        onClick={() => onUnitChange('metric')}
        className={`px-3 py-1 rounded-full transition-colors duration-300 ${selectedUnit === 'metric' ? activeClass : inactiveClass}`}
        aria-pressed={selectedUnit === 'metric'}
      >
        °C
      </button>
      <button
        onClick={() => onUnitChange('imperial')}
        className={`px-3 py-1 rounded-full transition-colors duration-300 ${selectedUnit === 'imperial' ? activeClass : inactiveClass}`}
        aria-pressed={selectedUnit === 'imperial'}
      >
        °F
      </button>
    </div>
  );
};
