import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wifi, Zap } from "lucide-react";
import { toast } from "sonner";

const SpeedTest = () => {
  const [testing, setTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);

  const runSpeedTest = async () => {
    setTesting(true);
    setProgress(0);
    setDownloadSpeed(null);
    setUploadSpeed(null);

    try {
      // Simulate download test
      setProgress(25);
      const startTime = Date.now();
      const response = await fetch('https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=1920', {
        cache: 'no-store'
      });
      await response.blob();
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      const fileSizeMB = 2; // Approximate file size
      const speed = (fileSizeMB / duration) * 8; // Convert to Mbps
      
      setDownloadSpeed(Math.round(speed * 100) / 100);
      setProgress(50);

      // Simulate upload test (using a smaller simulated upload)
      await new Promise(resolve => setTimeout(resolve, 1000));
      const uploadStartTime = Date.now();
      const uploadData = new Blob([new ArrayBuffer(1024 * 1024)]); // 1MB
      await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: uploadData
      });
      const uploadEndTime = Date.now();
      const uploadDuration = (uploadEndTime - uploadStartTime) / 1000;
      const uploadSpeedCalc = (1 / uploadDuration) * 8;
      
      setUploadSpeed(Math.round(uploadSpeedCalc * 100) / 100);
      setProgress(100);

      toast.success("Speed test completed!");
    } catch (error) {
      toast.error("Speed test failed. Please try again.");
      console.error(error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-block p-4 rounded-full bg-primary/10 mb-4 animate-float">
          <Wifi className="w-12 h-12 text-primary" />
        </div>

        {!testing && !downloadSpeed && (
          <Button 
            onClick={runSpeedTest} 
            size="lg"
            className="bg-gradient-primary hover:opacity-90"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Speed Test
          </Button>
        )}

        {testing && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground animate-pulse">Testing your connection...</p>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {downloadSpeed !== null && !testing && (
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-6 bg-gradient-card rounded-lg border border-border/50">
              <div className="text-sm text-muted-foreground mb-2">Download</div>
              <div className="text-3xl font-bold text-primary">{downloadSpeed}</div>
              <div className="text-xs text-muted-foreground">Mbps</div>
            </div>
            <div className="p-6 bg-gradient-card rounded-lg border border-border/50">
              <div className="text-sm text-muted-foreground mb-2">Upload</div>
              <div className="text-3xl font-bold text-secondary">{uploadSpeed}</div>
              <div className="text-xs text-muted-foreground">Mbps</div>
            </div>
          </div>
        )}

        {downloadSpeed !== null && !testing && (
          <Button 
            onClick={runSpeedTest} 
            variant="outline"
            className="mt-4"
          >
            Test Again
          </Button>
        )}
      </div>

      <div className="p-4 bg-muted/30 rounded-lg">
        <p className="text-xs text-muted-foreground">
          ℹ️ Speed test results may vary based on network conditions and server availability.
        </p>
      </div>
    </div>
  );
};

export default SpeedTest;
