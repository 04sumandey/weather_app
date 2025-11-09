
import React from 'react';
import { WeatherData, Unit } from '../types';
import { formatTime } from '../utils/weatherUtils';
import { ThermometerIcon, WindIcon, DropletIcon, SunriseIcon, SunsetIcon } from './icons/WeatherIcons';

interface WeatherCardProps {
  data: WeatherData;
  unit: Unit;
}

const InfoPill: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex flex-col items-center justify-center bg-white/10 p-4 rounded-xl text-center backdrop-blur-sm">
        <div className="flex items-center gap-2 text-sm text-white/80">
            {icon}
            <span>{label}</span>
        </div>
        <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
);

export const WeatherCard: React.FC<WeatherCardProps> = ({ data, unit }) => {
  const { name, main, weather, wind, sys, timezone } = data;
  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const windSpeedUnit = unit === 'metric' ? 'm/s' : 'mph';

  return (
    <section aria-labelledby="current-weather-heading" className="bg-black/20 p-6 rounded-2xl shadow-lg backdrop-blur-md border border-white/10">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex-1">
          <h2 id="current-weather-heading" className="text-3xl font-bold">{name}, {sys.country}</h2>
          <p className="text-lg text-white/80 capitalize">{weather[0].description}</p>
          <div className="flex items-start mt-4">
            <p className="text-7xl font-extrabold tracking-tighter">{Math.round(main.temp)}</p>
            <span className="text-3xl font-semibold mt-2">{tempUnit}</span>
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end">
            <img 
                src={`https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`} 
                alt={weather[0].description} 
                className="w-32 h-32 -mt-8 -mr-4"
            />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <InfoPill 
            icon={<ThermometerIcon />}
            label="Feels Like"
            value={`${Math.round(main.feels_like)}${tempUnit}`}
          />
          <InfoPill 
            icon={<WindIcon />}
            label="Wind"
            value={`${wind.speed.toFixed(1)} ${windSpeedUnit}`}
          />
          <InfoPill 
            icon={<DropletIcon />}
            label="Humidity"
            value={`${main.humidity}%`}
          />
          <InfoPill 
            icon={<SunriseIcon />}
            label="Sunrise"
            value={formatTime(sys.sunrise, timezone)}
          />
          <InfoPill 
            icon={<SunsetIcon />}
            label="Sunset"
            value={formatTime(sys.sunset, timezone)}
          />
      </div>
    </section>
  );
};
