import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) {
      toast.error("Please enter a city name");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Geocoding
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=1&language=en&format=json`
      );
      const geo = await geoRes.json();

      if (!geo.results || geo.results.length === 0) {
        toast.error("City not found");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geo.results[0];

      // Step 2: Get 24-hour + 15-day weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode,precipitation,relativehumidity_2m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=16`
      );
      const data = await weatherRes.json();

      setWeather({
        ...data,
        city: name,
        country,
      });

      toast.success("Weather loaded!");
    } catch {
      toast.error("Failed to load weather");
    }

    setLoading(false);
  };

  const getWeatherDetails = (code: number) => {
    if (code === 0) return { text: "Clear Sky", emoji: "☀️" };
    if ([1, 2].includes(code)) return { text: "Partly Cloudy", emoji: "🌤️" };
    if (code === 3) return { text: "Cloudy", emoji: "☁️" };
    if (code <= 48) return { text: "Foggy", emoji: "🌫️" };
    if (code <= 55) return { text: "Light Rain", emoji: "🌦️" };
    if (code <= 67) return { text: "Rain", emoji: "🌧️" };
    if (code <= 77) return { text: "Snow", emoji: "❄️" };
    if (code <= 82) return { text: "Heavy Rain", emoji: "⛈️" };
    if (code <= 86) return { text: "Snowfall", emoji: "🌨️" };
    if (code <= 99) return { text: "Thunderstorm", emoji: "🌩️" };

    return { text: "Unknown", emoji: "🌍" };
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          className="bg-muted/50"
        />
        <Button
          onClick={fetchWeather}
          disabled={loading}
          className="bg-gradient-primary hover:opacity-90"
        >
          {loading ? "Loading..." : "Search"}
        </Button>
      </div>

      {/* Weather Content */}
      {weather && (
        <div className="space-y-6">
          {/* Location Header */}
          <Card className="p-4 bg-gradient-card border-border/50">
            <h2 className="text-2xl font-bold text-foreground">
              {weather.city}, {weather.country}
            </h2>
            <p className="text-sm text-muted-foreground">24-Hour + 15-Day Forecast</p>
          </Card>

          {/* Hourly Forecast */}
          <h3 className="text-lg font-semibold text-foreground">Next 24 Hours</h3>

          <div className="flex overflow-x-auto gap-3 pb-2 scroll-smooth">
            {weather.hourly.time.slice(0, 24).map((t: string, index: number) => {
              const hour = new Date(t).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              const temp = weather.hourly.temperature_2m[index];
              const rain = weather.hourly.precipitation[index];
              const humidity = weather.hourly.relativehumidity_2m[index];
              const w = getWeatherDetails(weather.hourly.weathercode[index]);

              return (
                <Card
                  key={index}
                  className="min-w-[140px] p-4 bg-gradient-card border-border/50 flex flex-col items-center rounded-xl shadow-sm hover:bg-accent/10 transition"
                >
                  <p className="font-bold text-primary">{hour}</p>
                  <div className="text-4xl my-2">{w.emoji}</div>
                  <p className="font-semibold text-lg text-foreground">
                    {Math.round(temp)}°C
                  </p>
                  <p className="text-xs text-muted-foreground">{w.text}</p>
                  <div className="mt-2 text-center text-xs text-muted-foreground">
                    🌧️ Rain: {rain}mm <br />
                    💧 Humidity: {humidity}%
                  </div>
                </Card>
              );
            })}
          </div>

          {/* 15-Day Forecast */}
          <h3 className="text-lg font-semibold text-foreground">Next 15 Days</h3>

          <div className="grid md:grid-cols-3 gap-3">
            {weather.daily.time.slice(1).map((date: string, idx: number) => {
              const w = getWeatherDetails(weather.daily.weathercode[idx]);
              const max = weather.daily.temperature_2m_max[idx];
              const min = weather.daily.temperature_2m_min[idx];
              const rain = weather.daily.precipitation_sum[idx];

              return (
                <Card
                  key={idx}
                  className="p-4 bg-gradient-card border-border/50 rounded-xl hover:bg-accent/10 transition"
                >
                  <p className="font-bold text-foreground">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>

                  <div className="text-5xl my-2">{w.emoji}</div>

                  <p className="text-sm text-muted-foreground mb-1">{w.text}</p>

                  <p className="text-primary font-semibold">
                    {Math.round(max)}°C / {Math.round(min)}°C
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    🌧️ Rain: {rain}mm
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
