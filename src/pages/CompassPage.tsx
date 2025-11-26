import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Compass from "@/components/utilities/Compass";
import { Compass as CompassIcon } from "lucide-react";

const CompassPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <CompassIcon className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Compass</CardTitle>
            </div>
            <CardDescription>Find your direction using device orientation</CardDescription>
          </CardHeader>
          <CardContent>
            <Compass />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CompassPage;
