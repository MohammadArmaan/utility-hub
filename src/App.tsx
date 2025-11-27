import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import QRCodePage from "./pages/QRCodePage";
import PDFConverterPage from "./pages/PDFConverterPage";
import TimerStopwatchPage from "./pages/TimerStopwatchPage";
import SpeedTestPage from "./pages/SpeedTestPage";
import PasswordGeneratorPage from "./pages/PasswordGeneratorPage";
import UnitConverterPage from "./pages/UnitConverterPage";
import CurrencyConverterPage from "./pages/CurrencyConverterPage";
import CalculatorPage from "./pages/CalculatorPage";
import CalendarPage from "./pages/CalendarPage";
import CompoundInterestPage from "./pages/CompoundInterestPage";
import JSONFormatterPage from "./pages/JSONFormatterPage";
import CompassPage from "./pages/CompassPage";
import MarkdownConverterPage from "./pages/MarkdownConverterPage";
import ColorPalettePage from "./pages/ColorPalettePage";
import Base64Page from "./pages/Base64Page";
import MusicPlayerPage from "./pages/MusicPlayerPage";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import PhotoViewerPage from "./pages/PhotoViewerPage";
import WebcamPage from "./pages/WebcamPage";
import ZipConverterPage from "./pages/ZipConverterPage";
import FileCompressorPage from "./pages/FileCompressorPage";
import ImageConverterPage from "./pages/ImageConverterPage";
import WeatherPage from "./pages/WeatherPage";
import LocationPage from "./pages/LocationPage";
import TextToSpeechPage from "./pages/TextToSpeechPage";
import HomeLoanPage from "./pages/HomeLoanPage";
import SportsScorePage from "./pages/SportsScorePage";
import NotFound from "./pages/NotFound";
import VoiceRecorderPage from "./pages/VoiceRecorderPage";
import ChartMakerPage from "./pages/ChartMakerPage";
import AllCalculatorsPage from "./pages/AllCalculatorsPage";
import UUIDGeneratorPage from "./pages/UUIDGeneratorPage";
import JSONToTSGeneratorPage from "./pages/JSONToTSGeneratorPage";
import JWTToolPage from "./pages/JWTToolPage";
import RandomDataGeneratorPage from "./pages/RandomDataGeneratorPage";
import HashGeneratorPage from "./pages/HashGeneratorPage";
import RegexMakerPage from "./pages/RegexMakerPage";
import GradientGeneratorPage from "./pages/GradientGeneratorPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/qr-code" element={<QRCodePage />} />
          <Route path="/pdf-converter" element={<PDFConverterPage />} />
          <Route path="/timer-stopwatch" element={<TimerStopwatchPage />} />
          <Route path="/speed-test" element={<SpeedTestPage />} />
          <Route path="/password-generator" element={<PasswordGeneratorPage />} />
          <Route path="/unit-converter" element={<UnitConverterPage />} />
          <Route path="/currency-converter" element={<CurrencyConverterPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/all-in-one-calculator" element={<AllCalculatorsPage />} />
          <Route path="/uuid-generator" element={<UUIDGeneratorPage />} />
          <Route path="/json-to-ts" element={<JSONToTSGeneratorPage />} />
          <Route path="/jwt-tool" element={<JWTToolPage />} />
          <Route path="/random-data" element={<RandomDataGeneratorPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/compound-interest" element={<CompoundInterestPage />} />
          <Route path="/chart-maker" element={<ChartMakerPage />} />
          <Route path="/json-formatter" element={<JSONFormatterPage />} />
          <Route path="/hash-generator" element={<HashGeneratorPage />} />
          <Route path="/regex-maker" element={<RegexMakerPage />} />
          <Route path="/compass" element={<CompassPage />} />
          <Route path="/markdown-converter" element={<MarkdownConverterPage />} />
          <Route path="/color-palette" element={<ColorPalettePage />} />
          <Route path="/gradient-generator" element={<GradientGeneratorPage />} />
          <Route path="/base64" element={<Base64Page />} />
          <Route path="/music-player" element={<MusicPlayerPage />} />
          <Route path="/video-player" element={<VideoPlayerPage />} />
          <Route path="/photo-viewer" element={<PhotoViewerPage />} />
          <Route path="/webcam" element={<WebcamPage />} />
          <Route path="/zip-converter" element={<ZipConverterPage />} />
          <Route path="/file-compressor" element={<FileCompressorPage />} />
          <Route path="/image-converter" element={<ImageConverterPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/text-to-speech" element={<TextToSpeechPage />} />
          <Route path="/home-loan" element={<HomeLoanPage />} />
          {/* <Route path="/sports-score" element={<SportsScorePage />} /> */}
          <Route path="/voice-recorder" element={<VoiceRecorderPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
