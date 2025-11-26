import Layout from "@/components/Layout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import VoiceRecorder from "@/components/utilities/VoiceRecorder";
import { Mic } from "lucide-react";

const VoiceRecorderPage = () => {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <Card className="bg-gradient-card shadow-card border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Mic className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">
                                Voice Recorder
                            </CardTitle>
                        </div>
                        <CardDescription>
                            Record your voice and download it as MP3
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <VoiceRecorder />
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default VoiceRecorderPage;
