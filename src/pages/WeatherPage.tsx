import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Weather from "@/components/utilities/Weather";
import { Cloud } from "lucide-react";

const WeatherPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Cloud className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Weather Forecast</CardTitle>
            </div>
            <CardDescription>Get 15-day weather forecasts for any city</CardDescription>
          </CardHeader>
          <CardContent>
            <Weather />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default WeatherPage;
