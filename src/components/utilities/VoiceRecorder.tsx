import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Square, Download, Play, Pause, Trash2 } from "lucide-react";
import { toast } from "sonner";

const VoiceRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioURL, setAudioURL] = useState<string>("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState<string>("0:00");
    const [currentTime, setCurrentTime] = useState<string>("0:00");
    const [recordingTime, setRecordingTime] = useState<number>(0);
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Clean up audio URL on unmount
    useEffect(() => {
        return () => {
            if (audioURL) {
                URL.revokeObjectURL(audioURL);
            }
        };
    }, [audioURL]);

    // Format time helper
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    /** START RECORDING */
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            // Try to use audio/webm;codecs=opus for better quality
            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : 'audio/webm';

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: mimeType,
            });

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, {
                    type: mimeType,
                });
                setAudioBlob(blob);
                const url = URL.createObjectURL(blob);
                setAudioURL(url);
                
                // Stop all tracks
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            
            // Start recording timer
            recordingIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
            
            toast.success("Recording started");
        } catch (e) {
            toast.error("Microphone permission denied");
            console.error(e);
        }
    };

    /** STOP RECORDING */
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            
            // Clear recording timer
            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
                recordingIntervalRef.current = null;
            }
            
            toast.success("Recording stopped");
        }
    };

    /** PLAY/PAUSE AUDIO */
    const togglePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    /** DOWNLOAD AUDIO */
    const downloadAudio = () => {
        if (!audioBlob) {
            toast.error("No recording found");
            return;
        }

        const url = URL.createObjectURL(audioBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `voice-recording-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success("Recording downloaded!");
    };

    /** DELETE RECORDING */
    const deleteRecording = () => {
        if (audioURL) {
            URL.revokeObjectURL(audioURL);
        }
        setAudioBlob(null);
        setAudioURL("");
        setIsPlaying(false);
        setDuration("0:00");
        setCurrentTime("0:00");
        toast.success("Recording deleted");
    };

    // Update audio time
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(formatTime(audioRef.current.currentTime));
        }
    };

    // Set duration when audio loads
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(formatTime(audioRef.current.duration));
        }
    };

    // Handle audio end
    const handleAudioEnd = () => {
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            setCurrentTime("0:00");
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">
                Voice Recorder
            </h3>

            <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6 space-y-4">
                    {/* Recording Status */}
                    <div className="text-center py-4">
                        {isRecording ? (
                            <div className="space-y-2">
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    <p className="text-red-500 font-medium">Recording...</p>
                                </div>
                                <p className="text-2xl font-bold text-foreground">
                                    {formatTime(recordingTime)}
                                </p>
                            </div>
                        ) : audioBlob ? (
                            <div className="space-y-2">
                                <p className="text-green-500 font-medium">
                                    ✓ Recording completed
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Duration: {duration}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-muted-foreground">No recording yet</p>
                                <p className="text-xs text-muted-foreground">
                                    Click the button below to start recording
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Audio Preview Player */}
                    {audioURL && !isRecording && (
                        <Card className="bg-muted/50 border-border/50">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>{currentTime}</span>
                                    <span>{duration}</span>
                                </div>
                                
                                {/* Audio Element */}
                                <audio
                                    ref={audioRef}
                                    src={audioURL}
                                    onTimeUpdate={handleTimeUpdate}
                                    onLoadedMetadata={handleLoadedMetadata}
                                    onEnded={handleAudioEnd}
                                    className="w-full"
                                    controls
                                />

                                {/* Custom Play/Pause Button */}
                                <div className="flex gap-2">
                                    <Button
                                        onClick={togglePlayPause}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        {isPlaying ? (
                                            <>
                                                <Pause className="w-4 h-4 mr-2" />
                                                Pause
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-4 h-4 mr-2" />
                                                Play
                                            </>
                                        )}
                                    </Button>
                                    
                                    <Button
                                        onClick={deleteRecording}
                                        variant="outline"
                                        className="text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Record/Stop Button */}
                    {!isRecording ? (
                        <Button
                            className="w-full bg-primary hover:opacity-90 h-12"
                            onClick={startRecording}
                            disabled={isRecording}
                        >
                            <Mic className="w-5 h-5 mr-2" /> Start Recording
                        </Button>
                    ) : (
                        <Button
                            className="w-full bg-red-600 hover:bg-red-700 h-12"
                            onClick={stopRecording}
                        >
                            <Square className="w-5 h-5 mr-2" /> Stop Recording
                        </Button>
                    )}

                    {/* Download Button */}
                    {audioBlob && !isRecording && (
                        <Button
                            onClick={downloadAudio}
                            variant="outline"
                            className="w-full border-primary/50 hover:bg-primary/10"
                        >
                            <Download className="w-4 h-4 mr-2" /> Download Recording
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="p-4 bg-muted/30 border-border/50">
                <p className="text-xs text-muted-foreground text-center">
                    💡 Recordings are saved in WebM format with high-quality audio. 
                    The audio player allows you to preview before downloading.
                </p>
            </Card>
        </div>
    );
};

export default VoiceRecorder;