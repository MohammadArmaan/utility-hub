import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PhotoViewer from "@/components/utilities/PhotoViewer";
import { Image } from "lucide-react";

const PhotoViewerPage = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Image className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Photo Viewer</CardTitle>
            </div>
            <CardDescription>View and browse your photos</CardDescription>
          </CardHeader>
          <CardContent>
            <PhotoViewer />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PhotoViewerPage;
