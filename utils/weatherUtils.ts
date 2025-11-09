
import { ForecastData, ProcessedForecast } from "../types";

export const processForecastData = (forecastData: ForecastData): ProcessedForecast[] => {
    const dailyData: { [key: string]: { temps: number[], icons: string[], day: string } } = {};

    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateString = date.toISOString().split('T')[0];
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const itemDate = new Date(date);
        itemDate.setHours(0, 0, 0, 0);

        if (itemDate <= today) {
            return; // Skip today's data
        }

        if (!dailyData[dateString]) {
            dailyData[dateString] = {
                temps: [],
                icons: [],
                day: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
            };
        }
        dailyData[dateString].temps.push(item.main.temp);
        dailyData[dateString].icons.push(item.weather[0].icon);
    });

    return Object.keys(dailyData).map(date => {
        const dayData = dailyData[date];
        const temp_min = Math.min(...dayData.temps);
        const temp_max = Math.max(...dayData.temps);
        
        // Find the most frequent icon for the day
        const iconCounts = dayData.icons.reduce((acc, icon) => {
            acc[icon] = (acc[icon] || 0) + 1;
            return acc;
        }, {} as {[key: string]: number});

        const mostFrequentIcon = Object.keys(iconCounts).reduce((a, b) => iconCounts[a] > iconCounts[b] ? a : b);

        return {
            date,
            day: dayData.day,
            icon: mostFrequentIcon,
            temp_min,
            temp_max,
        };
    }).slice(0, 3); // Return only the next 3 days
};

export const formatTime = (timestamp: number, timezone: number): string => {
    const date = new Date((timestamp + timezone) * 1000);
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: 'UTC',
    }).format(date);
};
