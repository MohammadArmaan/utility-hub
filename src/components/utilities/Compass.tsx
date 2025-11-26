import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const Compass = () => {
  const [heading, setHeading] = useState<number>(0);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!window.DeviceOrientationEvent) {
      setSupported(false);
      toast.error("Device orientation not supported on this device");
      return;
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setHeading(360 - event.alpha);
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  if (!supported) {
    return (
      <Card className="p-6 bg-gradient-card border-border/50 text-center">
        <p className="text-muted-foreground">
          Compass is not supported on this device or browser.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-gradient-card border-border/50">
        <div className="relative w-64 h-64 mx-auto">
          <div
            className="absolute inset-0 rounded-full border-8 border-primary/20"
            style={{
              transform: `rotate(${-heading}deg)`,
              transition: "transform 0.3s ease",
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-red-500" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">{Math.round(heading)}°</div>
              <div className="text-sm text-muted-foreground mt-2">
                {heading >= 337.5 || heading < 22.5
                  ? "N"
                  : heading >= 22.5 && heading < 67.5
                  ? "NE"
                  : heading >= 67.5 && heading < 112.5
                  ? "E"
                  : heading >= 112.5 && heading < 157.5
                  ? "SE"
                  : heading >= 157.5 && heading < 202.5
                  ? "S"
                  : heading >= 202.5 && heading < 247.5
                  ? "SW"
                  : heading >= 247.5 && heading < 292.5
                  ? "W"
                  : "NW"}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Compass;
