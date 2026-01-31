# WeatherSphere

A modern, professional weather dashboard built with React, TypeScript, and shadcn/ui components.

## Features

- 🌡️ **Real-time Weather Data** - Current temperature, humidity, wind speed, and more
- 📅 **5-Day Forecast** - Daily predictions with high/low temperatures
- 🌐 **City Search** - Find weather for any location worldwide
- 📍 **Geolocation Support** - Get weather for your current location
- 🔄 **Unit Conversion** - Toggle between Celsius and Fahrenheit
- 📱 **Fully Responsive** - Optimized for all device sizes
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- ✨ **Smooth Animations** - Powered by Framer Motion

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API**: OpenWeatherMap

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-app-pro
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_WEATHER_API_KEY=your_api_key_here
```

Get your free API key from [OpenWeatherMap](https://openweathermap.org/api).

4. Run the development server:
```bash
pnpm dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
pnpm build
```

The built files will be in the `dist` directory.

## Project Structure

```
weather-app-pro/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AnimatedCurrentWeather.tsx
│   │   ├── AnimatedForecastCard.tsx
│   │   ├── AnimatedWeatherForecast.tsx
│   │   ├── CurrentWeather.tsx
│   │   ├── ForecastCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── UnitToggle.tsx
│   │   ├── WeatherIcon.tsx
│   │   └── WeatherSkeleton.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useWeather.ts
│   ├── services/           # API services
│   │   └── weatherService.ts
│   ├── types/              # TypeScript types
│   │   └── weather.ts
│   ├── lib/                # Utility functions
│   │   └── utils.ts
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── .env                    # Environment variables
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Usage

1. **Search for a city**: Use the search bar to find weather data for any city worldwide
2. **View current weather**: See real-time temperature, conditions, and detailed metrics
3. **Check 5-day forecast**: Scroll down to see the weather forecast for the next 5 days
4. **Toggle units**: Switch between Celsius (°C) and Fahrenheit (°F) using the unit toggle buttons

## Customization

### Theme Colors

Modify the color scheme in `src/index.css` by updating the CSS variables in the `:root` selector.

### Weather Icons

The app uses Lucide React icons. You can customize the weather icon mapping in `src/components/WeatherIcon.tsx`.

### API Configuration

Change the default city or API behavior in `src/services/weatherService.ts`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
