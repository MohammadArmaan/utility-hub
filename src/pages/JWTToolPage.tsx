// File: /pages/jwt-tool.tsx  (or /app/... depending on your routing)
import Layout from "@/components/Layout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import JWTTool from "@/components/utilities/JWTTool";
import { Lock } from "lucide-react";

const JWTToolPage = () => {
    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <Card className="bg-gradient-card shadow-card border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Lock className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">
                                JWT Encoder / Decoder
                            </CardTitle>
                        </div>
                        <CardDescription>
                            Create, decode and verify JWTs
                            (HS256/HS384/HS512/none) in-browser
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <JWTTool />
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default JWTToolPage;
