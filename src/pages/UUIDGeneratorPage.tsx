import Layout from "@/components/Layout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import UUIDGenerator from "@/components/utilities/UUIDGenerator";

import { Binary } from "lucide-react";

const UUIDGeneratorPage = () => {
    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <Card className="bg-gradient-card shadow-card border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Binary className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">
                                UUID Generator
                            </CardTitle>
                        </div>
                        <CardDescription>
                            Generate UUID v4 and v5 with custom formatting
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <UUIDGenerator />
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default UUIDGeneratorPage;
