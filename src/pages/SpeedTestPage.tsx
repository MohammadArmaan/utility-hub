import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SpeedTest from "@/components/utilities/SpeedTest";
import { Wifi } from "lucide-react";

const SpeedTestPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wifi className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Internet Speed Test</CardTitle>
            </div>
            <CardDescription>Check your download and upload speeds</CardDescription>
          </CardHeader>
          <CardContent>
            <SpeedTest />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SpeedTestPage;
