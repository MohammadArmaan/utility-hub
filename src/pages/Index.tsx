import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import NavigationCard from "@/components/NavigationCard";
import { Input } from "@/components/ui/input";
import {
    QrCode,
    FileDown,
    Clock,
    Wifi,
    Lock,
    ArrowLeftRight,
    DollarSign,
    Calculator,
    CalendarDays,
    TrendingUp,
    Braces,
    Compass,
    FileText,
    Palette,
    Binary,
    Music,
    Video,
    Image,
    Camera,
    Archive,
    FileArchive,
    ImageIcon,
    Cloud,
    MapPin,
    Volume2,
    Home,
    Trophy,
    Search,
    Mic,
    ChartArea,
} from "lucide-react";

const Index = () => {
    const [searchQuery, setSearchQuery] = useState("");

    /* --------------------------
     Categorized utilities list
     -------------------------- */
    const { fileTools, productivityTools, mediaDeviceTools } = useMemo(() => {
        const all = [
            {
                title: "Base64 Encoder/Decoder",
                description: "Encode and decode Base64 strings",
                icon: Binary,
                to: "/base64",
                category: "file",
            },
            {
                title: "File Compressor",
                description: "Compress PDF, Word, PPT files and images",
                icon: FileArchive,
                to: "/file-compressor",
                category: "file",
            },
            {
                title: "PDF Converter",
                description: "Convert text and images to PDF format instantly",
                icon: FileDown,
                to: "/pdf-converter",
                category: "file",
            },
            {
                title: "Image Converter",
                description: "Convert images between different formats",
                icon: ImageIcon,
                to: "/image-converter",
                category: "file",
            },
            {
                title: "ZIP Converter",
                description: "Create and extract ZIP archives",
                icon: Archive,
                to: "/zip-converter",
                category: "file",
            },

            {
                title: "Calculator",
                description: "Perform basic arithmetic calculations",
                icon: Calculator,
                to: "/calculator",
                category: "productivity",
            },
            {
                title: "Calendar",
                description: "View and select dates",
                icon: CalendarDays,
                to: "/calendar",
                category: "productivity",
            },
            {
                title: "JSON Formatter",
                description: "Format validate and convert JSON data",
                icon: Braces,
                to: "/json-formatter",
                category: "productivity",
            },
            {
                title: "Markdown Converter",
                description: "Convert Markdown to HTML",
                icon: FileText,
                to: "/markdown-converter",
                category: "productivity",
            },
            {
                title: "Home Loan Calculator",
                description: "Calculate home loan EMI and payment details",
                icon: Home,
                to: "/home-loan",
                category: "productivity",
            },
            {
                title: "Interest Calculator",
                description:
                    "Calculate intrest growth for simple and compound interest",
                icon: TrendingUp,
                to: "/compound-interest",
                category: "productivity",
            },
            {
                title: "Currency Converter",
                description:
                    "Convert between different currencies with live rates",
                icon: DollarSign,
                to: "/currency-converter",
                category: "productivity",
            },
            {
                title: "Unit Converter",
                description: "Convert between different units of measurement",
                icon: ArrowLeftRight,
                to: "/unit-converter",
                category: "productivity",
            },
            {
                title: "Password Generator",
                description: "Create strong, secure passwords instantly",
                icon: Lock,
                to: "/password-generator",
                category: "productivity",
            },
            {
                title: "QR Code Generator",
                description:
                    "Create custom QR codes with your colors and design",
                icon: QrCode,
                to: "/qr-code",
                category: "productivity",
            },
            {
                title: "Chart Maker",
                description:
                    "Create stunning charts for your analysis",
                icon: ChartArea,
                to: "/chart-maker",
                category: "productivity",
            },

            {
                title: "Music Player",
                description: "Play audio files with playlist support",
                icon: Music,
                to: "/music-player",
                category: "media",
            },
            {
                title: "Video Player",
                description: "Play video files with playlist support",
                icon: Video,
                to: "/video-player",
                category: "media",
            },
            {
                title: "Photo Viewer",
                description: "View and manage your photo collections",
                icon: Image,
                to: "/photo-viewer",
                category: "media",
            },
            {
                title: "Voice Recorder",
                description: "Record your Voice",
                icon: Mic,
                to: "/voice-recorder",
                category: "media",
            },
            {
                title: "Text to Speech",
                description: "Convert text to speech and speech to text",
                icon: Volume2,
                to: "/text-to-speech",
                category: "media",
            },
            {
                title: "Timer & Stopwatch",
                description: "Track time with precision for any task",
                icon: Clock,
                to: "/timer-stopwatch",
                category: "media",
            },

            {
                title: "Location Finder",
                description: "Get your current GPS coordinates",
                icon: MapPin,
                to: "/location",
                category: "device",
            },
            {
                title: "Webcam Capture",
                description: "Capture photos using your device camera",
                icon: Camera,
                to: "/webcam",
                category: "device",
            },
            {
                title: "Internet Speed Test",
                description: "Check your download and upload speeds",
                icon: Wifi,
                to: "/speed-test",
                category: "device",
            },
            {
                title: "Compass",
                description: "Digital compass using device orientation",
                icon: Compass,
                to: "/compass",
                category: "device",
            },
            {
                title: "Weather Forecast",
                description: "Get 15-day weather forecasts for any city",
                icon: Cloud,
                to: "/weather",
                category: "device",
            },
            // extras (commented out or future)
            // { title: "Sports Score Checker", description: "Check live sports scores", icon: Trophy, to: "/sports-score", category: "media" },
        ];

        // split into categorized arrays
        return {
            fileTools: all.filter((u) => u.category === "file"),
            productivityTools: all.filter((u) => u.category === "productivity"),
            mediaDeviceTools: all.filter(
                (u) => u.category === "media" || u.category === "device"
            ),
        };
    }, []);

    /* --------------------------
     Filtering by search
     -------------------------- */
    const filter = (list: typeof fileTools) =>
        list
            .filter((utility) => {
                const q = searchQuery.trim().toLowerCase();
                if (!q) return true;
                return (
                    utility.title.toLowerCase().includes(q) ||
                    utility.description.toLowerCase().includes(q)
                );
            })
            .sort((a, b) => a.title.localeCompare(b.title));

    const visibleFileTools = useMemo(
        () => filter(fileTools),
        [fileTools, searchQuery]
    );
    const visibleProductivityTools = useMemo(
        () => filter(productivityTools),
        [productivityTools, searchQuery]
    );
    const visibleMediaDeviceTools = useMemo(
        () => filter(mediaDeviceTools),
        [mediaDeviceTools, searchQuery]
    );

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                        Powerful Utilities at Your Fingertips
                    </h2>
                    <p className="text-muted-foreground text-lg mb-6">
                        Everything you need in one place. Fast, free, and easy
                        to use.
                    </p>

                    <div className="max-w-md mx-auto relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Search utilities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-background/50 border-border/50"
                        />
                    </div>
                </div>

                {/* PRODUCTIVITY TOOLS */}
                <section className="mb-8">
                    <h3 className="text-2xl font-semibold mb-4 border-l-4 border-primary p-2">
                        Productivity Tools
                    </h3>
                    {visibleProductivityTools.length === 0 ? (
                        <p className="text-sm text-muted-foreground mb-4">
                            No productivity tools match your search.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {visibleProductivityTools.map((utility) => (
                                <NavigationCard
                                    key={utility.to}
                                    title={utility.title}
                                    description={utility.description}
                                    icon={utility.icon}
                                    to={utility.to}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* MEDIA & DEVICE TOOLS */}
                <section className="mb-20">
                    <h3 className="text-2xl font-semibold mb-4 border-l-4 border-primary p-2">
                        Media &amp; Device Tools
                    </h3>
                    {visibleMediaDeviceTools.length === 0 ? (
                        <p className="text-sm text-muted-foreground mb-4">
                            No media or device tools match your search.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {visibleMediaDeviceTools.map((utility) => (
                                <NavigationCard
                                    key={utility.to}
                                    title={utility.title}
                                    description={utility.description}
                                    icon={utility.icon}
                                    to={utility.to}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* FILE TOOLS */}
                <section className="mb-8">
                    <h3 className="text-2xl font-semibold mb-4 border-l-4 border-primary p-2">
                        File Tools
                    </h3>
                    {visibleFileTools.length === 0 ? (
                        <p className="text-sm text-muted-foreground mb-4">
                            No file tools match your search.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {visibleFileTools.map((utility) => (
                                <NavigationCard
                                    key={utility.to}
                                    title={utility.title}
                                    description={utility.description}
                                    icon={utility.icon}
                                    to={utility.to}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </Layout>
    );
};

export default Index;
