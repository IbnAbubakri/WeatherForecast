export interface WeatherData {
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  clouds: {
    all: number; // Cloud cover percentage
  };
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  dt: number;
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
  timezone: number;
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
      feels_like?: number;
      pressure?: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
      deg?: number;
    };
    clouds?: {
      all: number;
    };
    rain?: {
      '1h'?: number;
      '3h'?: number;
    };
    snow?: {
      '1h'?: number;
      '3h'?: number;
    };
    pop: number; // Probability of precipitation (0-1)
  }>;
  city: {
    name: string;
    country: string;
  };
}

export interface HourlyForecast {
  time: Date;
  temp: number;
  feels_like: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  clouds: number;
  pressure: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  };
  pop: number;
}

export interface ExtendedWeatherData {
  uvIndex?: number;
  aqi?: number;
  moonPhase?: string;
  moonIllumination?: number;
}

export type TemperatureUnit = 'metric' | 'imperial';

export interface WeatherState {
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  loading: boolean;
  error: string | null;
  unit: TemperatureUnit;
}

export interface DailyForecast {
  date: Date;
  temp: {
    min: number;
    max: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  };
  humidity: number;
  windSpeed: number;
  precipitation: number; // mm of rain/snow
  pop: number; // Probability of precipitation (0-100)
}
