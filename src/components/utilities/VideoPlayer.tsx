import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { toast } from "sonner";

const VideoPlayer = () => {
  const [playlist, setPlaylist] = useState<File[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPlaylist(files);
    if (files.length > 0) {
      toast.success(`${files.length} video(s) added`);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <input
          type="file"
          accept="video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="video-upload"
        />
        <label htmlFor="video-upload">
          <Button className="bg-gradient-primary hover:opacity-90" asChild>
            <span>Select Video Files</span>
          </Button>
        </label>
      </div>

      {playlist.length > 0 && (
        <>
          <div className="space-y-4">
            <video
              ref={videoRef}
              src={playlist[currentIndex] ? URL.createObjectURL(playlist[currentIndex]) : ""}
              className="w-full rounded-lg bg-black"
              controls
              onEnded={playNext}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            <div className="text-center">
              <h3 className="text-lg font-bold text-foreground">{playlist[currentIndex]?.name}</h3>
              <p className="text-sm text-muted-foreground">
                Video {currentIndex + 1} of {playlist.length}
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={playPrevious} variant="outline" size="lg" disabled={currentIndex === 0}>
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button onClick={togglePlay} className="bg-gradient-primary hover:opacity-90" size="lg">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button
                onClick={playNext}
                variant="outline"
                size="lg"
                disabled={currentIndex === playlist.length - 1}
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Playlist</h4>
            <div className="grid gap-2">
              {playlist.map((file, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    index === currentIndex
                      ? "bg-primary/20 border border-primary/50"
                      : "bg-muted/30 hover:bg-muted/50"
                  }`}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsPlaying(true);
                  }}
                >
                  <p className="text-sm text-foreground">{file.name}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
