import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city) {
      toast.error("Please enter a city name");
      return;
    }

    setLoading(true);
    try {
      // Using Open-Meteo API (free, no API key needed)
      const geocodeResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );
      const geocodeData = await geocodeResponse.json();

      if (!geocodeData.results || geocodeData.results.length === 0) {
        toast.error("City not found");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geocodeData.results[0];

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto&forecast_days=15`
      );
      const data = await weatherResponse.json();

      setWeatherData({ ...data, city: name, country });
      toast.success("Weather data loaded!");
    } catch (error) {
      toast.error("Failed to fetch weather data");
    }
    setLoading(false);
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return "Clear sky";
    if (code <= 3) return "Partly cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 67) return "Rainy";
    if (code <= 77) return "Snowy";
    return "Stormy";
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          className="bg-muted/50"
        />
        <Button onClick={fetchWeather} disabled={loading} className="bg-gradient-primary hover:opacity-90">
          {loading ? "Loading..." : "Search"}
        </Button>
      </div>

      {weatherData && (
        <div className="space-y-4">
          <Card className="p-4 bg-gradient-card border-border/50">
            <h2 className="text-2xl font-bold text-foreground">
              {weatherData.city}, {weatherData.country}
            </h2>
            <p className="text-sm text-muted-foreground">15-Day Forecast</p>
          </Card>

          <div className="grid gap-2">
            {weatherData.daily.time.map((date: string, index: number) => (
              <Card key={index} className="p-4 bg-gradient-card border-border/50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-foreground">{new Date(date).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {getWeatherDescription(weatherData.daily.weathercode[index])}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {Math.round(weatherData.daily.temperature_2m_max[index])}°C
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Min: {Math.round(weatherData.daily.temperature_2m_min[index])}°C
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Rain: {weatherData.daily.precipitation_sum[index]}mm
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
