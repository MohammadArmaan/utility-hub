import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Location from "@/components/utilities/Location";
import { MapPin } from "lucide-react";

const LocationPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Location Finder</CardTitle>
            </div>
            <CardDescription>Get your current GPS coordinates</CardDescription>
          </CardHeader>
          <CardContent>
            <Location />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LocationPage;
