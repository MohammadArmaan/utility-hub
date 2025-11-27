import Layout from "@/components/Layout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import GradientGenerator from "@/components/utilities/GradientGenerator";
import { Palette } from "lucide-react";

const GradientGeneratorPage = () => {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <Card className="bg-gradient-card shadow-card border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Palette className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">
                                Gradient Generator
                            </CardTitle>
                        </div>
                        <CardDescription>
                            Create linear, radial and conic gradients —
                            Tailwind-ready
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <GradientGenerator />
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default GradientGeneratorPage;
