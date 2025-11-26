import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VideoPlayer from "@/components/utilities/VideoPlayer";
import { Video } from "lucide-react";

const VideoPlayerPage = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Video Player</CardTitle>
            </div>
            <CardDescription>Play your video files with playlist support</CardDescription>
          </CardHeader>
          <CardContent>
            <VideoPlayer />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VideoPlayerPage;
