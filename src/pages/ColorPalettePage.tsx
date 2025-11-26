import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ColorPaletteGenerator from "@/components/utilities/ColorPaletteGenerator";
import { Palette } from "lucide-react";

const ColorPalettePage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Color Palette Generator</CardTitle>
            </div>
            <CardDescription>Generate beautiful color palettes</CardDescription>
          </CardHeader>
          <CardContent>
            <ColorPaletteGenerator />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ColorPalettePage;
