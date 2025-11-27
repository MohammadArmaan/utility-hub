import Layout from "@/components/Layout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import HashGenerator from "@/components/utilities/HashGenerator";
import { Fingerprint } from "lucide-react";

const HashGeneratorPage = () => {
    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <Card className="bg-gradient-card shadow-card border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Fingerprint className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">
                                Hash Generator
                            </CardTitle>
                        </div>
                        <CardDescription>
                            Generate SHA, MD5, Keccak and other cryptographic
                            hashes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <HashGenerator />
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default HashGeneratorPage;
