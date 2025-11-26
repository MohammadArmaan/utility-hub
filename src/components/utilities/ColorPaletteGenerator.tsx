import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ColorPaletteGenerator = () => {
  const [colors, setColors] = useState<string[]>([]);

  const generatePalette = () => {
    const newColors = Array.from({ length: 5 }, () => {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    });
    setColors(newColors);
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`Copied ${color} to clipboard!`);
  };

  return (
    <div className="space-y-6">
      <Button onClick={generatePalette} className="w-full bg-gradient-primary hover:opacity-90">
        Generate Palette
      </Button>
      {colors.length > 0 && (
        <div className="grid gap-4">
          {colors.map((color, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-gradient-card"
            >
              <div
                className="w-24 h-24 rounded-lg border-2 border-border"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1">
                <div className="text-lg font-mono font-bold text-foreground">{color}</div>
                <div className="text-sm text-muted-foreground">
                  RGB: {parseInt(color.slice(1, 3), 16)}, {parseInt(color.slice(3, 5), 16)},{" "}
                  {parseInt(color.slice(5, 7), 16)}
                </div>
              </div>
              <Button onClick={() => copyColor(color)} variant="outline">
                Copy
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPaletteGenerator;
