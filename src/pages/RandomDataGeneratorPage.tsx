import Layout from "@/components/Layout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import RandomDataGenerator from "@/components/utilities/RandomDataGenerator";
import { Sparkles } from "lucide-react";

const RandomDataGeneratorPage = () => {
    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <Card className="bg-gradient-card shadow-card border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">
                                Random Data Generator
                            </CardTitle>
                        </div>
                        <CardDescription>
                            Generate random names, emails, phone numbers & more
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <RandomDataGenerator />
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default RandomDataGeneratorPage;
