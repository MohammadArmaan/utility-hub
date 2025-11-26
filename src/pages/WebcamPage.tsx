import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WebcamCapture from "@/components/utilities/WebcamCapture";
import { Camera } from "lucide-react";

const WebcamPage = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Camera className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Webcam Capture</CardTitle>
            </div>
            <CardDescription>Capture photos using your device camera</CardDescription>
          </CardHeader>
          <CardContent>
            <WebcamCapture />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default WebcamPage;
