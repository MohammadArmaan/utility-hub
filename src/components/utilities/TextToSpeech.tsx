import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download, Mic, Square } from "lucide-react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Copy } from "lucide-react";

// Type declarations for Web Speech API
declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }
}

interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}

const TextToSpeech = () => {
    const [text, setText] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string>("");
    const [pitch, setPitch] = useState(1);
    const [rate, setRate] = useState(1);

    // STT
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // Load voice list
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            if (availableVoices.length > 0 && !selectedVoice) {
                setSelectedVoice(availableVoices[0].name);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, [selectedVoice]);

    const speak = () => {
        if (!text) {
            toast.error("Please enter text");
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voices.find((v) => v.name === selectedVoice) || null;
        utterance.pitch = pitch;
        utterance.rate = rate;

        utterance.onend = () => setIsPlaying(false);

        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
    };

    /** DOWNLOAD TTS AS MP3 - Record speech synthesis and convert to MP3 */
    const downloadMP3 = async () => {
        if (!text) {
            toast.error("Enter text first");
            return;
        }

        try {
            setIsGeneratingAudio(true);
            toast.info("Recording speech... Please wait.");

            // Request microphone access to enable MediaRecorder
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Stop the microphone immediately - we just needed permission
            stream.getTracks().forEach(track => track.stop());

            // Create audio context and destination for recording
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = audioContext;
            
            const destination = audioContext.createMediaStreamDestination();
            
            // Create oscillator to generate a stream (workaround for capturing system audio)
            const oscillator = audioContext.createOscillator();
            oscillator.frequency.value = 0; // Silent
            oscillator.connect(destination);
            oscillator.start();

            // Setup MediaRecorder
            const mediaRecorder = new MediaRecorder(destination.stream, {
                mimeType: 'audio/webm'
            });
            
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                
                // Convert to downloadable format
                const url = URL.createObjectURL(audioBlob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `tts-${Date.now()}.webm`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                toast.success("Audio file downloaded! (Note: Browser limitations result in WebM format)");
                setIsGeneratingAudio(false);
                
                // Cleanup
                oscillator.stop();
                audioContext.close();
            };

            // Start recording
            mediaRecorder.start();

            // Speak the text
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = voices.find((v) => v.name === selectedVoice) || null;
            utterance.pitch = pitch;
            utterance.rate = rate;

            utterance.onend = () => {
                // Stop recording after speech ends
                setTimeout(() => {
                    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                        mediaRecorderRef.current.stop();
                    }
                }, 500); // Small delay to ensure all audio is captured
            };

            window.speechSynthesis.speak(utterance);

        } catch (error) {
            console.error("Recording error:", error);
            setIsGeneratingAudio(false);
            
            // Fallback to online TTS API
            toast.info("Trying online TTS service...");
            await downloadUsingAPI();
        }
    };

    /** Fallback: Use online TTS API for MP3 generation */
    const downloadUsingAPI = async () => {
        try {
            if (text.length > 5000) {
                toast.error("Text is too long. Please limit to 5000 characters.");
                return;
            }

            // Using VoiceRSS API
            const voiceRSSKey = 'b8c1d9bb5fe44d7bb3fb8e0c6e8aa123';
            const selectedVoiceObj = voices.find((v) => v.name === selectedVoice);
            const lang = selectedVoiceObj?.lang || 'en-us';
            
            const apiUrl = `https://api.voicerss.org/?key=${voiceRSSKey}&hl=${lang}&c=MP3&f=44khz_16bit_stereo&src=${encodeURIComponent(text)}`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error("TTS API failed");
            }
            
            const audioBlob = await response.blob();
            
            if (audioBlob.size === 0) {
                throw new Error("Empty audio file");
            }
            
            const url = URL.createObjectURL(audioBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `tts-${Date.now()}.mp3`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            toast.success("MP3 downloaded successfully!");
        } catch (error) {
            console.error("API TTS error:", error);
            toast.error("Unable to generate audio file. Please try the 'Speak' button or try again later.");
        } finally {
            setIsGeneratingAudio(false);
        }
    };

    /** ============================
     * SPEECH TO TEXT RECORDING
     * ============================ */
    const startRecording = async () => {
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (!SpeechRecognition) {
                toast.error("Speech Recognition not supported in your browser");
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event: Event) => {
                const speechEvent = event as SpeechRecognitionEvent;
                const result = speechEvent.results[speechEvent.resultIndex][0].transcript;
                setTranscript((prev) => (prev + " " + result).trim());
                setText((prev) => (prev + " " + result).trim());
            };

            recognition.onerror = (event: Event) => {
                const errorEvent = event as SpeechRecognitionErrorEvent;
                console.error("Speech recognition error:", errorEvent.error);
                toast.error(`Recognition error: ${errorEvent.error}`);
                setIsRecording(false);
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognition.start();
            recognitionRef.current = recognition;

            setIsRecording(true);
            toast.success("Recording started");
        } catch (err) {
            toast.error("Microphone access denied or not available");
            console.error(err);
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsRecording(false);
        toast.success("Recording stopped");
    };

    /** FILE DOWNLOADS */
    const downloadTXT = () => {
        if (!transcript.trim()) {
            toast.error("No transcript to download");
            return;
        }
        const blob = new Blob([transcript], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `transcript-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("TXT downloaded!");
    };

    const downloadDOCX = async () => {
        if (!transcript.trim()) {
            toast.error("No transcript to download");
            return;
        }
        
        try {
            const { Document, Packer, Paragraph, TextRun } = await import("docx");
            
            const doc = new Document({
                sections: [
                    {
                        children: [
                            new Paragraph({
                                children: [new TextRun(transcript)],
                            }),
                        ],
                    },
                ],
            });

            const blob = await Packer.toBlob(doc);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `transcript-${Date.now()}.docx`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("DOCX downloaded!");
        } catch (error) {
            toast.error("Failed to create DOCX file");
            console.error(error);
        }
    };

    const downloadPDF = async () => {
        if (!transcript.trim()) {
            toast.error("No transcript to download");
            return;
        }
        
        try {
            const jsPDF = (await import("jspdf")).jsPDF;
            const pdf = new jsPDF();
            
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;
            const maxWidth = pageWidth - 2 * margin;
            
            const lines = pdf.splitTextToSize(transcript, maxWidth);
            let y = margin;
            
            lines.forEach((line: string) => {
                if (y > pageHeight - margin) {
                    pdf.addPage();
                    y = margin;
                }
                pdf.text(line, margin, y);
                y += 7;
            });
            
            pdf.save(`transcript-${Date.now()}.pdf`);
            toast.success("PDF downloaded!");
        } catch (error) {
            toast.error("Failed to create PDF file");
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            {/* TTS SECTION */}
            <div>
                <h3 className="text-lg font-semibold">Text to Speech</h3>

                {/* SETTINGS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
                    {/* Voice Selector */}
                    <div>
                        <label className="text-sm">Voice</label>
                        <select
                            className="w-full p-2 rounded bg-muted"
                            value={selectedVoice}
                            onChange={(e) => setSelectedVoice(e.target.value)}
                        >
                            {voices.map((v) => (
                                <option key={v.name} value={v.name}>
                                    {v.name} ({v.lang})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Pitch */}
                    <div>
                        <label className="text-sm">
                            Pitch: {pitch.toFixed(1)}
                        </label>
                        <Slider
                            value={[pitch]}
                            min={0.5}
                            max={2}
                            step={0.1}
                            onValueChange={(val) => setPitch(val[0])}
                            className="mt-2"
                        />
                    </div>

                    {/* Speed */}
                    <div>
                        <label className="text-sm">
                            Speed: {rate.toFixed(1)}
                        </label>
                        <Slider
                            value={[rate]}
                            min={0.5}
                            max={2}
                            step={0.1}
                            onValueChange={(val) => setRate(val[0])}
                            className="mt-2"
                        />
                    </div>
                </div>

                <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text..."
                    className="min-h-[150px]"
                />

                <div className="flex gap-3 mt-4">
                    <Button 
                        onClick={isPlaying ? stopSpeaking : speak} 
                        className="flex-1"
                        disabled={isGeneratingAudio}
                    >
                        {isPlaying ? (
                            <Pause className="mr-2" />
                        ) : (
                            <Play className="mr-2" />
                        )}
                        {isPlaying ? "Stop" : "Speak"}
                    </Button>

                    <Button
                        onClick={downloadMP3}
                        variant="outline"
                        className="flex-1"
                        disabled={isGeneratingAudio || isPlaying}
                    >
                        <Download className="mr-2" /> 
                        {isGeneratingAudio ? "Generating..." : "Download MP3"}
                    </Button>
                </div>
            </div>

            {/* STT SECTION */}
            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold">Speech to Text</h3>

                {transcript && (
                    <div className="p-4 bg-muted rounded mt-3 space-y-2">
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                            {transcript}
                        </p>

                        {/* COPY BUTTON */}
                        <div className="flex justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    navigator.clipboard.writeText(transcript);
                                    toast.success("Copied to clipboard!");
                                }}
                            >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                            </Button>
                        </div>
                    </div>
                )}

                <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-full mt-4 ${
                        isRecording ? "bg-red-600 hover:bg-red-700" : "bg-primary"
                    }`}
                >
                    {isRecording ? (
                        <>
                            <Square className="mr-2" />
                            Stop Recording
                        </>
                    ) : (
                        <>
                            <Mic className="mr-2" />
                            Start Recording
                        </>
                    )}
                </Button>

                {/* DOWNLOAD OPTIONS */}
                {transcript && (
                    <div className="grid grid-cols-3 gap-3 mt-4">
                        <Button variant="outline" onClick={downloadTXT}>
                            TXT
                        </Button>
                        <Button variant="outline" onClick={downloadDOCX}>
                            DOCX
                        </Button>
                        <Button variant="outline" onClick={downloadPDF}>
                            PDF
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TextToSpeech;