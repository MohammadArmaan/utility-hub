import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Download, SwitchCamera } from "lucide-react";
import { toast } from "sonner";

const WebcamCapture = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      toast.success("Camera started");
    } catch (error) {
      toast.error("Could not access camera");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      toast.success("Camera stopped");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
        toast.success("Photo captured!");
      }
    }
  };

  const downloadPhoto = () => {
    if (capturedImage) {
      const link = document.createElement("a");
      link.href = capturedImage;
      link.download = `photo-${Date.now()}.png`;
      link.click();
      toast.success("Photo downloaded!");
    }
  };

  const switchCamera = () => {
    stopCamera();
    setFacingMode(facingMode === "user" ? "environment" : "user");
    setTimeout(startCamera, 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center flex-wrap">
        {!stream ? (
          <Button onClick={startCamera} className="bg-gradient-primary hover:opacity-90">
            <Camera className="w-4 h-4 mr-2" />
            Start Camera
          </Button>
        ) : (
          <>
            <Button onClick={stopCamera} variant="outline">
              Stop Camera
            </Button>
            <Button onClick={capturePhoto} className="bg-gradient-primary hover:opacity-90">
              <Camera className="w-4 h-4 mr-2" />
              Capture
            </Button>
            <Button onClick={switchCamera} variant="outline">
              <SwitchCamera className="w-4 h-4 mr-2" />
              Switch
            </Button>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">Camera View</h3>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg bg-black"
            style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
          />
        </div>
        {capturedImage && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Captured Photo</h3>
            <div className="relative">
              <img src={capturedImage} alt="Captured" className="w-full rounded-lg" />
              <Button
                onClick={downloadPhoto}
                className="absolute bottom-2 right-2 bg-gradient-primary hover:opacity-90"
                size="sm"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default WebcamCapture;
