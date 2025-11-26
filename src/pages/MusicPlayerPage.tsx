import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MusicPlayer from "@/components/utilities/MusicPlayer";
import { Music } from "lucide-react";

const MusicPlayerPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Music Player</CardTitle>
            </div>
            <CardDescription>Play your music files with playlist support</CardDescription>
          </CardHeader>
          <CardContent>
            <MusicPlayer />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MusicPlayerPage;
