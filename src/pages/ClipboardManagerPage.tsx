import Layout from "@/components/Layout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import ClipboardManager from "@/components/utilities/ClipboardManager";
import { Copy } from "lucide-react";

const ClipboardManagerPage = () => {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <Card className="bg-gradient-card shadow-card border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Copy className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">
                                Clipboard Manager
                            </CardTitle>
                        </div>
                        <CardDescription>
                            Save, search and manage your clipboard history
                            (local only)
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <ClipboardManager />
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default ClipboardManagerPage;
