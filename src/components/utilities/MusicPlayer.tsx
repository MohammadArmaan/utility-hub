import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { toast } from "sonner";

const MusicPlayer = () => {
  const [playlist, setPlaylist] = useState<File[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPlaylist(files);
    if (files.length > 0) {
      toast.success(`${files.length} track(s) added`);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
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
          accept="audio/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="music-upload"
        />
        <label htmlFor="music-upload">
          <Button className="bg-gradient-primary hover:opacity-90" asChild>
            <span>Select Music Files</span>
          </Button>
        </label>
      </div>

      {playlist.length > 0 && (
        <>
          <div className="text-center space-y-4">
            <div className="p-6 bg-gradient-card rounded-lg border border-border/50">
              <h3 className="text-xl font-bold text-foreground mb-2">
                {playlist[currentIndex]?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Track {currentIndex + 1} of {playlist.length}
              </p>
            </div>

            <audio
              ref={audioRef}
              src={playlist[currentIndex] ? URL.createObjectURL(playlist[currentIndex]) : ""}
              onEnded={playNext}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

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
            <div className="space-y-1">
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

export default MusicPlayer;
