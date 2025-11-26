import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageConverter from "@/components/utilities/ImageConverter";
import { ImageIcon } from "lucide-react";

const ImageConverterPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <ImageIcon className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Image Converter</CardTitle>
            </div>
            <CardDescription>Convert images between PNG, JPEG, and WebP</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageConverter />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ImageConverterPage;
