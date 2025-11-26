import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";

const QRCodeGenerator = () => {
  const [text, setText] = useState("https://utility-hub-project.vercel.app");
  const [color, setColor] = useState("#22d3ee");
  const [bgColor, setBgColor] = useState("#1a1f2e");
  const [size, setSize] = useState(256);
  const [logo, setLogo] = useState<string | null>(null);
  const [dotStyle, setDotStyle] = useState<"squares" | "dots" | "rounded">("squares");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogo(event.target?.result as string);
      toast.success("Logo uploaded!");
    };
    reader.readAsDataURL(file);
  };

  const downloadQR = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);

      // Add logo if exists
      if (logo) {
        const logoImg = new Image();
        logoImg.onload = () => {
          const logoSize = size * 0.2;
          const logoX = (size - logoSize) / 2;
          const logoY = (size - logoSize) / 2;
          
          // White background for logo
          ctx.fillStyle = "white";
          ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
          
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
          
          const pngFile = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.download = "qrcode.png";
          downloadLink.href = pngFile;
          downloadLink.click();
          toast.success("QR Code downloaded!");
        };
        logoImg.src = logo;
      } else {
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "qrcode.png";
        downloadLink.href = pngFile;
        downloadLink.click();
        toast.success("QR Code downloaded!");
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="qr-text">Text or URL</Label>
          <Input
            id="qr-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text or URL"
            className="bg-muted/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="qr-color">QR Color</Label>
            <div className="flex gap-2">
              <Input
                id="qr-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-16 h-10 bg-muted/50"
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 bg-muted/50"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="qr-bgcolor">Background</Label>
            <div className="flex gap-2">
              <Input
                id="qr-bgcolor"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-16 h-10 bg-muted/50"
              />
              <Input
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 bg-muted/50"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="qr-size">Size: {size}px</Label>
          <Input
            id="qr-size"
            type="range"
            min="128"
            max="512"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="bg-muted/50"
          />
        </div>

        <div>
          <Label htmlFor="dot-style">Dot Style</Label>
          <Select value={dotStyle} onValueChange={(value: any) => setDotStyle(value)}>
            <SelectTrigger className="bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="squares">Squares</SelectItem>
              <SelectItem value="dots">Dots</SelectItem>
              <SelectItem value="rounded">Rounded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="logo-upload">Logo (Optional)</Label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
            id="logo-upload"
          />
          <label htmlFor="logo-upload">
            <Button 
              variant="outline" 
              className="w-full cursor-pointer border-primary/50 hover:bg-primary/10"
              asChild
            >
              <span>
                <Upload className="w-4 h-4 mr-2" />
                {logo ? "Change Logo" : "Upload Logo"}
              </span>
            </Button>
          </label>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 p-6 bg-muted/30 rounded-lg">
        <div className="relative">
          <QRCodeSVG
            id="qr-code"
            value={text}
            size={Math.min(size, 300)}
            fgColor={color}
            bgColor={bgColor}
            level="H"
            className="animate-float"
            style={{
              borderRadius: dotStyle === "rounded" ? "8px" : "0",
            }}
          />
          {logo && (
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded"
              style={{
                width: `${Math.min(size, 300) * 0.2}px`,
                height: `${Math.min(size, 300) * 0.2}px`,
              }}
            >
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          )}
        </div>
        <Button onClick={downloadQR} className="w-full bg-gradient-primary hover:opacity-90">
          <Download className="w-4 h-4 mr-2" />
          Download QR Code
        </Button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
