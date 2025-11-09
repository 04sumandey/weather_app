
import React, { useMemo } from 'react';
import { ForecastData, Unit } from '../types';
import { processForecastData } from '../utils/weatherUtils';

interface ForecastProps {
  data: ForecastData;
  unit: Unit;
}

const ForecastItem: React.FC<{ day: string; icon: string; min: number; max: number; unit: Unit }> = ({ day, icon, min, max, unit }) => {
  const tempUnit = unit === 'metric' ? '°C' : '°F';
  return (
    <div className="flex flex-col items-center justify-center bg-white/10 p-4 rounded-xl text-center backdrop-blur-sm flex-1 min-w-[120px]">
      <p className="font-bold text-lg">{day}</p>
      <img 
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`} 
        alt="weather icon" 
        className="w-16 h-16"
      />
      <div className="flex gap-2 font-semibold">
        <p>{Math.round(max)}{tempUnit}</p>
        <p className="text-white/60">{Math.round(min)}{tempUnit}</p>
      </div>
    </div>
  );
};

export const Forecast: React.FC<ForecastProps> = ({ data, unit }) => {
  const processedData = useMemo(() => processForecastData(data), [data]);

  return (
    <section aria-labelledby="forecast-heading" className="bg-black/20 p-6 rounded-2xl shadow-lg backdrop-blur-md border border-white/10">
      <h2 id="forecast-heading" className="text-xl font-bold mb-4">3-Day Forecast</h2>
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {processedData.map(day => (
          <ForecastItem 
            key={day.date}
            day={day.day}
            icon={day.icon}
            min={day.temp_min}
            max={day.temp_max}
            unit={unit}
          />
        ))}
      </div>
    </section>
  );
};
